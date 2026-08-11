#!/usr/bin/env node
// js/validate-data.js
// Simple validator for BrahmaSutrasOnline data files.
// Usage: node js/validate-data.js

const fs = require('fs');
const path = require('path');

function readJSON(p) {
  try {
    const raw = fs.readFileSync(p, 'utf8');
    return { ok: true, data: JSON.parse(raw) };
  } catch (err) {
    return { ok: false, error: `Failed to read/parse ${p}: ${err.message}` };
  }
}

function isObject(v) { return v && typeof v === 'object' && !Array.isArray(v); }

function assert(cond, msg, errors) {
  if (!cond) errors.push(msg);
}

function validateStructure(structure, baseDir, errors) {
  assert(typeof structure.version === 'string', 'structure.version must be a string', errors);
  assert(typeof structure.title === 'string', 'structure.title must be a string', errors);
  assert(typeof structure.sutraCount === 'number', 'structure.sutraCount must be a number', errors);
  assert(Array.isArray(structure.adhyayas), 'structure.adhyayas must be an array', errors);

  if (Array.isArray(structure.adhyayas)) {
    structure.adhyayas.forEach((a, ai) => {
      const prefix = `adhyayas[${ai}]`;
      assert(typeof a.id === 'number', `${prefix}.id must be a number`, errors);
      assert(typeof a.title === 'string', `${prefix}.title must be a string`, errors);
      if (a.padas !== undefined) {
        assert(Array.isArray(a.padas), `${prefix}.padas must be an array if present`, errors);
        if (Array.isArray(a.padas)) {
          a.padas.forEach((p, pi) => {
            const pp = `${prefix}.padas[${pi}]`;
            assert(typeof p.id === 'number', `${pp}.id must be a number`, errors);
            assert(typeof p.title === 'string', `${pp}.title must be a string`, errors);
            assert(typeof p.file === 'string', `${pp}.file must be a string (path to pada JSON)`, errors);

            // Check that the referenced file exists
            const filePath = path.join(baseDir, p.file);
            if (!fs.existsSync(filePath)) {
              errors.push(`${pp}.file references missing file: ${p.file}`);
            }
          });
        }
      }
    });
  }
}

function validateSutraRecord(s, index, errors) {
  const prefix = `sutras[${index}]`;
  assert(typeof s.id === 'string', `${prefix}.id must be a string (e.g. "1.1.1")`, errors);
  assert(typeof s.adhyaya === 'number', `${prefix}.adhyaya must be a number`, errors);
  assert(typeof s.pada === 'number', `${prefix}.pada must be a number`, errors);
  assert(typeof s.sutraNumber === 'number', `${prefix}.sutraNumber must be a number`, errors);
  assert(typeof s.sanskrit === 'string', `${prefix}.sanskrit must be a string (can be empty)`, errors);
  assert(typeof s.iast === 'string', `${prefix}.iast must be a string`, errors);
  assert(typeof s.translation === 'string', `${prefix}.translation must be a string`, errors);
  assert(Array.isArray(s.wordMeanings), `${prefix}.wordMeanings must be an array`, errors);
  assert(Array.isArray(s.references), `${prefix}.references must be an array`, errors);
  assert(Array.isArray(s.commentaries), `${prefix}.commentaries must be an array`, errors);
}

function validatePadaFile(filePath, errors) {
  const res = readJSON(filePath);
  if (!res.ok) {
    errors.push(res.error);
    return;
  }
  const data = res.data;
  if (!Array.isArray(data)) {
    errors.push(`${filePath}: expected top-level array of sutra records`);
    return;
  }
  data.forEach((s, i) => validateSutraRecord(s, i, errors));
}

function findPadaFiles(baseDir) {
  const files = [];
  const dataDir = path.join(baseDir, 'data');
  if (!fs.existsSync(dataDir)) return files;

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.isFile() && e.name.endsWith('.json')) files.push(full);
    }
  }
  walk(dataDir);
  return files;
}

function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const baseDir = repoRoot;
  const errors = [];

  const structPath = path.join(baseDir, 'data', 'structure.json');
  if (!fs.existsSync(structPath)) {
    console.error(`Missing file: ${structPath}`);
    process.exit(2);
  }

  const sres = readJSON(structPath);
  if (!sres.ok) {
    console.error(sres.error);
    process.exit(2);
  }

  validateStructure(sres.data, baseDir, errors);

  // Validate all pada files referenced in the structure (preferred),
  // but also fall back to scanning all data/*.json under data/adhyaya*.
  const referencedFiles = new Set();
  try {
    const adhyayas = sres.data.adhyayas || [];
    adhyayas.forEach(a => {
      (a.padas || []).forEach(p => { if (p && p.file) referencedFiles.add(path.join(baseDir, p.file)); });
    });
  } catch (e) {
    // ignore
  }

  if (referencedFiles.size > 0) {
    for (const f of referencedFiles) validatePadaFile(f, errors);
  } else {
    // fallback: validate all JSON files under data/adhyaya*
    const all = findPadaFiles(baseDir).filter(p => p.includes(path.join('data', 'adhyaya')));
    all.forEach(p => validatePadaFile(p, errors));
  }

  if (errors.length === 0) {
    console.log('Validation passed: no errors found.');
    process.exit(0);
  }

  console.error(`Validation failed: ${errors.length} issue(s) found:`);
  errors.forEach((e, i) => {
    console.error(`${i + 1}. ${e}`);
  });
  process.exit(2);
}

if (require.main === module) main();
