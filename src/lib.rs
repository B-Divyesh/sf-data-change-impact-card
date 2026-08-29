//! Deterministic change-impact analysis for declared data lineage.
//!
//! The crate contains no connectors or job runner. Call [`analyze`] with parsed
//! inputs, then [`render_markdown`] or [`render_json`] to create an artifact.

use serde::{Deserialize, Serialize};
use std::collections::{BTreeMap, BTreeSet, VecDeque};
use std::fmt::{Display, Formatter};

pub const OUTPUT_SCHEMA_VERSION: u32 = 1;

#[derive(Debug)]
pub enum Error {
    Parse(String),
    Invalid(String),
    Serialize(String),
}

impl Display for Error {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Parse(message) => write!(f, "could not parse input: {message}"),
            Self::Invalid(message) => write!(f, "invalid input: {message}"),
            Self::Serialize(message) => write!(f, "could not serialize card: {message}"),
        }
    }
}

impl std::error::Error for Error {}

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Manifest {
    pub schema_version: u32,
    pub completeness: Completeness,
    #[serde(default)]
    pub nodes: Vec<Node>,
}

#[derive(Debug, Clone, Copy, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum Completeness {
    Complete,
    Partial,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Node {
    pub id: String,
    #[serde(default = "default_kind")]
    pub kind: String,
    #[serde(default)]
    pub depends_on: Vec<String>,
    pub recompute: Option<String>,
    pub estimate_minutes: Option<u32>,
}

fn default_kind() -> String {
    "asset".to_owned()
}

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ChangeSet {
    pub schema_version: u32,
    #[serde(default)]
    pub changes: Vec<Change>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Change {
    pub node: String,
    pub from: String,
    pub to: String,
    pub summary: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct ImpactReport {
    pub schema_version: u32,
    pub input_completeness: Completeness,
    pub summary: Summary,
    pub changes: Vec<Change>,
    pub impacted: Vec<ImpactedNode>,
    pub recompute_order: Vec<RecomputeStep>,
    pub unknown_edges: Vec<UnknownEdge>,
    pub warnings: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct Summary {
    pub changes: usize,
    pub stale_assets: usize,
    pub known_estimate_minutes: u32,
    pub assets_without_estimate: usize,
    pub unknown_edges: usize,
    pub disposition: Disposition,
}

#[derive(Debug, Clone, Copy, Serialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum Disposition {
    Ready,
    ReviewRequired,
    NoImpact,
}

#[derive(Debug, Clone, Serialize)]
pub struct ImpactedNode {
    pub node: String,
    pub kind: String,
    pub reasons: Vec<StaleReason>,
}

#[derive(Debug, Clone, Serialize)]
pub struct StaleReason {
    pub changed_node: String,
    pub from: String,
    pub to: String,
    pub path: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct RecomputeStep {
    pub position: usize,
    pub node: String,
    pub command: Option<String>,
    pub estimate_minutes: Option<u32>,
    pub status: StepStatus,
}

#[derive(Debug, Clone, Copy, Serialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum StepStatus {
    Ready,
    ReviewRequired,
    RecipeMissing,
}

#[derive(Debug, Clone, Serialize)]
pub struct UnknownEdge {
    pub upstream: String,
    pub downstream: Option<String>,
    pub reason: UnknownReason,
}

#[derive(Debug, Clone, Copy, Serialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum UnknownReason {
    DependencyNotDeclared,
    ChangedNodeNotDeclared,
}

/// Parse a YAML or JSON manifest.
pub fn parse_manifest(input: &str) -> Result<Manifest, Error> {
    serde_yaml::from_str(input).map_err(|error| Error::Parse(error.to_string()))
}

/// Parse YAML or JSON change events.
pub fn parse_changes(input: &str) -> Result<ChangeSet, Error> {
    serde_yaml::from_str(input).map_err(|error| Error::Parse(error.to_string()))
}

/// Analyze declared changes without connecting to or mutating any data system.
pub fn analyze(manifest: &Manifest, changes: &ChangeSet) -> Result<ImpactReport, Error> {
    validate_versions(manifest.schema_version, changes.schema_version)?;

    let mut nodes = BTreeMap::new();
    for node in &manifest.nodes {
        if node.id.trim().is_empty() {
            return Err(Error::Invalid(
                "node identifiers cannot be empty".to_owned(),
            ));
        }
        if node
            .depends_on
            .iter()
            .any(|dependency| dependency.trim().is_empty())
        {
            return Err(Error::Invalid(format!(
                "node '{}' has an empty dependency identifier",
                node.id
            )));
        }
        if nodes.insert(node.id.clone(), node).is_some() {
            return Err(Error::Invalid(format!(
                "node identifier '{}' is declared more than once",
                node.id
            )));
        }
    }

    for change in &changes.changes {
        if change.node.trim().is_empty()
            || change.from.trim().is_empty()
            || change.to.trim().is_empty()
        {
            return Err(Error::Invalid(
                "change node, from, and to values cannot be empty".to_owned(),
            ));
        }
        if change.from == change.to {
            return Err(Error::Invalid(format!(
                "change for '{}' has identical from and to versions",
                change.node
            )));
        }
    }

    let mut downstream: BTreeMap<String, Vec<String>> = BTreeMap::new();
    let mut unknown_edges = Vec::new();
    for node in nodes.values() {
        for dependency in &node.depends_on {
            if nodes.contains_key(dependency) {
                downstream
                    .entry(dependency.clone())
                    .or_default()
                    .push(node.id.clone());
            } else {
                unknown_edges.push(UnknownEdge {
                    upstream: dependency.clone(),
                    downstream: Some(node.id.clone()),
                    reason: UnknownReason::DependencyNotDeclared,
                });
            }
        }
    }
    for children in downstream.values_mut() {
        children.sort();
        children.dedup();
    }

    let topo = topological_order(&nodes, &downstream)?;
    let mut reasons: BTreeMap<String, Vec<StaleReason>> = BTreeMap::new();
    for change in &changes.changes {
        if !nodes.contains_key(&change.node) {
            unknown_edges.push(UnknownEdge {
                upstream: change.node.clone(),
                downstream: None,
                reason: UnknownReason::ChangedNodeNotDeclared,
            });
            continue;
        }

        let mut queue = VecDeque::new();
        let mut visited = BTreeSet::new();
        queue.push_back((change.node.clone(), vec![change.node.clone()]));
        visited.insert(change.node.clone());
        while let Some((current, path)) = queue.pop_front() {
            for child in downstream.get(&current).into_iter().flatten() {
                if visited.insert(child.clone()) {
                    let mut child_path = path.clone();
                    child_path.push(child.clone());
                    reasons.entry(child.clone()).or_default().push(StaleReason {
                        changed_node: change.node.clone(),
                        from: change.from.clone(),
                        to: change.to.clone(),
                        path: child_path.clone(),
                    });
                    queue.push_back((child.clone(), child_path));
                }
            }
        }
    }

    unknown_edges.sort_by(|left, right| {
        (&left.upstream, &left.downstream).cmp(&(&right.upstream, &right.downstream))
    });
    unknown_edges.dedup_by(|left, right| {
        left.upstream == right.upstream
            && left.downstream == right.downstream
            && left.reason == right.reason
    });

    let uncertain = uncertain_nodes(&unknown_edges, &downstream);
    let mut impacted = Vec::new();
    let mut recompute_order = Vec::new();
    let mut estimate = 0u32;
    let mut without_estimate = 0usize;
    for node_id in topo {
        let Some(mut node_reasons) = reasons.remove(&node_id) else {
            continue;
        };
        node_reasons.sort_by(|left, right| left.changed_node.cmp(&right.changed_node));
        let node = nodes[&node_id];
        match node.estimate_minutes {
            Some(minutes) => estimate = estimate.saturating_add(minutes),
            None => without_estimate += 1,
        }
        let status = if node.recompute.is_none() {
            StepStatus::RecipeMissing
        } else if manifest.completeness == Completeness::Partial || uncertain.contains(&node_id) {
            StepStatus::ReviewRequired
        } else {
            StepStatus::Ready
        };
        impacted.push(ImpactedNode {
            node: node_id.clone(),
            kind: node.kind.clone(),
            reasons: node_reasons,
        });
        recompute_order.push(RecomputeStep {
            position: recompute_order.len() + 1,
            node: node_id,
            command: node.recompute.clone(),
            estimate_minutes: node.estimate_minutes,
            status,
        });
    }

    let mut warnings = Vec::new();
    if manifest.completeness == Completeness::Partial {
        warnings.push(
            "The manifest declares partial lineage; absence of impact is not proof of safety."
                .to_owned(),
        );
    }
    if !unknown_edges.is_empty() {
        warnings.push(format!(
            "{} unknown edge(s) need review before relying on the recomputation plan.",
            unknown_edges.len()
        ));
    }
    let missing_recipes = recompute_order
        .iter()
        .filter(|step| step.status == StepStatus::RecipeMissing)
        .count();
    if missing_recipes > 0 {
        warnings.push(format!(
            "{missing_recipes} stale asset(s) have no declared recompute command."
        ));
    }

    let disposition = if impacted.is_empty() {
        Disposition::NoImpact
    } else if manifest.completeness == Completeness::Partial
        || !unknown_edges.is_empty()
        || recompute_order
            .iter()
            .any(|step| step.status != StepStatus::Ready)
    {
        Disposition::ReviewRequired
    } else {
        Disposition::Ready
    };

    Ok(ImpactReport {
        schema_version: OUTPUT_SCHEMA_VERSION,
        input_completeness: manifest.completeness,
        summary: Summary {
            changes: changes.changes.len(),
            stale_assets: impacted.len(),
            known_estimate_minutes: estimate,
            assets_without_estimate: without_estimate,
            unknown_edges: unknown_edges.len(),
            disposition,
        },
        changes: changes.changes.clone(),
        impacted,
        recompute_order,
        unknown_edges,
        warnings,
    })
}

fn validate_versions(manifest: u32, changes: u32) -> Result<(), Error> {
    if manifest != 1 || changes != 1 {
        return Err(Error::Invalid(format!(
            "only schema_version 1 is supported (manifest: {manifest}, changes: {changes})"
        )));
    }
    Ok(())
}

fn topological_order(
    nodes: &BTreeMap<String, &Node>,
    downstream: &BTreeMap<String, Vec<String>>,
) -> Result<Vec<String>, Error> {
    let mut indegree = BTreeMap::new();
    for (id, node) in nodes {
        let known = node
            .depends_on
            .iter()
            .filter(|dependency| nodes.contains_key(*dependency))
            .collect::<BTreeSet<_>>()
            .len();
        indegree.insert(id.clone(), known);
    }
    let mut ready: BTreeSet<String> = indegree
        .iter()
        .filter(|(_, degree)| **degree == 0)
        .map(|(id, _)| id.clone())
        .collect();
    let mut ordered = Vec::with_capacity(nodes.len());
    while let Some(id) = ready.pop_first() {
        ordered.push(id.clone());
        for child in downstream.get(&id).into_iter().flatten() {
            let degree = indegree.get_mut(child).expect("known child");
            *degree -= 1;
            if *degree == 0 {
                ready.insert(child.clone());
            }
        }
    }
    if ordered.len() != nodes.len() {
        let cycle_nodes = indegree
            .into_iter()
            .filter(|(_, degree)| *degree > 0)
            .map(|(id, _)| id)
            .collect::<Vec<_>>()
            .join(", ");
        return Err(Error::Invalid(format!(
            "lineage contains a cycle involving: {cycle_nodes}"
        )));
    }
    Ok(ordered)
}

fn uncertain_nodes(
    unknown_edges: &[UnknownEdge],
    downstream: &BTreeMap<String, Vec<String>>,
) -> BTreeSet<String> {
    let mut uncertain = BTreeSet::new();
    let mut queue = VecDeque::new();
    for edge in unknown_edges {
        if let Some(node) = &edge.downstream {
            if uncertain.insert(node.clone()) {
                queue.push_back(node.clone());
            }
        }
    }
    while let Some(node) = queue.pop_front() {
        for child in downstream.get(&node).into_iter().flatten() {
            if uncertain.insert(child.clone()) {
                queue.push_back(child.clone());
            }
        }
    }
    uncertain
}

/// Replace identifiers with deterministic aliases and remove potentially
/// identifying free text and commands.
pub fn redact(report: &mut ImpactReport) {
    let mut identifiers = BTreeSet::new();
    for change in &report.changes {
        identifiers.insert(change.node.clone());
    }
    for item in &report.impacted {
        identifiers.insert(item.node.clone());
        for reason in &item.reasons {
            identifiers.insert(reason.changed_node.clone());
            identifiers.extend(reason.path.iter().cloned());
        }
    }
    for edge in &report.unknown_edges {
        identifiers.insert(edge.upstream.clone());
        identifiers.extend(edge.downstream.iter().cloned());
    }
    let aliases: BTreeMap<String, String> = identifiers
        .into_iter()
        .enumerate()
        .map(|(index, id)| (id, format!("NODE-{:03}", index + 1)))
        .collect();
    let alias = |id: &mut String| {
        if let Some(replacement) = aliases.get(id) {
            *id = replacement.clone();
        }
    };
    for change in &mut report.changes {
        alias(&mut change.node);
        change.summary = None;
    }
    for item in &mut report.impacted {
        alias(&mut item.node);
        for reason in &mut item.reasons {
            alias(&mut reason.changed_node);
            for path_node in &mut reason.path {
                alias(path_node);
            }
        }
    }
    for step in &mut report.recompute_order {
        alias(&mut step.node);
        step.command = None;
    }
    for edge in &mut report.unknown_edges {
        alias(&mut edge.upstream);
        if let Some(node) = &mut edge.downstream {
            alias(node);
        }
    }
}

pub fn render_json(report: &ImpactReport) -> Result<String, Error> {
    serde_json::to_string_pretty(report)
        .map(|mut output| {
            output.push('\n');
            output
        })
        .map_err(|error| Error::Serialize(error.to_string()))
}

pub fn render_markdown(report: &ImpactReport) -> String {
    let mut output = String::new();
    output.push_str("# Data change impact card\n\n");
    output.push_str(&format!(
        "**Disposition:** {} · **Input lineage:** {} · **Changes:** {} · **Stale assets:** {}\n\n",
        disposition_label(report.summary.disposition),
        completeness_label(report.input_completeness),
        report.summary.changes,
        report.summary.stale_assets
    ));
    output.push_str(&format!(
        "**Known recompute estimate:** {} min · **Assets without estimates:** {} · **Unknown edges:** {}\n\n",
        report.summary.known_estimate_minutes,
        report.summary.assets_without_estimate,
        report.summary.unknown_edges
    ));

    if report.changes.is_empty() {
        output.push_str("## Declared changes\n\nNo changes were supplied.\n\n");
    } else {
        output.push_str("## Declared changes\n\n");
        for change in &report.changes {
            let detail = change
                .summary
                .as_deref()
                .map(|summary| format!(" — {summary}"))
                .unwrap_or_default();
            output.push_str(&format!(
                "- `{}`: `{}` → `{}`{}\n",
                change.node, change.from, change.to, detail
            ));
        }
        output.push('\n');
    }

    if report.impacted.is_empty() {
        output.push_str(
            "## Stale assets\n\nNo downstream stale assets were found in the declared lineage.\n\n",
        );
    } else {
        output.push_str("## Stale assets\n\n");
        for item in &report.impacted {
            output.push_str(&format!("### `{}` ({})\n\n", item.node, item.kind));
            for reason in &item.reasons {
                output.push_str(&format!(
                    "- `{}` changed `{}` → `{}` via {}\n",
                    reason.changed_node,
                    reason.from,
                    reason.to,
                    reason
                        .path
                        .iter()
                        .map(|node| format!("`{node}`"))
                        .collect::<Vec<_>>()
                        .join(" → ")
                ));
            }
            output.push('\n');
        }
    }

    output.push_str("## Recompute order\n\n");
    if report.recompute_order.is_empty() {
        output.push_str("No recomputation is indicated.\n\n");
    } else {
        for step in &report.recompute_order {
            let command = step
                .command
                .as_deref()
                .map(|value| format!(" — `{value}`"))
                .unwrap_or_else(|| " — command not declared".to_owned());
            let estimate = step
                .estimate_minutes
                .map(|minutes| format!(", {minutes} min"))
                .unwrap_or_else(|| ", estimate unknown".to_owned());
            output.push_str(&format!(
                "{}. `{}` — {}{}{}\n",
                step.position,
                step.node,
                step_status_label(step.status),
                estimate,
                command
            ));
        }
        output.push('\n');
    }

    output.push_str("## Unknown edges and cautions\n\n");
    if report.unknown_edges.is_empty() && report.warnings.is_empty() {
        output.push_str("None declared. The plan is safe within the supplied complete lineage.\n");
    } else {
        for edge in &report.unknown_edges {
            match (&edge.downstream, edge.reason) {
                (Some(downstream), UnknownReason::DependencyNotDeclared) => {
                    output.push_str(&format!(
                        "- Unknown dependency: `{downstream}` names undeclared upstream `{}`.\n",
                        edge.upstream
                    ))
                }
                (_, UnknownReason::ChangedNodeNotDeclared) => output.push_str(&format!(
                    "- Unknown changed node: `{}` is absent from the manifest.\n",
                    edge.upstream
                )),
                (None, UnknownReason::DependencyNotDeclared) => output.push_str(&format!(
                    "- Unknown dependency: undeclared upstream `{}` has no declared downstream.\n",
                    edge.upstream
                )),
            }
        }
        for warning in &report.warnings {
            output.push_str(&format!("- Caution: {warning}\n"));
        }
    }
    output
}

fn disposition_label(value: Disposition) -> &'static str {
    match value {
        Disposition::Ready => "READY",
        Disposition::ReviewRequired => "REVIEW REQUIRED",
        Disposition::NoImpact => "NO IMPACT",
    }
}

fn completeness_label(value: Completeness) -> &'static str {
    match value {
        Completeness::Complete => "complete",
        Completeness::Partial => "partial",
    }
}

fn step_status_label(value: StepStatus) -> &'static str {
    match value {
        StepStatus::Ready => "ready",
        StepStatus::ReviewRequired => "review required",
        StepStatus::RecipeMissing => "recipe missing",
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const MANIFEST: &str = r#"
schema_version: 1
completeness: complete
nodes:
  - id: raw.orders
    kind: source
  - id: clean.orders
    kind: model
    depends_on: [raw.orders]
    recompute: dbt run --select clean.orders
    estimate_minutes: 2
  - id: mart.revenue
    kind: table
    depends_on: [clean.orders]
    recompute: dbt run --select mart.revenue
    estimate_minutes: 5
  - id: unrelated
"#;

    const CHANGES: &str = r#"
schema_version: 1
changes:
  - node: raw.orders
    from: v41
    to: v42
    summary: currency_code became required
"#;

    #[test]
    fn documented_example_returns_only_downstream_assets() {
        let manifest = parse_manifest(MANIFEST).unwrap();
        let changes = parse_changes(CHANGES).unwrap();
        let report = analyze(&manifest, &changes).unwrap();
        let ids: Vec<_> = report
            .impacted
            .iter()
            .map(|item| item.node.as_str())
            .collect();
        assert_eq!(ids, ["clean.orders", "mart.revenue"]);
        assert_eq!(report.summary.known_estimate_minutes, 7);
        assert_eq!(report.summary.disposition, Disposition::Ready);
    }

    #[test]
    fn reports_unknown_dependencies_and_propagates_uncertainty() {
        let manifest = parse_manifest(&MANIFEST.replace(
            "depends_on: [raw.orders]",
            "depends_on: [raw.orders, missing.exchange_rates]",
        ))
        .unwrap();
        let report = analyze(&manifest, &parse_changes(CHANGES).unwrap()).unwrap();
        assert_eq!(report.unknown_edges.len(), 1);
        assert!(
            report
                .recompute_order
                .iter()
                .all(|step| step.status == StepStatus::ReviewRequired)
        );
    }

    #[test]
    fn rejects_cycles() {
        let manifest = parse_manifest(
            "schema_version: 1\ncompleteness: complete\nnodes:\n  - id: a\n    depends_on: [b]\n  - id: b\n    depends_on: [a]\n",
        )
        .unwrap();
        let error = analyze(
            &manifest,
            &parse_changes("schema_version: 1\nchanges: []").unwrap(),
        )
        .unwrap_err();
        assert!(error.to_string().contains("cycle"));
    }

    #[test]
    fn redaction_removes_ids_summaries_and_commands() {
        let mut report = analyze(
            &parse_manifest(MANIFEST).unwrap(),
            &parse_changes(CHANGES).unwrap(),
        )
        .unwrap();
        redact(&mut report);
        let output = render_json(&report).unwrap();
        assert!(!output.contains("raw.orders"));
        assert!(!output.contains("currency_code"));
        assert!(!output.contains("dbt run"));
        assert!(output.contains("NODE-"));
    }

    #[test]
    fn markdown_has_all_decision_sections() {
        let report = analyze(
            &parse_manifest(MANIFEST).unwrap(),
            &parse_changes(CHANGES).unwrap(),
        )
        .unwrap();
        let output = render_markdown(&report);
        assert!(output.contains("# Data change impact card"));
        assert!(output.contains("## Stale assets"));
        assert!(output.contains("## Recompute order"));
        assert!(output.contains("## Unknown edges and cautions"));
    }
}
