const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');const rows=JSON.parse(fs.readFileSync(path.join(root,'data/requirements.json'),'utf8'));
assert.equal(rows.length,151);assert.equal(rows.filter(r=>!r.source_kind).length,93);
for(const r of rows){for(const k of ['building','stage','cubes','resources_each','base_time','button_time','prerequisite','notes','family'])assert.equal(typeof r[k],'string');if(r.image){assert.ok(!path.isAbsolute(r.image));assert.ok(r.image.startsWith('assets/evidence/'));assert.ok(fs.existsSync(path.join(root,r.image)));}}
for(const f of ['index.html','assets/styles.css','assets/app.js','assets/data.js','.github/workflows/pages.yml'])assert.ok(fs.existsSync(path.join(root,f)));
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.ok(!html.includes('C:/Users/'));assert.ok(!html.includes('file:///'));assert.ok(html.includes('width=device-width'));assert.ok(html.includes('assets/app.js'));
console.log('Passed: all 151 entries, 93 original video observations, source assets and portable paths.');
