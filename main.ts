import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "The printer has been out of ink since Tuesday, but it still prints the low-ink warning, which is the only thing it prints anymore.";

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    console.error("MAKEFUN_OUTPUT_DIR is not set");
    process.exit(1);
  }
  const chars = [...LINE].length;
  if (chars < 1 || chars > 280) {
    console.error(`entry must be 1-280 characters, got ${chars}`);
    process.exit(1);
  }
  if (LINE.trim().length === 0 || LINE.includes("\n")) {
    console.error("entry must be a single non-blank line");
    process.exit(1);
  }
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, LINE, "utf8");
  // Read-back check: the file must hold exactly the line, byte for byte.
  // Ties break on bytes, so the written artifact is asserted, not assumed.
  const written = readFileSync(target, "utf8");
  if (written !== LINE) {
    console.error("read-back mismatch: entry.txt does not match the line");
    process.exit(1);
  }
  const bytes = Buffer.byteLength(LINE, "utf8");
  if (bytes !== 130) {
    console.error(`expected 130 bytes, got ${bytes}`);
    process.exit(1);
  }
}

main();
