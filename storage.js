/* FindIt local demo store. No backend or secure authentication. */
(function(){
'use strict';
const KEYS={reports:'findit_reports',claims:'findit_claims',activity:'findit_activity',settings:'findit_settings'};
const OWNER='demo-owner-local';
const categories=['ID Cards','Keys','Books','Electronics','Wallets','Bags','Clothing','Bottles','Other Items'];
const categoryIcons={'ID Cards':'▤','Keys':'⚿','Books':'▤','Electronics':'⌁','Wallets':'▣','Bags':'▱','Clothing':'◇','Bottles':'♧','Other Items':'✦'};
const imageMap={
  bottle:'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80',
  notebook:'https://images.unsplash.com/photo-1531346878377-a5be20888eab?auto=format&fit=crop&w=700&q=80',
  earbuds:'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=700&q=80',
  backpack:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
  keys:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80',
  wallet:'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80',
  idcard:'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=700&q=80',
  headphones:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
  watch:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80',
  hoodie:'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80',
  umbrella:'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=700&q=80',
  glasses:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80'
};
const today=new Date();
const dateAgo=n=>{const d=new Date(today);d.setDate(d.getDate()-n);return d.toISOString().slice(0,10)};
const sampleReports=[
{id:'FI-R1001',type:'Lost',name:'Black stainless-steel bottle',category:'Bottles',description:'Matte black insulated bottle with a small silver scratch near the lid. Has a dark loop cap.',date:dateAgo(1),location:'Library, ground floor',imageKey:'bottle',status:'Open',ownerId:null,isSample:true,createdAt:Date.now()-86400000},
{id:'FI-R1002',type:'Found',name:'Navy spiral notebook',category:'Books',description:'Dark navy spiral notebook with a plain cover and a small lavender sticker on the back.',date:dateAgo(1),location:'Classroom Block B',imageKey:'notebook',status:'Available',ownerId:null,isSample:true,createdAt:Date.now()-82000000},
{id:'FI-R1003',type:'Lost',name:'White wireless earbuds',category:'Electronics',description:'White earbuds in a compact charging case. Case has a tiny mark on the right corner.',date:dateAgo(2),location:'Cafeteria seating area',imageKey:'earbuds',status:'Open',ownerId:null,isSample:true,createdAt:Date.now()-172800000},
{id:'FI-R1004',type:'Found',name:'Blue canvas backpack',category:'Bags',description:'Medium blue canvas backpack with two front zip pockets and a grey zipper pull.',date:dateAgo(2),location:'Sports Complex entrance',imageKey:'backpack',status:'Returned',ownerId:null,isSample:true,createdAt:Date.now()-175000000},
{id:'FI-R1005',type:'Lost',name:'Small silver key ring',category:'Keys',description:'Three silver keys on a round metal ring with a small blue fabric tag.',date:dateAgo(3),location:'Main parking area',imageKey:'keys',status:'Open',ownerId:null,isSample:true,createdAt:Date.now()-259200000},
{id:'FI-R1006',type:'Found',name:'Brown zip wallet',category:'Wallets',description:'Slim brown zip wallet with a stitched edge and a small plain metal pull.',date:dateAgo(3),location:'Student activity centre',imageKey:'wallet',status:'Available',ownerId:null,isSample:true,createdAt:Date.now()-260000000},
{id:'FI-R1007',type:'Lost',name:'Student ID card holder',category:'ID Cards',description:'Transparent blue-edged ID holder attached to a short navy lanyard. Card details are not shown.',date:dateAgo(4),location:'Administration corridor',imageKey:'idcard',status:'Open',ownerId:null,isSample:true,createdAt:Date.now()-345600000},
{id:'FI-R1008',type:'Found',name:'Over-ear headphones',category:'Electronics',description:'Black over-ear headphones with cushioned ear pads and a foldable headband.',date:dateAgo(4),location:'Computer laboratory 2',imageKey:'headphones',status:'Available',ownerId:null,isSample:true,createdAt:Date.now()-347000000},
{id:'FI-R1009',type:'Lost',name:'Round wristwatch',category:'Other Items',description:'Minimal round-face wristwatch with a dark strap and a plain silver-colour case.',date:dateAgo(5),location:'Auditorium foyer',imageKey:'watch',status:'Open',ownerId:null,isSample:true,createdAt:Date.now()-432000000},
{id:'FI-R1010',type:'Found',name:'Grey zip hoodie',category:'Clothing',description:'Light grey hoodie with a front pocket, drawstring hood and no visible logo.',date:dateAgo(5),location:'Cafeteria outdoor tables',imageKey:'hoodie',status:'Available',ownerId:null,isSample:true,createdAt:Date.now()-433000000},
{id:'FI-R1011',type:'Lost',name:'Foldable navy umbrella',category:'Other Items',description:'Compact navy umbrella with a curved dark handle and a fabric wrist loop.',date:dateAgo(6),location:'Bus pickup point',imageKey:'umbrella',status:'Open',ownerId:null,isSample:true,createdAt:Date.now()-518400000},
{id:'FI-R1012',type:'Found',name:'Black-framed spectacles',category:'Other Items',description:'Black rectangular glasses frame with clear lenses and slim arms.',date:dateAgo(6),location:'Lecture Hall A, back row',imageKey:'glasses',status:'Available',ownerId:null,isSample:true,createdAt:Date.now()-519000000}
];
function safeParse(key,fallback){try{const v=localStorage.getItem(key);return v===null?fallback:JSON.parse(v)}catch(e){return fallback}}
function save(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch(e){window.dispatchEvent(new CustomEvent('findit-storage-error',{detail:{message:'Browser storage is unavailable or full. Your latest change may not have been saved.'}}));return false}}
function clone(x){return JSON.parse(JSON.stringify(x))}
function initialClaims(){return [
{id:'FI-C2001',reportId:'FI-R1002',claimantName:'Alex (sample)',explanation:'I use a navy spiral notebook with a small lavender sticker on the back. I can describe another identifying detail during a safe handover.',privateDetail:'Sample detail only',status:'Pending',adminNote:'',ownerId:OWNER,isSample:true,createdAt:Date.now()-3600000},
{id:'FI-C2002',reportId:'FI-R1004',claimantName:'Jordan (sample)',explanation:'The backpack matches the colour and front pockets of my bag. This is a completed sample workflow.',privateDetail:'Sample detail only',status:'Approved',adminNote:'Approved for demonstration only.',ownerId:OWNER,isSample:true,createdAt:Date.now()-7200000},
{id:'FI-C2003',reportId:'FI-R1006',claimantName:'Taylor (sample)',explanation:'I think the wallet might be mine because it is brown and has a zip closure. This sample demonstrates a rejected claim.',privateDetail:'Sample detail only',status:'Rejected',adminNote:'Insufficient distinguishing information in this demo example.',ownerId:OWNER,isSample:true,createdAt:Date.now()-10800000}
]}
function seed(){
  const settings=safeParse(KEYS.settings,null);
  if(!settings||settings.version!==1){
    save(KEYS.reports,clone(sampleReports));save(KEYS.claims,initialClaims());
    save(KEYS.activity,[{id:'ACT-1',message:'FindIt demo sample data initialized',at:Date.now(),kind:'system'}]);
    save(KEYS.settings,{version:1,seededAt:Date.now()});
  } else {
    if(!Array.isArray(safeParse(KEYS.reports,null)))save(KEYS.reports,clone(sampleReports));
    if(!Array.isArray(safeParse(KEYS.claims,null)))save(KEYS.claims,[]);
    if(!Array.isArray(safeParse(KEYS.activity,null)))save(KEYS.activity,[]);
  }
}
function getReports(){const r=safeParse(KEYS.reports,[]);return Array.isArray(r)?r:[]}
function getClaims(){const c=safeParse(KEYS.claims,[]);return Array.isArray(c)?c:[]}
function getActivity(){const a=safeParse(KEYS.activity,[]);return Array.isArray(a)?a:[]}
function setReports(v){return save(KEYS.reports,v)}
function setClaims(v){return save(KEYS.claims,v)}
function addActivity(message,kind='info'){const a=getActivity();a.unshift({id:'ACT-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),message,kind,at:Date.now()});return save(KEYS.activity,a.slice(0,100))}
function nextId(kind){const list=kind==='report'?getReports():getClaims();const prefix=kind==='report'?'FI-R':'FI-C';const start=kind==='report'?1001:2001;let max=start-1;list.forEach(x=>{const m=String(x.id||'').match(new RegExp('^'+prefix+'(\\d+)$'));if(m)max=Math.max(max,Number(m[1]))});return prefix+(max+1)}
function addReport(data){const r=getReports();const report={...data,id:nextId('report'),ownerId:OWNER,isSample:false,createdAt:Date.now(),status:data.type==='Lost'?'Open':'Available'};r.unshift(report);if(!setReports(r))return null;addActivity('Created '+report.type.toLowerCase()+' report: '+report.name,'report');return report}
function updateReport(id,patch){const r=getReports();const i=r.findIndex(x=>x.id===id&&x.ownerId===OWNER&&!x.isSample);if(i<0)return false;r[i]={...r[i],...patch,updatedAt:Date.now()};const ok=setReports(r);if(ok)addActivity('Updated report '+id,'report');return ok}
function deleteReport(id){const r=getReports();const target=r.find(x=>x.id===id);if(!target||target.ownerId!==OWNER||target.isSample)return false;const ok=setReports(r.filter(x=>x.id!==id));if(ok){setClaims(getClaims().filter(c=>c.reportId!==id));addActivity('Deleted report '+id,'report')}return ok}
function addClaim(data){const claims=getClaims();const claim={...data,id:nextId('claim'),ownerId:OWNER,status:'Pending',adminNote:'',isSample:false,createdAt:Date.now()};claims.unshift(claim);if(!setClaims(claims))return null;addActivity('Submitted claim '+claim.id+' for '+claim.reportId,'claim');return claim}
function reviewClaim(id,status,note=''){if(!['Approved','Rejected'].includes(status))return {ok:false,message:'Invalid review status.'};const claims=getClaims();const idx=claims.findIndex(c=>c.id===id);if(idx<0)return {ok:false,message:'Claim not found.'};if(claims[idx].status!=='Pending')return {ok:false,message:'This claim has already been reviewed.'};const claim=claims[idx];if(status==='Approved'){const already=getClaims().some(c=>c.id!==id&&c.reportId===claim.reportId&&c.status==='Approved');if(already)return {ok:false,message:'Another claim has already been approved for this report.'};const reports=getReports();const report=reports.find(r=>r.id===claim.reportId);if(!report||report.type!=='Found'||report.status==='Returned')return {ok:false,message:'This item is no longer available for a claim.'};report.status='Returned';report.returnedAt=Date.now();setReports(reports);claims.forEach(c=>{if(c.id!==id&&c.reportId===claim.reportId&&c.status==='Pending'){c.status='Rejected';c.adminNote='Closed because another demo claim was approved.'}})}claims[idx].status=status;claims[idx].adminNote=String(note||'').slice(0,300);claims[idx].reviewedAt=Date.now();if(!setClaims(claims))return {ok:false,message:'Could not save the review.'};addActivity('Demo Admin '+status.toLowerCase()+' claim '+id,'review');return {ok:true,message:'Claim '+status.toLowerCase()+' for the demo.'}}
function reset(){const ok1=save(KEYS.reports,clone(sampleReports));const ok2=save(KEYS.claims,initialClaims());const ok3=save(KEYS.activity,[{id:'ACT-'+Date.now(),message:'Demo data was reset to the original sample dataset',kind:'system',at:Date.now()}]);save(KEYS.settings,{version:1,seededAt:Date.now()});return ok1&&ok2&&ok3}
function getImage(report){if(report&&report.customImage)return report.customImage;const key=report&&report.imageKey;return imageMap[key]||'assets/images/item-fallback.svg'}
function getFallback(report){const cat=(report&&report.category||'Other Items').toLowerCase().replace(/[^a-z]/g,'');return 'assets/images/'+(report&&report.imageKey?report.imageKey:cat)+'.svg'}
function dateLabel(date){if(!date)return 'Date not provided';const d=new Date(date+'T12:00:00');if(Number.isNaN(d.getTime()))return date;return d.toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})}
function timeLabel(ts){if(!ts)return '';return new Date(ts).toLocaleString(undefined,{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
seed();
window.FindItStore={KEYS,OWNER,categories,categoryIcons,imageMap,getReports,getClaims,getActivity,setReports,setClaims,addActivity,nextId,addReport,updateReport,deleteReport,addClaim,reviewClaim,reset,getImage,getFallback,dateLabel,timeLabel,escapeHtml};
})();
