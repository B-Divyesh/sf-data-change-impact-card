use clap::{Args, Parser, Subcommand, ValueEnum};
use data_change_impact_card::{
    Error, analyze, parse_changes, parse_manifest, redact, render_json, render_markdown,
};
use std::fs;
use std::io::{self, Read, Write};
use std::path::PathBuf;
use std::process::ExitCode;
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Parser)]
#[command(
    name = "dcic",
    version,
    about = "Explain what became stale before you recompute",
    long_about = "Build a deterministic Markdown or JSON impact card from declared lineage and explicit version changes. dcic is read-only: it never connects to production or runs recomputation commands."
)]
struct Cli {
    /// Run the bundled sample in a temporary directory
    #[arg(long, global = true)]
    demo: bool,

    #[command(subcommand)]
    command: Option<Command>,
}

#[derive(Subcommand)]
enum Command {
    /// Trace explicit changes through declared downstream lineage
    Analyze(AnalyzeArgs),
    /// Run bundled sample data and print the generated impact card path
    Demo,
}

#[derive(Args)]
struct AnalyzeArgs {
    /// YAML/JSON lineage manifest, or - for stdin
    #[arg(short, long, value_name = "FILE")]
    manifest: PathBuf,

    /// YAML/JSON change events, or - for stdin
    #[arg(short, long, value_name = "FILE")]
    changes: PathBuf,

    /// Output format (defaults to markdown)
    #[arg(long, value_enum, default_value_t = Format::Markdown)]
    format: Format,

    /// Shorthand for --format json
    #[arg(long, conflicts_with = "format")]
    json: bool,

    /// Replace node names with stable aliases and remove free text/commands
    #[arg(long)]
    redact: bool,

    /// Write the card to a file instead of stdout
    #[arg(short, long, value_name = "FILE")]
    output: Option<PathBuf>,
}

#[derive(Clone, Copy, ValueEnum)]
enum Format {
    Markdown,
    Json,
}

enum RunError {
    Input(Error),
    Io(String),
}

fn main() -> ExitCode {
    match run(Cli::parse()) {
        Ok(()) => ExitCode::SUCCESS,
        Err(RunError::Input(error)) => {
            eprintln!("dcic: {error}");
            match error {
                Error::Parse(_) | Error::Invalid(_) => ExitCode::from(2),
                Error::Serialize(_) => ExitCode::from(1),
            }
        }
        Err(RunError::Io(message)) => {
            eprintln!("dcic: {message}");
            ExitCode::from(1)
        }
    }
}

fn run(cli: Cli) -> Result<(), RunError> {
    match (cli.demo, cli.command) {
        (true, None) | (false, Some(Command::Demo)) | (true, Some(Command::Demo)) => run_demo(),
        (true, Some(Command::Analyze(_))) => Err(RunError::Input(Error::Invalid(
            "--demo cannot be combined with analyze; use either 'dcic demo' or 'dcic analyze'"
                .to_owned(),
        ))),
        (false, None) => Err(RunError::Input(Error::Invalid(
            "choose 'analyze' for your files or 'demo' for the bundled sample".to_owned(),
        ))),
        (false, Some(Command::Analyze(args))) => run_analyze(args),
    }
}

fn run_analyze(args: AnalyzeArgs) -> Result<(), RunError> {
    if args.manifest.as_os_str() == "-" && args.changes.as_os_str() == "-" {
        return Err(RunError::Input(Error::Invalid(
            "manifest and changes cannot both read from stdin".to_owned(),
        )));
    }
    let manifest_text = read_input(&args.manifest)?;
    let changes_text = read_input(&args.changes)?;
    let manifest = parse_manifest(&manifest_text).map_err(RunError::Input)?;
    let changes = parse_changes(&changes_text).map_err(RunError::Input)?;
    let mut report = analyze(&manifest, &changes).map_err(RunError::Input)?;
    if args.redact {
        redact(&mut report);
    }
    let format = if args.json { Format::Json } else { args.format };
    let rendered = match format {
        Format::Markdown => render_markdown(&report),
        Format::Json => render_json(&report).map_err(RunError::Input)?,
    };
    write_output(args.output.as_ref(), rendered.as_bytes())
}

/// Run a complete, deterministic sample without reading a user's project.
/// The files remain in a unique temporary directory so a visitor can inspect
/// the exact input and output before deleting that directory.
fn run_demo() -> Result<(), RunError> {
    const MANIFEST: &str = include_str!("../examples/lineage.yaml");
    const CHANGES: &str = include_str!("../examples/changes.yaml");

    let nonce = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|error| RunError::Io(format!("could not create demo directory name: {error}")))?
        .as_nanos();
    let directory = std::env::temp_dir().join(format!("dcic-demo-{}-{nonce}", std::process::id()));
    fs::create_dir(&directory).map_err(|error| {
        RunError::Io(format!(
            "could not create '{}': {error}",
            directory.display()
        ))
    })?;

    let manifest_path = directory.join("lineage.yaml");
    let changes_path = directory.join("changes.yaml");
    let output_path = directory.join("impact.md");
    fs::write(&manifest_path, MANIFEST).map_err(|error| {
        RunError::Io(format!(
            "could not write '{}': {error}",
            manifest_path.display()
        ))
    })?;
    fs::write(&changes_path, CHANGES).map_err(|error| {
        RunError::Io(format!(
            "could not write '{}': {error}",
            changes_path.display()
        ))
    })?;

    let manifest = parse_manifest(MANIFEST).map_err(RunError::Input)?;
    let changes = parse_changes(CHANGES).map_err(RunError::Input)?;
    let report = analyze(&manifest, &changes).map_err(RunError::Input)?;
    fs::write(&output_path, render_markdown(&report)).map_err(|error| {
        RunError::Io(format!(
            "could not write '{}': {error}",
            output_path.display()
        ))
    })?;

    println!("Demo — bundled sample data; no production connection or job run.");
    println!("Sample directory: {}", directory.display());
    println!("Impact card: {}", output_path.display());
    println!(
        "Result: {} stale assets, {} known minutes, {} unknown edges.",
        report.summary.stale_assets,
        report.summary.known_estimate_minutes,
        report.summary.unknown_edges
    );
    Ok(())
}

fn read_input(path: &PathBuf) -> Result<String, RunError> {
    if path.as_os_str() == "-" {
        let mut input = String::new();
        io::stdin()
            .read_to_string(&mut input)
            .map_err(|error| RunError::Io(format!("could not read stdin: {error}")))?;
        Ok(input)
    } else {
        fs::read_to_string(path)
            .map_err(|error| RunError::Io(format!("could not read '{}': {error}", path.display())))
    }
}

fn write_output(path: Option<&PathBuf>, contents: &[u8]) -> Result<(), RunError> {
    match path {
        Some(path) => fs::write(path, contents).map_err(|error| {
            RunError::Io(format!("could not write '{}': {error}", path.display()))
        }),
        None => io::stdout()
            .write_all(contents)
            .map_err(|error| RunError::Io(format!("could not write stdout: {error}"))),
    }
}
