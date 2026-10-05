const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STAGES=[3,4].flatMap(l=>[0,20,40,60,80].map(a=>`E${l} ${a}% → ${a===80?`E${l+1} 0%`:`${a+20}%`}`));
const EARLY=['Lv30 → E1 (first 20% step)','E1 0% → 20%','E1 80% → E2 0%','E2 40% → 60%','E2 60% → 80%','E2 80% → E3 0%'];
const GROUPS=[['City & research',['Town Center','Council','Academy','Warehouse','Church']],['Military & support',['Hospital','Brawler Camp','Ranger Camp','Shooter Camp','Rally Station']],['Production',['Quarry','Furnace','Lumber Mill','Farm','Silver Mine']]];
const compactQuery=window.matchMedia('(max-width: 640px)');let mobileIndex=0;
let range=compactQuery.matches?'3':'all',metric='overview',time='base_time',selection=null,lastFocus=null;
function observations(b,s){return DATA.filter(r=>r.family===b&&r.stage===s)}
function values(rs,key){let v=[...new Set(rs.map(r=>r[key]))];if(v.length>1)v=v.filter(x=>!['Not readable','Not shown'].includes(x));return v}
function value(rs,key){return values(rs,key).join(' / ')}
function format(v){return ['None shown','Not shown'].includes(v)?'<span class="none">Not shown</span>':v==='Not readable'?'<span class="none">Unreadable</span>':esc(v)}
function stageLabel(s){if(s.startsWith('Lv30'))return '30 → E1';const [,from,to]=s.match(/E\d (.*?) → (.*)/)||[];return `${from} → ${to?.replace(' 0%','')}`}
function render(){
const rangeStages=range==='early'?EARLY:range==='all'?STAGES:STAGES.slice(range==='3'?0:5,range==='3'?5:10);
mobileIndex=Math.min(mobileIndex,rangeStages.length-1);const stages=compactQuery.matches?[rangeStages[mobileIndex]]:rangeStages;
document.querySelector('#stage-nav').innerHTML='<div class="stage-nav-label"><span>CHOOSE AN UPGRADE STEP</span><span>'+esc(rangeStages[mobileIndex])+'</span></div><div class="stage-buttons">'+rangeStages.map((s,i)=>`<button data-step="${i}" class="${i===mobileIndex?'active':''}" aria-pressed="${i===mobileIndex}">${esc(stageLabel(s))}</button>`).join('')+'</div>';
for(const btn of document.querySelectorAll('#levels button'))btn.classList.toggle('active',btn.dataset.range===range);
const q=document.querySelector('#search').value.trim().toLowerCase();
let h=`<table class="${range==='all'?'':'short'}"><thead><tr class="level"><th class="first" rowspan="2">BUILDING</th>`;
if(range==='all'&&!compactQuery.matches)h+='<th colspan="5">E3 → E4</th><th colspan="5">E4 → E5</th>';else h+=`<th colspan="${stages.length}">${range==='early'?'BEFORE E3':range==='all'?'E3 → E5':range==='3'?'E3 → E4':'E4 → E5'}</th>`;
h+='</tr><tr class="steps">'+stages.map((s,i)=>`<th class="${range==='all'&&i===4?'boundary':''}">${esc(stageLabel(s))}${range!=='early'?`<br><span style="font-size:9px;opacity:.6">Lv ${46+STAGES.indexOf(s)}</span>`:''}</th>`).join('')+'</tr></thead><tbody>';
let count=0;
for(const [category,buildings] of GROUPS){let visible=buildings.filter(b=>b.toLowerCase().includes(q)&&rangeStages.some(s=>observations(b,s).length));if(!visible.length)continue;
h+=`<tr class="category"><th colspan="${stages.length+1}"><span class="catlabel">${category}</span></th></tr>`;
for(const b of visible){count++;h+=`<tr><th class="building" scope="row">${esc(b)}${b==='Silver Mine'?'<small>All recorded mines</small>':''}</th>`;
for(const [i,s] of stages.entries()){const rs=observations(b,s);let content='<span class="missing">—</span>';
if(rs.length){if(metric==='overview')content=`<div class="number">${format(value(rs,'cubes'))}${/^\d+$/.test(value(rs,'cubes'))?'<span class="cube-label">cubes</span>':''}</div><div class="secondary">${format(value(rs,'resources_each'))}${!['Not readable','Not shown'].includes(value(rs,'resources_each'))?' each':''}</div>`;
else if(metric==='prerequisite')content=`<div class="requires">${format(value(rs,metric))}</div>`;
else content=`<div class="number ${metric==='time'?'single':''}">${format(value(rs,metric==='time'?time:metric))}</div>`;
const mismatch=rs.find(r=>r.reference_cubes&&r.reference_cubes!==r.cubes);if(mismatch&&(metric==='overview'||metric==='cubes'))content+=`<div class="referencehint">Your table: ${esc(mismatch.reference_cubes)}</div>`;h+=`<td class="data ${range==='all'&&i===4?'boundary':''}"><button class="cell ${selection&&selection[0]===b&&selection[1]===s?'selected':''}" data-building="${esc(b)}" data-stage="${esc(s)}" aria-label="${esc(b+', '+s+', view requirements')}">${content}</button></td>`;
}else h+=`<td class="data ${range==='all'&&i===4?'boundary':''}" aria-label="No readable observation">${content}</td>`;
}h+='</tr>'}}h+='</tbody></table>';
document.querySelector('#matrix').innerHTML=count?h:'<div class="empty-result">No matching buildings in this range.</div>';
document.querySelector('#caption').textContent={overview:'Cubes & basic resources',cubes:'Required cubes',resources_each:'Required resources · each',time:time==='base_time'?'Base construction time':'Boosted construction time',prerequisite:'Required buildings'}[metric];
document.querySelector('#timeswitch').hidden=metric!=='time';document.querySelector('#timeswitch').style.display=metric==='time'?'flex':'none';
document.querySelector('#context').textContent=metric==='time'?'Times without a day prefix use HH:MM:SS. Multiple values reflect recorded boost changes.':metric==='prerequisite'?'Prerequisites include the required Electric level and progress.':'Resource amounts are for each of wheat, lumber, rock and ingot.';
}
function detail(b,s){selection=[b,s];lastFocus=document.activeElement;const rs=observations(b,s);const fields=[['cubes','Cubes'],['resources_each','Each basic resource'],['base_time','Base time'],['button_time','Boosted time'],['prerequisite','Required buildings']];
const mismatch=rs.find(r=>r.reference_cubes&&r.reference_cubes!==r.cubes);let h=`<div class="eyebrow">Upgrade requirements</div><h2>${esc(b)}</h2><div class="stage">${esc(s)}</div>${mismatch?`<div class="annotation">Video: <b>${esc(mismatch.cubes)} cubes</b> · Your table: <b>${esc(mismatch.reference_cubes)} cubes</b> (level ${mismatch.reference_level}). The recorded cost is kept as the main value.</div>`:''}<div class="detailgrid">`;
for(const [k,label] of fields)h+=`<div class="detailbox ${k==='prerequisite'?'wide':''}"><small>${label}</small><strong>${format(value(rs,k))}</strong>${k==='resources_each'?'<em>Wheat · Lumber · Rock · Ingot</em>':''}</div>`;
h+='</div><div class="sources"><h3>Sources · '+rs.length+' observation'+(rs.length===1?'':'s')+'</h3>';
for(const r of rs){const t=Number(r.seconds),stamp=`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(1).padStart(4,'0')}`;
h+=`<details><summary>${esc(['shared_camp','shared_production'].includes(r.source_kind)?r.source_building+' → '+r.building:r.building)} · ${r.source_kind==='user_screenshot'?'Your screenshot':!r.video?'Your supplied requirements':stamp}</summary><div class="filename">${esc(r.file)}</div><p>${esc(r.notes)}</p>${r.reference_cubes?`<p>Your cube table, level ${r.reference_level}: <b>${esc(r.reference_cubes)}</b> cubes</p>`:''}<p>${!r.video?'Supplied':'Recorded / applied'}: ${esc(r.cubes)} cubes · ${esc(r.resources_each)} each<br>Base ${esc(r.base_time)} · Boosted ${esc(r.button_time)}</p>${r.image?`<img src="${r.image}" alt="Recorded requirement panel for ${esc(r.building)}">`:'<p>No video frame for this supplied entry.</p>'}</details>`;
}h+='</div>';document.querySelector('#detail').innerHTML=h;document.querySelector('#drawer').classList.add('open');document.querySelector('#drawer').setAttribute('aria-hidden','false');document.querySelector('#backdrop').classList.add('show');document.body.style.overflow='hidden';render();document.querySelector('#close').focus();}
function close(){document.querySelector('#drawer').classList.remove('open');document.querySelector('#drawer').setAttribute('aria-hidden','true');document.querySelector('#backdrop').classList.remove('show');document.body.style.overflow='';if(selection){const match=[...document.querySelectorAll('.cell')].find(x=>x.dataset.building===selection[0]&&x.dataset.stage===selection[1]);if(match)match.focus()}else lastFocus?.focus()}
for(const [id,key,set] of [['levels','range',v=>{range=v;mobileIndex=0}],['metrics','metric',v=>metric=v],['timeswitch','time',v=>time=v]])document.querySelector('#'+id).addEventListener('click',e=>{const btn=e.target.closest('button');if(!btn)return;set(btn.dataset[key]);for(const x of btn.parentElement.querySelectorAll('button'))x.classList.toggle('active',x===btn);render()});
compactQuery.addEventListener('change',render);document.querySelector('#stage-nav').addEventListener('click',e=>{const b=e.target.closest('[data-step]');if(b){mobileIndex=Number(b.dataset.step);render()}});
document.querySelector('#search').addEventListener('input',render);document.querySelector('#matrix').addEventListener('click',e=>{const btn=e.target.closest('[data-building]');if(btn)detail(btn.dataset.building,btn.dataset.stage)});document.querySelector('#close').onclick=close;document.querySelector('#backdrop').onclick=close;
document.addEventListener('keydown',e=>{if(!document.querySelector('#drawer').classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='Tab'){const el=[...document.querySelector('#drawer').querySelectorAll('button,summary')],first=el[0],last=el.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});render();
