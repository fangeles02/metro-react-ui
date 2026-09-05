#!/usr/bin/env node
/**
 * Generates `src/showcase/icons/iconRegistry.ts` from the installed
 * `@fluentui/react-icons` package.
 *
 * The library exposes its icons as named ESM exports spread across many
 * `chunk-*.d.ts` files (there is no runtime registry to iterate). This script
 * parses those declaration files and emits a single, typed registry that the
 * icon browser imports. Every icon is a named import, so TypeScript stays fully
 * type-checked and bundlers can keep tree-shaking.
 *
 * Re-run with:  npm run generate:icons  (from apps/showcase)
 */
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

// Resolve the package root without relying on the (unexported) package.json.
// import.meta.resolve returns a file:// URL for the library's main entry; we
// walk up to the package's lib/ folder.
const entryUrl = import.meta.resolve('@fluentui/react-icons');
const entryPath = fileURLToPath(entryUrl);
// lib/index.js (or .cjs) -> stop at the folder containing lib/
const pkgRoot = resolve(dirname(dirname(entryPath)));
const iconsDir = join(pkgRoot, 'lib', 'icons');

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'showcase', 'icons');
const outFile = join(outDir, 'iconRegistry.ts');

// Suffix stripping applies to these variants. We only keep Regular/Filled.
const STRIP_SUFFIX = ['Filled', 'Regular'];
const EXCLUDE_SUFFIX = ['Color']; // deprecated color variants

/** Regex matching a declaration line: `export declare const XyzFilled: FluentIcon;` */
const DECL_RE = /export declare const (\w+): FluentIcon;/g;

function collectDeclarations() {
  const chunkFiles = readdirSync(iconsDir)
    .filter((f) => /^chunk-\d+\.d\.ts$/.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const names = new Set();
  for (const file of chunkFiles) {
    const text = readFileSync(join(iconsDir, file), 'utf8');
    for (const m of text.matchAll(DECL_RE)) {
      names.add(m[1]);
    }
  }
  return [...names].sort();
}

function stripVariant(name) {
  for (const s of STRIP_SUFFIX) {
    if (name.endsWith(s)) return name.slice(0, -s.length);
  }
  return null; // not a regular/filled icon (e.g. deprecated *Color)
}

function buildRegistry(exportNames) {
  const byBase = new Map(); // base -> { filled?, regular? }

  for (const name of exportNames) {
    if (EXCLUDE_SUFFIX.some((s) => name.endsWith(s))) continue;
    const variant = name.endsWith('Filled') ? 'Filled' : name.endsWith('Regular') ? 'Regular' : null;
    if (!variant) continue;

    const base = stripVariant(name);
    if (!base) continue;

    const entry = byBase.get(base) ?? {};
    entry[variant.toLowerCase()] = name;
    byBase.set(base, entry);
  }

  // Sort by display name (case-insensitive) for stable output.
  return [...byBase.entries()]
    .sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map(([base, { filled, regular }]) => ({ base, filled, regular }));
}

const allNames = collectDeclarations();
const registry = buildRegistry(allNames);

// Only import icons that actually appear in the registry (Regular/Filled).
// Deprecated *Color icons are excluded from families, so exclude them from the
// import list too, otherwise the emitted file trips noUnusedLocals.
const importNames = new Set();
for (const { filled, regular } of registry) {
  if (regular) importNames.add(regular);
  if (filled) importNames.add(filled);
}

const constLines = [];
constLines.push('// AUTO-GENERATED FILE. Do not edit by hand.');
constLines.push('// Regenerate with:  npm run generate:icons  (from apps/showcase)');
constLines.push('');
constLines.push("import type { FluentIcon } from '@fluentui/react-icons';");
constLines.push("import {");
for (const name of sortedNames(allNames, importNames)) constLines.push(`  ${name},`);
constLines.push("} from '@fluentui/react-icons';");
constLines.push('');
constLines.push('export interface IconRegistration {');
constLines.push('  name: string;');
constLines.push('  regular?: FluentIcon;');
constLines.push('  filled?: FluentIcon;');
constLines.push('}');
constLines.push('');
constLines.push('export const iconRegistry: IconRegistration[] = [');
for (const { base, filled, regular } of registry) {
  const pair = [
    filled ? `filled: ${filled}` : null,
    regular ? `regular: ${regular}` : null,
  ]
    .filter(Boolean)
    .join(', ');
  constLines.push(`  { name: '${base}'${pair ? `, ${pair}` : ''} },`);
}
constLines.push('];');
constLines.push('');

const final = constLines.join('\n');

/** Names from the parsed set that are needed for the import block, sorted. */
function sortedNames(all, keep) {
  return all.filter((n) => keep.has(n)).sort();
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, final, 'utf8');
console.log(`✓ Wrote ${outFile}`);
console.log(`  ${allNames.length} export names parsed, ${registry.length} icon families emitted, ${importNames.size} imported.`);