(function(){
'use strict';
const S=window.FindItStore;
const nav=[['Home','index.html','home'],['Browse Items','browse.html','browse'],['Report an Item','report.html','report'],['Potential Matches','matches.html','matches'],['Dashboard','dashboard.html','dashboard']];
function renderShell(){
 const page=document.body.dataset.page||'home';
 const header=document.getElementById('app-header');
 if(header)header.innerHTML=`<header class="site-header"><div class="container nav-inner"><a class="brand" href="index.html"><span class="brand-mark">⌕</span><span><span class="brand-name">FindIt</span><span class="brand-caption">Lost & Found, made simpler</span></span></a><button class="menu-toggle" id="menu-toggle" aria-label="Toggle navigation">☰</button><nav class="nav-links" id="nav-links">${nav.map(n=>`<a href="${n[1]}" class="${page===n[2]?'active':''}">${n[0]}</a>`).join('')}<a href="admin.html" class="admin-link ${page==='admin'?'active':''}">Demo Admin ↗</a></nav></div></header>`;
 const footer=document.getElementById('app-footer');
 if(footer)footer.innerHTML=`<footer class="site-footer"><div class="container footer-inner"><a class="brand" href="index.html"><span class="brand-mark">⌕</span><span><span class="brand-name">FindIt</span><span class="brand-caption">A front-end project demo</span></span></a><div class="footer-note">Sample listings only · Local browser storage · No real authentication</div><div class="footer-links"><a href="browse.html">Browse</a><a href="report.html">Report</a><a href="matches.html">Matches</a><a href="admin.html">Demo Admin</a></div></div></footer>`;
 const toggle=document.getElementById('menu-toggle'),links=document.getElementById('nav-links');
 if(toggle&&links)toggle.addEventListener('click',()=>links.classList.toggle('open'));
}
function toast(message,type='success'){const region=document.getElementById('toast-region');if(!region){alert(message);return}const el=document.createElement('div');el.className='toast '+type;el.textContent=message;region.appendChild(el);setTimeout(()=>el.remove(),4000)}
window.addEventListener('findit-storage-error',e=>toast(e.detail?.message||'Browser storage error.', 'error'));
function statusClass(s){return 'status-'+String(s||'Open').toLowerCase()}
function statusPill(status){return `<span class="status-pill ${statusClass(status)}">${S.escapeHtml(status||'Open')}</span>`}
function itemCard(r){
 const img=S.getImage(r),fallback=S.getFallback(r);
 return `<article class="product-card"><div class="product-image-wrap"><img class="product-image" src="${S.escapeHtml(img)}" data-fallback="${S.escapeHtml(fallback)}" alt="${S.escapeHtml(r.name)}" loading="lazy"><span class="product-type">${S.escapeHtml(r.type)}</span>${r.isSample?'<span class="sample-chip">SAMPLE</span>':''}</div><div class="product-info"><div class="product-meta"><span>${S.escapeHtml(r.category)}</span>${statusPill(r.status)}</div><h3 title="${S.escapeHtml(r.name)}">${S.escapeHtml(r.name)}</h3><div class="product-location">⌖ ${S.escapeHtml(r.location)}</div><div class="product-card-footer"><span class="product-id">${S.escapeHtml(r.id)} · ${S.dateLabel(r.date)}</span><button class="btn btn-secondary" type="button" data-view-report="${S.escapeHtml(r.id)}">View details →</button></div></div></article>`;
}
function bindImageFallback(root=document){root.querySelectorAll('img[data-fallback]').forEach(img=>{if(img.dataset.fallbackBound)return;img.dataset.fallbackBound='1';img.addEventListener('error',()=>{if(img.src!==new URL(img.dataset.fallback,document.baseURI).href)img.src=img.dataset.fallback;},{once:true})})}
function renderStats(targetId,reports){
 const target=document.getElementById(targetId);if(!target)return;
 const open=reports.filter(r=>r.status==='Open').length,available=reports.filter(r=>r.status==='Available').length,returned=reports.filter(r=>r.status==='Returned').length;
 target.innerHTML=[['⌕',reports.length,'Total reports'],['✦',open+available,'Items still listed'],['✓',returned,'Marked returned (demo)']].map(x=>`<div class="stat-card"><div class="stat-icon">${x[0]}</div><div><div class="stat-value">${x[1]}</div><div class="stat-label">${x[2]}</div></div></div>`).join('');
}
function initHome(){
 const reports=S.getReports();renderStats('home-stats',reports);
 const cats=document.getElementById('category-shortcuts');
 if(cats)cats.innerHTML=S.categories.map(c=>`<button type="button" class="category-card" data-category-shortcut="${S.escapeHtml(c)}"><span class="category-icon">${S.categoryIcons[c]||'✦'}</span><strong>${S.escapeHtml(c)}</strong></button>`).join('');
 const recent=document.getElementById('recent-items');
 if(recent){recent.innerHTML=reports.slice().sort((a,b)=>b.createdAt-a.createdAt).slice(0,4).map(itemCard).join('');bindImageFallback(recent)}
 document.getElementById('hero-search')?.addEventListener('submit',e=>{e.preventDefault();const q=document.getElementById('hero-query').value.trim();location.href='browse.html'+(q?'?q='+encodeURIComponent(q):'')});
}
document.addEventListener('click',e=>{const cat=e.target.closest('[data-category-shortcut]');if(cat)location.href='browse.html?category='+encodeURIComponent(cat.dataset.categoryShortcut);const view=e.target.closest('[data-view-report]');if(view)window.dispatchEvent(new CustomEvent('findit-view-report',{detail:{id:view.dataset.viewReport}}))});
renderShell();if(document.body.dataset.page==='home')initHome();
window.FindItUI={toast,statusPill,statusClass,itemCard,bindImageFallback,renderStats};
})();
