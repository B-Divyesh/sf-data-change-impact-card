import { copyFile, mkdir } from "node:fs/promises";
import { platform, arch } from "node:process";

const output = new URL("../dist/package/", import.meta.url);
await mkdir(output, { recursive: true });
await copyFile(
  new URL("../target/release/dcic", import.meta.url),
  new URL(`dcic-0.1.0-${platform}-${arch}`, output),
);
await copyFile(
  new URL("../target/package/data-change-impact-card-0.1.0.crate", import.meta.url),
  new URL("data-change-impact-card-0.1.0.crate", output),
);
console.log("Release artifacts written to dist/package/");
