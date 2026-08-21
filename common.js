export const POSITIONS = {
  ward: [
    'Ward Chairman','Ward Vice Chairman','Ward Secretary','Ward Assistant Secretary','Ward Welfare Secretary','Ward Assistant Welfare Secretary','Ward Organizing Secretary','Ward Assistant Organizing Secretary','Ward Treasurer','Ward Assistant Treasurer','Ward Auditor','Ward Assistant Auditor','Ward Legal Adviser (Legal Practitioner)','Ward Financial Secretary','Ward Assistant Financial Secretary','Ward Publicity Secretary','Ward Assistant Publicity Secretary (Print and Broadcast Media)','Ward Assistant Publicity Secretary (News Media)','Ward Women Leader','Ward Youth Leader','Ward Representative, Persons with Disabilities'
  ],
  lga: [
    'LGA Chairman','LGA Vice Chairman','LGA Secretary','LGA Assistant Secretary','LGA Treasurer','LGA Assistant Treasurer','LGA Financial Secretary','LGA Assistant Financial Secretary','LGA Organizing Secretary','LGA Assistant Organizing Secretary','LGA Publicity Secretary','LGA Assistant Publicity Secretary','LGA Welfare Secretary','LGA Assistant Welfare Secretary','LGA Auditor','LGA Assistant Auditor','LGA Legal Adviser (Legal Practitioner)','LGA Women Leader','LGA Youth Leader','LGA Representative, Persons with Disabilities'
  ],
  state: [
    'State Chairman','State Deputy Chairman','State Vice Chairman','State Secretary','State Deputy Secretary','State Treasurer','State Financial Secretary','State Organizing Secretary','State Deputy Organizing Secretary','State Publicity Secretary','State Deputy Publicity Secretary','State Welfare Secretary','State Auditor','State Legal Adviser (Legal Practitioner)','State Women Leader','State Youth Leader','State Representative, Persons with Disabilities'
  ]
};
export const LEVEL_LABELS={ward:'Ward EXCO',lga:'Local Government EXCO',state:'State EXCO'};
export const STATES=['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'];
export const LOCATION_DATA={
  'Plateau':{'Jos North':{'Jenta Apata':[{'name':'Sample Polling Unit','code':'31-05-07-016'}]}}
};
export function positionsFor(level='ward'){return POSITIONS[level]||POSITIONS.ward}
export function levelLabel(level='ward'){return LEVEL_LABELS[level]||LEVEL_LABELS.ward}
export function jurisdictionText(r){
  if(r.excoLevel==='state') return r.state||'—';
  if(r.excoLevel==='lga') return [r.state,r.lga].filter(Boolean).join(' / ');
  return [r.state,r.lga,r.ward].filter(Boolean).join(' / ');
}
export function sameJurisdiction(a,b){
  const eq=(x,y)=>String(x||'').trim().toLowerCase()===String(y||'').trim().toLowerCase();
  if(!eq(a.excoLevel||'ward',b.excoLevel||'ward')||!eq(a.state,b.state))return false;
  if((a.excoLevel||'ward')==='state')return true;
  if(!eq(a.lga,b.lga))return false;
  if((a.excoLevel||'ward')==='lga')return true;
  return eq(a.ward,b.ward);
}
export function escapeHtml(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
export function maskNin(n=''){return n.length>=6?`${n.slice(0,3)}•••••${n.slice(-3)}`:'—'}
export function memberNumber(level='ward'){
  const yy=new Date().getFullYear(); const codes={ward:'W',lga:'L',state:'S'};
  const r=crypto.getRandomValues(new Uint32Array(1))[0]%10000000;
  return `NDC${yy}-${codes[level]||'W'}-${String(r).padStart(7,'0')}`;
}
export async function compressImage(file,{maxW=520,maxH=650,quality=.72,type='image/jpeg'}={}){
  if(!file)return''; if(file.size>8*1024*1024)throw new Error('Image is too large. Maximum original file size is 8 MB.');
  const src=await new Promise((resolve,reject)=>{const fr=new FileReader();fr.onload=()=>resolve(fr.result);fr.onerror=reject;fr.readAsDataURL(file)});
  const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src});
  const ratio=Math.min(1,maxW/img.width,maxH/img.height),w=Math.max(1,Math.round(img.width*ratio)),h=Math.max(1,Math.round(img.height*ratio));
  const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,w,h);x.drawImage(img,0,0,w,h);let out=c.toDataURL(type,quality);
  if(out.length>360000)out=c.toDataURL('image/jpeg',Math.max(.45,quality-.18)); return out;
}
export async function sha256Hex(text=''){const data=new TextEncoder().encode(String(text));const digest=await crypto.subtle.digest('SHA-256',data);return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('')}
export function baseDirUrl(file){return new URL(file,location.href).href}
