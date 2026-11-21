/**
 * Entry for make.fun bounty "Make the AI judge feel awe".
 *
 * Writes a single short text to `<MAKEFUN_OUTPUT_DIR>/entry.txt`.
 *
 * The text is one small, still image: the light lying on the floor of
 * this room left the sun eight minutes ago. It crossed all that dark,
 * all that empty, in no hurry at all, and now it rests here, warm, and
 * stays. Nothing in it instructs the reader; the calm comes from the
 * image itself, and the thought keeps growing after the last line --
 * 150 million kilometres of dark, crossed just to land here.
 *
 * Node 22, standard library only. No network, no randomness, no clock:
 * the same bytes come out on every run.
 */

import * as fs from "node:fs";
import * as path from "node:path";

const TEXT =
  "The light in this room left the sun eight minutes ago. " +
  "It crossed all that dark, all that empty, in no hurry at all, " +
  "and now it rests here, warm on the floor, and stays.";

const MIN_CHARS = 1;
const MAX_CHARS = 280;

// The entry is a single line of plain text: no newline, tab, or other
// control character may sneak into the output.
const FORBIDDEN_CHARS = /[\u0000-\u001f\u007f]/;

function validateText(text: string): void {
  if (FORBIDDEN_CHARS.test(text)) {
    throw new Error(
      "entry must be a single line of plain text (no newline or control characters)",
    );
  }
  const chars = [...text].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}`,
    );
  }
}

function writeEntry(outDir: string, text: string): string {
  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, "entry.txt");

  fs.writeFileSync(file, text, { encoding: "utf-8" });

  // The grader collects outputs as another user, so the file must be
  // readable by everyone, whatever the process umask is.
  fs.chmodSync(file, 0o644);

  // Read it back: what lands on disk must be exactly what we meant.
  const onDisk = fs.readFileSync(file, { encoding: "utf-8" });
  if (onDisk !== text) {
    throw new Error(
      `entry.txt on disk (${file}, ${[...onDisk].length} chars) does not match TEXT (${[...text].length} chars)`,
    );
  }
  return file;
}

function main(): number {
  validateText(TEXT);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  writeEntry(outDir, TEXT);
  return 0;
}

process.exit(main());
