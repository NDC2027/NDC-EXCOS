// NDC EXCO Portal — INEC location directory loader
// Primary source: official INEC Polling Units endpoints.
// Fallback: a public 2025 snapshot scraped from those official INEC endpoints,
// served via jsDelivr so GitHub Pages can still populate the dropdowns if INEC blocks CORS.
const BASE = 'https://www.inecnigeria.org/wp-content/themes/rishi/custom/views';
const ENDPOINTS = {
  states: `${BASE}/getPollingState.php`,
  lgas: `${BASE}/lgaView.php`,
  wards: `${BASE}/wardView.php`,
  pollingUnits: `${BASE}/pollingView.php`
};
const MIRROR_BASE='https://cdn.jsdelivr.net/gh/JayCodist/inec-polling-units-scraper@main/results';
const CACHE_PREFIX='ndc_inec_';
const CACHE_TTL=24*60*60*1000;
let summaryCache=null;
const stateSnapshotCache=new Map();

function asArray(data){if(Array.isArray(data))return data;if(data&&typeof data==='object')return Object.values(data);return[]}
function readCache(key){try{const raw=localStorage.getItem(CACHE_PREFIX+key);if(!raw)return null;const item=JSON.parse(raw);if(!item||Date.now()-item.savedAt>CACHE_TTL)return null;return item.data}catch{return null}}
function writeCache(key,data){try{localStorage.setItem(CACHE_PREFIX+key,JSON.stringify({savedAt:Date.now(),data}))}catch{}}
async function fetchJson(url){const response=await fetch(url,{method:'GET',mode:'cors',cache:'no-store'});if(!response.ok)throw new Error(`Request failed (${response.status})`);return response.json()}
async function official(url,cacheKey,force=false){if(!force){const cached=readCache(cacheKey);if(cached)return cached}const arr=asArray(await fetchJson(url));writeCache(cacheKey,arr);return arr}
async function mirrorSummary(force=false){if(summaryCache&&!force)return summaryCache;const key='mirror_summary';if(!force){const cached=readCache(key);if(cached){summaryCache=cached;return cached}}const d=await fetchJson(`${MIRROR_BASE}/summary.json`);summaryCache=d;writeCache(key,d);return d}
async function mirrorStateByCode(stateCode,force=false){
  if(stateSnapshotCache.has(String(stateCode))&&!force)return stateSnapshotCache.get(String(stateCode));
  const summary=await mirrorSummary(force);const meta=(summary.states||[]).find(x=>String(x.code)===String(stateCode));if(!meta)throw new Error('State not found in INEC snapshot.');
  const key=`mirror_state_${stateCode}`;if(!force){const cached=readCache(key);if(cached){stateSnapshotCache.set(String(stateCode),cached);return cached}}
  const data=await fetchJson(`${MIRROR_BASE}/${meta.fileName}`);stateSnapshotCache.set(String(stateCode),data);writeCache(key,data);return data;
}

export async function getInecStates(force=false){
  try{const rows=await official(ENDPOINTS.states,'states',force);return rows.map(x=>({code:String(x.code??x.id??''),name:String(x.s_name??x.name??'').trim(),source:'live'})).filter(x=>x.code&&x.name)}
  catch{const s=await mirrorSummary(force);return (s.states||[]).map(x=>({code:String(x.code),name:String(x.name).trim(),source:'snapshot'}))}
}
export async function getInecLGAs(stateCode,force=false){
  if(!stateCode)return[];
  try{const rows=await official(`${ENDPOINTS.lgas}?state_id=${encodeURIComponent(stateCode)}`,`lgas_${stateCode}`,force);return rows.map(x=>({id:String(x.id??''),code:String(x.abbreviation??x.code??x.id??''),name:String(x.name??x.lga_name??'').trim(),stateId:String(x.state_id??stateCode),source:'live'})).filter(x=>x.code&&x.name)}
  catch{const d=await mirrorStateByCode(stateCode,force);return (d.state?.lgas||[]).map(x=>({id:String(x.id??''),code:String(x.abbreviation??x.code??x.id??''),name:String(x.name??'').trim(),stateId:String(x.state_id??stateCode),source:'snapshot'})).filter(x=>x.code&&x.name)}
}
export async function getInecWards(stateCode,lgaCode,force=false){
  if(!stateCode||!lgaCode)return[];
  try{const rows=await official(`${ENDPOINTS.wards}?lga_id=${encodeURIComponent(lgaCode)}&state_id=${encodeURIComponent(stateCode)}`,`wards_${stateCode}_${lgaCode}`,force);return rows.map(x=>({id:String(x.id??x.registration_area_id??''),code:String(x.abbreviation??x.code??x.id??''),name:String(x.name??x.ward_name??'').trim(),lgaId:String(x.local_government_id??''),source:'live'})).filter(x=>x.id&&x.name)}
  catch{const d=await mirrorStateByCode(stateCode,force);const lga=(d.state?.lgas||[]).find(x=>String(x.abbreviation??x.code??x.id)===String(lgaCode));return (lga?.wards||[]).map(x=>({id:String(x.id??''),code:String(x.abbreviation??x.code??x.id??''),name:String(x.name??'').trim(),lgaId:String(x.local_government_id??''),source:'snapshot'})).filter(x=>x.id&&x.name)}
}
export async function getInecPollingUnits(stateCode,lgaCode,wardId,force=false){
  if(!stateCode||!lgaCode||!wardId)return[];
  try{const rows=await official(`${ENDPOINTS.pollingUnits}?state_id=${encodeURIComponent(stateCode)}&lga_id=${encodeURIComponent(lgaCode)}&ward_id=${encodeURIComponent(wardId)}`,`pus_${stateCode}_${lgaCode}_${wardId}`,force);return rows.map(x=>({id:String(x.id??''),name:String(x.name??x.polling_unit_name??'').trim(),code:String(x.delimitation??x.abbreviation??x.code??'').trim(),preciseLocation:String(x.precise_location??'').trim(),remark:String(x.remark??'').trim(),source:'live'})).filter(x=>x.name)}
  catch{const d=await mirrorStateByCode(stateCode,force);const lga=(d.state?.lgas||[]).find(x=>String(x.abbreviation??x.code??x.id)===String(lgaCode));const ward=(lga?.wards||[]).find(x=>String(x.id)===String(wardId));return (ward?.pollingUnits||[]).map(x=>({id:String(x.id??''),name:String(x.name??'').trim(),code:String(x.delimitation??x.abbreviation??'').trim(),preciseLocation:String(x.precise_location??'').trim(),remark:String(x.remark??'').trim(),source:'snapshot'})).filter(x=>x.name)}
}
export function clearInecLocationCache(){try{Object.keys(localStorage).filter(k=>k.startsWith(CACHE_PREFIX)).forEach(k=>localStorage.removeItem(k))}catch{}summaryCache=null;stateSnapshotCache.clear()}
export const INEC_SOURCE_URL='https://www.inecnigeria.org/polling-units/';
