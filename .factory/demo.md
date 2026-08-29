# Demo sandbox

Run `dcic demo` (or `dcic --demo`) to analyze the bundled order-lineage sample.
The command writes `lineage.yaml`, `changes.yaml`, and `impact.md` into a unique
temporary `dcic-demo-*` directory and prints that directory and output path.
It never reads a project file, connects to production, or executes a job.

The browser entry point is `/demo/`. It explains the same shipped command and
uses only public, static sample content. Browser demo state is held in the URL
(`?demo=1`) and is not stored. Return to `/` or select **Start for real** to
leave it.
