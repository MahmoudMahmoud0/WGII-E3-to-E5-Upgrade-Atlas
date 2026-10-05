import { readFile, writeFile } from 'node:fs/promises';
const source = new URL('../data/requirements.json', import.meta.url);
const rows = JSON.parse(await readFile(source, 'utf8'));
await writeFile(new URL('../assets/data.js', import.meta.url), '// Generated from data/requirements.json. Run npm run build:data after edits.\nconst DATA=' + JSON.stringify(rows).replaceAll('</', '<\\/') + ';\n');
console.log(`Generated ${rows.length} entries.`);
