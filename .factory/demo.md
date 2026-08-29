# Demo sandbox

Run `dcic demo` (or `dcic --demo`) to analyze the bundled order-lineage sample.
The command writes `lineage.yaml`, `changes.yaml`, and `impact.md` into a unique
temporary `dcic-demo-*` directory and prints that directory and output path.
It never reads a project file, connects to production, or executes a job.

The browser entry point is `/demo/?demo=1`. Its first viewport shows the
recorded command, `raw.orders` sample change, terminal result, and generated
impact card. The persistent banner links to **Reset demo** and **Start for
real**. Reset reloads the original static sample; Start for real returns home.

Browser demo state exists only in the `?demo=1` URL. It does not use cookies,
localStorage, sessionStorage, or IndexedDB, so it cannot read or write real
product data. The service worker stores only the public documentation shell.
