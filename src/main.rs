use clap::{Args, Parser, Subcommand, ValueEnum};
use data_change_impact_card::{
    Error, analyze, parse_changes, parse_manifest, redact, render_json, render_markdown,
};
use std::fs;
use std::io::{self, Read, Write};
use std::path::PathBuf;
use std::process::ExitCode;

#[derive(Parser)]
#[command(
    name = "dcic",
    version,
    about = "Explain what became stale before you recompute",
    long_about = "Build a deterministic Markdown or JSON impact card from declared lineage and explicit version changes. dcic is read-only: it never connects to production or runs recomputation commands."
)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Trace explicit changes through declared downstream lineage
    Analyze(AnalyzeArgs),
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
    let Command::Analyze(args) = cli.command;
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
