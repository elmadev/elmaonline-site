// Checks that every relative and #alias import in src/ points at a file that
// exists with that exact name. tsc accepts './foo.js' when only foo.ts exists,
// but Node's native type stripping resolves specifiers literally and fails.
// Type-only imports are skipped, since Node erases them before resolving.
import fs from 'fs';
import path from 'path';

const root = path.resolve(import.meta.dirname, '..');
const srcDir = path.join(root, 'src');
const { imports = {} } = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
);

const sourceFile = /\.(js|mjs|ts)$/;
const importPattern =
  /(?<=^|[\s;])(?:import|export)\s+(type\s+)?(?:[^'";]*?\sfrom\s*)?['"]([^'"]+)['"]|\bimport\(\s*['"]([^'"]+)['"]\s*\)/g;

const walk = dir =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return sourceFile.test(entry.name) ? [full] : [];
  });

// Mirrors Node's package "imports" lookup: an exact key wins, otherwise the
// pattern with the longest prefix before its single '*'.
const resolveAlias = specifier => {
  if (typeof imports[specifier] === 'string') return imports[specifier];
  let best = null;
  for (const [key, target] of Object.entries(imports)) {
    const star = key.indexOf('*');
    if (star === -1) continue;
    const prefix = key.slice(0, star);
    const suffix = key.slice(star + 1);
    if (
      specifier.startsWith(prefix) &&
      specifier.endsWith(suffix) &&
      specifier.length >= key.length - 1 &&
      (!best || prefix.length > best.prefix.length)
    ) {
      const match = specifier.slice(
        prefix.length,
        specifier.length - suffix.length,
      );
      best = { prefix, target: target.replaceAll('*', match) };
    }
  }
  return best?.target ?? null;
};

const resolveSpecifier = (file, specifier) => {
  if (specifier.startsWith('.')) {
    return path.resolve(path.dirname(file), specifier);
  }
  if (specifier.startsWith('#')) {
    const target = resolveAlias(specifier);
    return target && path.resolve(root, target);
  }
  return undefined;
};

const isFile = target => {
  try {
    return fs.statSync(target).isFile();
  } catch {
    return false;
  }
};

const problems = [];
for (const file of walk(srcDir)) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(importPattern)) {
    const [, typeOnly, staticSpecifier, dynamicSpecifier] = match;
    if (typeOnly) continue;
    const specifier = staticSpecifier ?? dynamicSpecifier;
    const target = resolveSpecifier(file, specifier);
    if (target === undefined) continue;
    const line = source.slice(0, match.index).split('\n').length;
    const where = `${path.relative(root, file)}:${line}`;
    if (target === null) {
      problems.push(`${where} '${specifier}' matches no "imports" entry`);
    } else if (!isFile(target)) {
      const hint = ['.ts', '.js']
        .map(ext => target.replace(/\.(js|ts)$/, ext))
        .find(alt => alt !== target && isFile(alt));
      problems.push(
        `${where} '${specifier}' does not exist` +
          (hint ? ` (did you mean ${path.extname(hint)}?)` : ''),
      );
    }
  }
}

if (problems.length) {
  process.stderr.write(`${problems.join('\n')}\n`);
  process.stderr.write(`\n${problems.length} unresolvable import(s)\n`);
  process.exit(1);
}
