#!/usr/bin/env node
/* Zero-dependency CI checks for this static site:
   1. JSON validity for every data/*.json file
   2. JS syntax (node --check) for js/, scripts/, and inline <script> blocks
      inside every root-level *.html file
   Exits non-zero on the first category with any failure. */

import { execFileSync } from 'node:child_process';
import {
  mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const tmp = mkdtempSync(join(tmpdir(), 'ce-ci-'));
let failures = 0;

const pass = (m) => console.log(`  PASS  ${m}`);
const fail = (m) => { console.error(`  FAIL  ${m}`); failures += 1; };

function checkJs(label, source) {
  const file = join(tmp, `${label.replace(/[^a-z0-9]+/gi, '_')}.mjs`);
  writeFileSync(file, source);
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    pass(label);
  } catch (err) {
    fail(`${label}\n${String(err.stderr || err.message).slice(0, 900)}`);
  }
}

/* 1. JSON data files */
console.log('JSON data files');
for (const name of readdirSync('data').filter((f) => f.endsWith('.json'))) {
  try {
    JSON.parse(readFileSync(join('data', name), 'utf8'));
    pass(`data/${name}`);
  } catch (err) {
    fail(`data/${name}: ${err.message}`);
  }
}

/* 2. Standalone JS */
console.log('JavaScript files');
const jsFiles = [
  ...readdirSync('js').filter((f) => f.endsWith('.js')).map((f) => join('js', f)),
  ...readdirSync('scripts').filter((f) => f.endsWith('.mjs')).map((f) => join('scripts', f)),
];
for (const file of jsFiles) {
  checkJs(file, readFileSync(file, 'utf8'));
}

/* 3. Inline <script> blocks in HTML pages */
console.log('Inline scripts in HTML');
const htmlFiles = readdirSync('.').filter((f) => f.endsWith('.html'));
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  blocks.forEach((m, i) => {
    if (m[1].trim()) checkJs(`${file}#script${i}`, m[1]);
  });
}

rmSync(tmp, { recursive: true, force: true });

if (failures) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll CI checks passed.');
