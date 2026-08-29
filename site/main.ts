const examples = {
  command: `$ dcic analyze \\
  --manifest lineage.yaml \\
  --changes changes.yaml \\
  --output impact.md`,
  manifest: `schema_version: 1
completeness: complete
nodes:
  - id: raw.orders
    kind: source
  - id: clean.orders
    depends_on: [raw.orders]
    recompute: dbt run --select clean.orders
    estimate_minutes: 2
  - id: mart.revenue
    depends_on: [clean.orders]
    recompute: dbt run --select mart.revenue
    estimate_minutes: 5`,
  json: `{
  "schema_version": 1,
  "input_completeness": "complete",
  "summary": {
    "changes": 1,
    "stale_assets": 2,
    "known_estimate_minutes": 7,
    "unknown_edges": 0,
    "disposition": "ready"
  }
}`
} as const;

type ExampleView = keyof typeof examples;

const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>("[role='tab']"));
const code = document.querySelector<HTMLElement>("#demo-code");
const panel = document.querySelector<HTMLElement>("#terminal-code");

function selectTab(tab: HTMLButtonElement) {
  const view = tab.dataset.view as ExampleView;
  tabs.forEach((item) => {
    const active = item === tab;
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
  });
  if (code && panel) {
    code.textContent = examples[view];
    panel.setAttribute("aria-labelledby", tab.id);
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let target = index;
    if (event.key === "ArrowLeft") target = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") target = (index + 1) % tabs.length;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = tabs.length - 1;
    selectTab(tabs[target]);
    tabs[target].focus();
  });
});

const runButton = document.querySelector<HTMLButtonElement>("#run-demo");
const status = document.querySelector<HTMLElement>("#demo-status");
const impact = document.querySelector<HTMLElement>("#impact-sheet");
runButton?.addEventListener("click", () => {
  runButton.disabled = true;
  if (status) status.textContent = "Tracing 3 declared nodes…";
  impact?.classList.remove("placed");
  window.setTimeout(() => {
    impact?.classList.add("placed");
    if (status) status.textContent = "Complete: 2 stale assets, 0 unknown edges.";
    runButton.disabled = false;
    impact?.focus({ preventScroll: true });
  }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 360);
});

async function copyText(value: string, feedback: HTMLElement | null) {
  try {
    await navigator.clipboard.writeText(value);
    if (feedback) feedback.textContent = "Copied to clipboard.";
  } catch {
    if (feedback) feedback.textContent = "Copy unavailable — select the command and copy it manually.";
  }
}

document.querySelector<HTMLButtonElement>("#copy-demo")?.addEventListener("click", () => {
  void copyText(examples.command.replace(/^\$ /, ""), status);
});

document.querySelector<HTMLButtonElement>("#copy-install")?.addEventListener("click", () => {
  const install = document.querySelector<HTMLElement>("#install-code")?.textContent ?? "";
  void copyText(install, document.querySelector("#install-feedback"));
});

const offlineNotice = document.querySelector<HTMLElement>("#offline-notice");
function updateConnection() {
  if (offlineNotice) offlineNotice.hidden = navigator.onLine;
}
window.addEventListener("online", updateConnection);
window.addEventListener("offline", updateConnection);
updateConnection();

const routeStatus = document.createElement("div");
routeStatus.className = "route-status";
routeStatus.setAttribute("role", "status");
routeStatus.setAttribute("aria-live", "polite");
routeStatus.setAttribute("aria-atomic", "true");
document.body.append(routeStatus);

function routeHeading(): HTMLElement | null {
  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector<HTMLElement>(hash);
    const heading = target?.matches("h1, h2, h3") ? target : target?.querySelector<HTMLElement>("h1, h2, h3");
    if (heading) return heading;
  }
  return document.querySelector<HTMLElement>("main h1");
}

function announceRoute() {
  const heading = routeHeading();
  if (!heading) return;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: Boolean(window.location.hash) });
  routeStatus.textContent = heading.textContent?.trim() ?? document.title;
}

window.addEventListener("hashchange", announceRoute);
window.addEventListener("popstate", announceRoute);

function cameFromThisSite() {
  if (!document.referrer) return false;
  try {
    return new URL(document.referrer).origin === window.location.origin;
  } catch {
    return false;
  }
}

function announceInitialRoute() {
  if (window.location.hash || cameFromThisSite() || history.state?.dcicFocusOnRestore) announceRoute();
}

window.addEventListener("pageshow", (event) => {
  if (event.persisted || history.state?.dcicFocusOnRestore) announceRoute();
});

document.addEventListener("click", (event) => {
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
  if (!link || link.target || link.hasAttribute("download")) return;
  const destination = new URL(link.href, window.location.href);
  if (destination.origin === window.location.origin && destination.pathname !== window.location.pathname) {
    history.replaceState({ ...(history.state ?? {}), dcicFocusOnRestore: true }, "");
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", announceInitialRoute, { once: true });
} else {
  announceInitialRoute();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js").catch(() => {
      // The product remains fully usable without installable offline support.
    });
  });
}
