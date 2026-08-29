use std::path::PathBuf;
use std::process::Command;

fn fixture(name: &str) -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests/fixtures")
        .join(name)
}

#[test]
fn documented_cli_example_emits_markdown() {
    let output = Command::new(env!("CARGO_BIN_EXE_dcic"))
        .args([
            "analyze",
            "--manifest",
            fixture("lineage.yaml").to_str().unwrap(),
            "--changes",
            fixture("changes.yaml").to_str().unwrap(),
        ])
        .output()
        .unwrap();
    assert!(output.status.success());
    let stdout = String::from_utf8(output.stdout).unwrap();
    assert!(stdout.contains("**Disposition:** READY"));
    assert!(stdout.contains("`mart.revenue`"));
}

#[test]
fn json_flag_is_scriptable() {
    let output = Command::new(env!("CARGO_BIN_EXE_dcic"))
        .args([
            "analyze",
            "-m",
            fixture("lineage.yaml").to_str().unwrap(),
            "-c",
            fixture("changes.yaml").to_str().unwrap(),
            "--json",
        ])
        .output()
        .unwrap();
    assert!(output.status.success());
    let value: serde_json::Value = serde_json::from_slice(&output.stdout).unwrap();
    assert_eq!(value["schema_version"], 1);
    assert_eq!(value["summary"]["stale_assets"], 2);
}

#[test]
fn missing_file_uses_exit_code_one() {
    let output = Command::new(env!("CARGO_BIN_EXE_dcic"))
        .args(["analyze", "-m", "absent.yaml", "-c", "absent-too.yaml"])
        .output()
        .unwrap();
    assert_eq!(output.status.code(), Some(1));
}

#[test]
fn acceptance_fixture_finds_every_expected_node_and_no_unrelated_node() {
    let output = Command::new(env!("CARGO_BIN_EXE_dcic"))
        .args([
            "analyze",
            "-m",
            fixture("lineage-30.yaml").to_str().unwrap(),
            "-c",
            fixture("changes-5.yaml").to_str().unwrap(),
            "--json",
        ])
        .output()
        .unwrap();
    assert!(output.status.success());
    let value: serde_json::Value = serde_json::from_slice(&output.stdout).unwrap();
    let impacted = value["impacted"].as_array().unwrap();
    assert_eq!(impacted.len(), 20);
    assert!(impacted.iter().all(|item| {
        item["node"]
            .as_str()
            .is_some_and(|node| node.starts_with("chain."))
    }));
    assert_eq!(value["summary"]["known_estimate_minutes"], 20);
}

#[test]
fn demo_runs_bundled_sample_and_prints_the_output_path() {
    let output = Command::new(env!("CARGO_BIN_EXE_dcic"))
        .arg("demo")
        .output()
        .unwrap();
    assert!(output.status.success());
    let stdout = String::from_utf8(output.stdout).unwrap();
    assert!(stdout.contains("Demo — bundled sample data"));
    let impact_path = stdout
        .lines()
        .find_map(|line| line.strip_prefix("Impact card: "))
        .expect("demo prints the impact card path");
    let impact = std::fs::read_to_string(impact_path).expect("demo writes an impact card");
    assert!(impact.contains("**Disposition:** READY"));
    assert!(impact.contains("`mart.revenue`"));
}

#[test]
fn demo_flag_runs_the_same_bundled_sample() {
    let output = Command::new(env!("CARGO_BIN_EXE_dcic"))
        .arg("--demo")
        .output()
        .unwrap();
    assert!(output.status.success());
    assert!(
        String::from_utf8(output.stdout)
            .unwrap()
            .contains("Result: 2 stale assets, 7 known minutes, 0 unknown edges.")
    );
}
