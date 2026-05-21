'use strict';

/* ===================================================================
   ML System Design Bible — static single-page doc viewer
   Renders Markdown chapters + Mermaid diagrams, with search,
   in-page TOC, and a cross-chapter diagram gallery.
   =================================================================== */

const DOCS = [
  { group: 'Start Here', items: [
    { id: 'cheatsheet', title: '⚡ Interview Cheat Sheet', icon: '⚡' },
    { id: '00-index',   title: 'Overview & Index',         icon: '🧭' },
  ]},
  { group: 'Core Curriculum', items: [
    { id: '01-foundations',            title: '1 · Foundations',              icon: '🏛️' },
    { id: '02-ml-system-design-core',  title: '2 · ML System Design Core',    icon: '⚙️' },
    { id: '03a-llm-infrastructure',    title: '3A · LLM Infrastructure',      icon: '🧠' },
    { id: '03b-ai-architectures',      title: '3B · AI & Agent Architectures',icon: '🤖' },
  ]},
  { group: 'Interview Track', items: [
    { id: '04-interview-preparation',              title: '4 · Interview Preparation',           icon: '🎯' },
    { id: '05a-practice-beginner-intermediate',    title: '5A · Practice — Beginner & Inter.',   icon: '✏️' },
    { id: '05b-practice-advanced-llm',             title: '5B · Practice — Advanced & LLM',      icon: '🚀' },
  ]},
  { group: 'Deep-Dive Case Studies', items: [
    { id: 'case-code-assistant',      title: 'Code Assistant',          icon: '🧩' },
    { id: 'case-web-agent',           title: 'Multi-Agent Web Browser', icon: '🕸️' },
    { id: 'case-shorts-feed',         title: 'YouTube Shorts Feed',     icon: '📱' },
    { id: 'case-video-search',        title: 'Multimodal Video Search', icon: '🎬' },
    { id: 'case-content-moderation',  title: 'Content Moderation',      icon: '🛡️' },
    { id: 'case-distributed-training',title: 'Distributed Training',    icon: '🔥' },
    { id: 'case-leaf-classification', title: 'Leaf Classification',     icon: '🍃' },
  ]},
  { group: 'Reference', items: [
    { id: '06-real-world-engineering', title: '6 · Real-World Engineering', icon: '🏢' },
    { id: '07-learning-roadmap',       title: '7 · Learning Roadmap',       icon: '🗺️' },
  ]},
  { group: 'Companion Volumes', items: [
    { id: 'science',     title: '★ The Science',     icon: '🔬' },
    { id: 'engineering', title: '★ The Engineering', icon: '🛠️' },
  ]},
];
const ALL   = DOCS.flatMap(g => g.items);
const TITLE = Object.fromEntries(ALL.map(d => [d.id, d.title]));
const ORDER = ALL.map(d => d.id);

const state = { cache:{}, current:null, index:null, mermaidSeq:0 };

const qs  = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => [...r.querySelectorAll(s)];

function slugify(s){
  return String(s).toLowerCase()
    .replace(/[^\w\s-]/g,'').trim()
    .replace(/\s+/g,'-').replace(/-+/g,'-');
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ---------------- theme ---------------- */
function setTheme(t){
  document.documentElement.dataset.theme = t;
  qs('#hljs-dark').disabled  = t !== 'dark';
  qs('#hljs-light').disabled = t === 'dark';
  qs('#theme-btn').textContent = t === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('msdb-theme', t);
}

/* ---------------- visible error handler ---------------- */
/* If a library or script fails, show the real error instead of an
   eternal "Loading…" — so problems are diagnosable, not silent. */
function showFatal(msg){
  const c = document.getElementById('content');
  if(c){
    c.innerHTML = '<div class="mermaid-error" style="border-style:solid">' +
      '<strong>⚠️ The app hit an error.</strong><br/>' +
      escapeHtml(String(msg)) +
      '<br/><br/>Most fixes: reload the page, or re-run <code>python3 build-bundle.py</code>. ' +
      'Check the browser console (View → Developer → JavaScript Console) for detail.</div>';
  }
}
window.addEventListener('error', e => {
  const c = document.getElementById('content');
  if(c && c.querySelector('.loading')) showFatal(e.message || e.error || 'Unknown error');
});
window.addEventListener('unhandledrejection', e => {
  const c = document.getElementById('content');
  if(c && c.querySelector('.loading')) showFatal((e.reason && e.reason.message) || e.reason || 'Promise rejected');
});

/* ---------------- init ---------------- */
window.addEventListener('DOMContentLoaded', () => { init().catch(showFatal); });

async function init(){
  setTheme(localStorage.getItem('msdb-theme') || 'dark');
  marked.setOptions({ gfm:true });
  initMermaid();
  qs('#foot-date').textContent = 'rendered ' + new Date().toLocaleDateString();
  renderSidebar();
  bindEvents();
  window.addEventListener('hashchange', route);
  window.addEventListener('scroll', updateProgress, { passive:true });
  await route();
}

function initMermaid(){
  mermaid.initialize({
    startOnLoad:false,
    securityLevel:'loose',
    theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'neutral',
    flowchart:{ htmlLabels:true, curve:'basis', useMaxWidth:true },
    sequence:{ useMaxWidth:true },
    themeVariables:{ fontFamily:'inherit', fontSize:'13px' },
  });
}

/* ---------------- sidebar ---------------- */
function renderSidebar(){
  const nav = qs('#nav');
  nav.innerHTML = '';
  for(const g of DOCS){
    const grp = document.createElement('div');
    grp.className = 'nav-group';
    grp.innerHTML = `<div class="nav-group-title">${escapeHtml(g.group)}</div>`;
    for(const it of g.items){
      const a = document.createElement('a');
      a.className = 'nav-link';
      a.href = '#' + it.id;
      a.dataset.doc = it.id;
      a.innerHTML = `<span class="nav-ico">${it.icon}</span><span>${escapeHtml(it.title)}</span>`;
      grp.appendChild(a);
    }
    nav.appendChild(grp);
  }
}

/* ---------------- routing ---------------- */
async function route(){
  const raw = decodeURIComponent(location.hash.replace(/^#/,''));
  const [docId, anchor] = raw.split('::');
  const id = ORDER.includes(docId) ? docId : 'cheatsheet';
  if(id !== state.current) await loadDoc(id);
  if(anchor) scrollToHeading(anchor);
  else window.scrollTo({ top:0 });
  closeSidebarMobile();
}

/* ---------------- doc loading ---------------- */
async function fetchDoc(id){
  if(state.cache[id] != null) return state.cache[id];
  // 1. Embedded bundle — works offline AND from the file:// protocol, no server needed.
  if(window.MSDB_DOCS && typeof window.MSDB_DOCS[id] === 'string'){
    return (state.cache[id] = window.MSDB_DOCS[id]);
  }
  // 2. Fallback — fetch the raw markdown file (only works when served over http).
  try{
    const res = await fetch(`docs/${id}.md`, { cache:'no-cache' });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    state.cache[id] = await res.text();
  }catch(e){
    state.cache[id] =
      `# ${TITLE[id] || id}\n\n> ⚠️ **This chapter could not be loaded.**\n\n` +
      `It was not found in the embedded bundle (\`docs-bundle.js\`) and could not be fetched.\n\n` +
      `Fix: run \`python3 build-bundle.py\` to rebuild the bundle, then reload.`;
  }
  return state.cache[id];
}

async function loadDoc(id){
  state.current = id;
  const content = qs('#content');
  content.innerHTML = '<div class="loading">Loading chapter…</div>';
  qsa('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.doc === id));

  const md = await fetchDoc(id);
  content.innerHTML = marked.parse(md);

  decorateHeadings(content);
  decorateTables(content);
  decorateCallouts(content);
  highlightCode(content);
  await renderMermaidIn(content);

  buildTOC(content);
  buildPrevNext(id);
  observeHeadings(content);
  document.title = `${TITLE[id]} · ML System Design Bible`;
  updateProgress();
}

/* ---------------- content decorators ---------------- */
function decorateHeadings(root){
  const used = {};
  qsa('h1,h2,h3,h4', root).forEach(h => {
    let base = slugify(h.textContent) || 'section';
    let id = base, n = 1;
    while(used[id]) id = `${base}-${++n}`;
    used[id] = true;
    h.id = id;
    const a = document.createElement('a');
    a.className = 'anchor'; a.textContent = '#';
    a.href = `#${state.current}::${id}`;
    h.appendChild(a);
  });
}
function decorateTables(root){
  qsa('table', root).forEach(t => {
    if(t.parentElement.classList.contains('table-wrap')) return;
    const w = document.createElement('div');
    w.className = 'table-wrap';
    t.replaceWith(w); w.appendChild(t);
  });
}
function decorateCallouts(root){
  qsa('blockquote', root).forEach(bq => {
    const t = bq.textContent.trim();
    if(/^🎯/.test(t)) bq.classList.add('co-staff');
    else if(/^⚠️?/.test(t)) bq.classList.add('co-warn');
    else if(/^💡/.test(t)) bq.classList.add('co-tip');
  });
}
function highlightCode(root){
  qsa('pre code', root).forEach(c => {
    if(c.classList.contains('language-mermaid')) return;
    try{ hljs.highlightElement(c); }catch(e){}
  });
}
async function renderMermaidIn(root){
  const blocks = qsa('code.language-mermaid', root);
  for(const code of blocks){
    const src = code.textContent;
    const pre = code.closest('pre');
    const box = document.createElement('div');
    box.className = 'mermaid-diagram';
    try{
      const id = 'mmd-' + (++state.mermaidSeq);
      const { svg } = await mermaid.render(id, src);
      box.innerHTML = svg;
    }catch(e){
      box.className = 'mermaid-error';
      box.innerHTML = `⚠️ Diagram could not be rendered — showing source:` +
        `<pre><code>${escapeHtml(src)}</code></pre>`;
    }
    pre.replaceWith(box);
  }
}

/* ---------------- TOC + scroll spy ---------------- */
function buildTOC(root){
  const toc = qs('#toc');
  toc.innerHTML = '';
  const heads = qsa('h2,h3', root);
  if(!heads.length){ qs('#toc-wrap').style.visibility = 'hidden'; return; }
  qs('#toc-wrap').style.visibility = 'visible';
  for(const h of heads){
    const a = document.createElement('a');
    a.textContent = h.textContent.replace(/#$/,'').trim();
    a.href = `#${state.current}::${h.id}`;
    a.dataset.target = h.id;
    if(h.tagName === 'H3') a.classList.add('h3');
    toc.appendChild(a);
  }
}
let headObserver = null;
function observeHeadings(root){
  if(headObserver) headObserver.disconnect();
  const links = Object.fromEntries(qsa('#toc a').map(a => [a.dataset.target, a]));
  headObserver = new IntersectionObserver(entries => {
    for(const e of entries){
      if(e.isIntersecting){
        qsa('#toc a').forEach(a => a.classList.remove('active'));
        links[e.target.id]?.classList.add('active');
      }
    }
  }, { rootMargin:'-78px 0px -70% 0px', threshold:0 });
  qsa('h2,h3', root).forEach(h => headObserver.observe(h));
}

function scrollToHeading(anchor){
  const tryScroll = () => {
    let el = document.getElementById(anchor);
    if(!el){
      el = qsa('#content h1,#content h2,#content h3,#content h4')
        .find(h => slugify(h.textContent).includes(anchor));
    }
    if(el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  };
  setTimeout(tryScroll, 60);
}

/* ---------------- prev / next ---------------- */
function buildPrevNext(id){
  const i = ORDER.indexOf(id);
  const pn = qs('#prevnext');
  pn.innerHTML = '';
  if(i > 0){
    const p = ORDER[i-1];
    pn.insertAdjacentHTML('beforeend',
      `<a class="pn prev" href="#${p}"><small>← Previous</small><div>${escapeHtml(TITLE[p])}</div></a>`);
  } else { pn.insertAdjacentHTML('beforeend','<span class="pn" style="visibility:hidden"></span>'); }
  if(i < ORDER.length-1){
    const n = ORDER[i+1];
    pn.insertAdjacentHTML('beforeend',
      `<a class="pn next" href="#${n}"><small>Next →</small><div>${escapeHtml(TITLE[n])}</div></a>`);
  }
}

/* ---------------- progress bar ---------------- */
function updateProgress(){
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  qs('#progress').style.width = max > 0 ? (h.scrollTop / max * 100) + '%' : '0%';
}

/* ===================================================================
   Search
   =================================================================== */
async function buildIndex(){
  if(state.index) return state.index;
  const idx = [];
  await Promise.all(ALL.map(async d => {
    const md = await fetchDoc(d.id);
    for(const sec of splitSections(d.id, md)){
      idx.push(sec);
    }
  }));
  state.index = idx;
  return idx;
}

function splitSections(docId, md){
  const lines = md.split('\n');
  const out = [];
  let title = TITLE[docId], hid = '', buf = [], inFence = false;
  const flush = () => {
    out.push({ docId, title, hid, text: buf.join(' ').replace(/\s+/g,' ').trim() });
    buf = [];
  };
  for(const line of lines){
    if(/^```/.test(line)){ inFence = !inFence; continue; }
    if(inFence) continue;
    const m = line.match(/^(#{1,4})\s+(.*)/);
    if(m){
      flush();
      title = m[2].replace(/[*`_#]/g,'').replace(/\s+#?$/,'').trim();
      hid = slugify(title);
    } else {
      buf.push(line.replace(/[#*`>|_-]/g,' '));
    }
  }
  flush();
  return out.filter(s => s.text.length || s.hid);
}

function runSearch(q){
  const box = qs('#search-results');
  q = q.trim().toLowerCase();
  if(!state.index){ box.innerHTML = '<div class="search-empty">Indexing chapters…</div>'; return; }
  if(!q){ box.innerHTML = '<div class="search-empty">Type to search all 12 chapters.</div>'; return; }
  const terms = q.split(/\s+/);
  const hits = [];
  for(const sec of state.index){
    const hay = (sec.title + ' ' + sec.text).toLowerCase();
    let score = 0, ok = true;
    for(const t of terms){
      if(!hay.includes(t)){ ok = false; break; }
      if(sec.title.toLowerCase().includes(t)) score += 10;
      score += (hay.split(t).length - 1);
    }
    if(ok) hits.push({ sec, score });
  }
  hits.sort((a,b) => b.score - a.score);
  if(!hits.length){ box.innerHTML = '<div class="search-empty">No matches.</div>'; return; }
  box.innerHTML = hits.slice(0,40).map((h,i) => {
    const s = h.sec;
    const snip = snippet(s.text, terms[0]);
    return `<div class="sr-item${i===0?' active':''}" data-doc="${s.docId}" data-hid="${s.hid}">
      <div class="sr-doc">${escapeHtml(TITLE[s.docId])}</div>
      <div class="sr-title">${mark(s.title, terms)}</div>
      <div class="sr-snippet">${mark(snip, terms)}</div>
    </div>`;
  }).join('');
}
function snippet(text, term){
  const i = text.toLowerCase().indexOf(term);
  if(i < 0) return text.slice(0,120);
  return (i>40?'… ':'') + text.slice(Math.max(0,i-40), i+90);
}
function mark(text, terms){
  let t = escapeHtml(text);
  for(const term of terms){
    if(term.length < 2) continue;
    t = t.replace(new RegExp('('+term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>');
  }
  return t;
}
function openSearch(){
  showModal('#search-modal');
  qs('#search-input').focus();
  qs('#search-input').select();
  buildIndex().then(() => runSearch(qs('#search-input').value));
}
function gotoResult(el){
  if(!el) return;
  hideModals();
  location.hash = `#${el.dataset.doc}::${el.dataset.hid}`;
}

/* ===================================================================
   Diagram gallery
   =================================================================== */
function extractDiagrams(docId, md){
  const lines = md.split('\n');
  const out = [];
  let heading = TITLE[docId], inMermaid = false, buf = [];
  for(const line of lines){
    const fence = line.match(/^```(\w*)/);
    if(fence){
      if(!inMermaid && fence[1] === 'mermaid'){ inMermaid = true; buf = []; continue; }
      if(inMermaid){ out.push({ docId, heading, code: buf.join('\n') }); inMermaid = false; continue; }
      continue;
    }
    if(inMermaid){ buf.push(line); continue; }
    const h = line.match(/^#{1,4}\s+(.*)/);
    if(h) heading = h[1].replace(/[*`_#]/g,'').trim();
  }
  return out;
}

async function openGallery(){
  showModal('#gallery-modal');
  const filter = qs('#gallery-filter');
  if(!filter.options.length){
    filter.innerHTML = '<option value="">All chapters</option>' +
      ALL.map(d => `<option value="${d.id}">${escapeHtml(d.title)}</option>`).join('');
    filter.value = state.current || '';
  }
  await renderGallery(filter.value);
}

async function renderGallery(filterId){
  const grid = qs('#gallery-grid');
  grid.innerHTML = '<div class="loading">Collecting diagrams…</div>';
  const ids = filterId ? [filterId] : ALL.map(d => d.id);
  let diagrams = [];
  for(const id of ids){
    const md = await fetchDoc(id);
    diagrams = diagrams.concat(extractDiagrams(id, md));
  }
  qs('#gallery-count').textContent = `${diagrams.length} diagram${diagrams.length===1?'':'s'}`;
  if(!diagrams.length){ grid.innerHTML = '<div class="search-empty">No diagrams found.</div>'; return; }
  grid.innerHTML = '';
  for(const d of diagrams){
    const card = document.createElement('div');
    card.className = 'gcard';
    card.title = 'Open in chapter';
    card.onclick = () => { hideModals(); location.hash = `#${d.docId}::${slugify(d.heading)}`; };
    card.innerHTML =
      `<div class="gcard-cap">${escapeHtml(TITLE[d.docId])}</div>` +
      `<div class="gcard-title">${escapeHtml(d.heading)}</div>` +
      `<div class="gcard-diagram"><div class="loading">rendering…</div></div>`;
    grid.appendChild(card);
    const target = qs('.gcard-diagram', card);
    try{
      const { svg } = await mermaid.render('gal-' + (++state.mermaidSeq), d.code);
      target.innerHTML = svg;
    }catch(e){
      target.innerHTML = `<pre style="text-align:left"><code>${escapeHtml(d.code)}</code></pre>`;
    }
  }
}

/* ===================================================================
   Modals + events
   =================================================================== */
function showModal(sel){
  hideModals();
  qs('#scrim').hidden = false;
  qs(sel).hidden = false;
}
function hideModals(){
  qs('#scrim').hidden = true;
  qs('#search-modal').hidden = true;
  qs('#gallery-modal').hidden = true;
}
function closeSidebarMobile(){ qs('#sidebar').classList.remove('open'); }

function bindEvents(){
  qs('#theme-btn').onclick = async () => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    initMermaid();
    if(state.current){ const md = await fetchDoc(state.current);
      const c = qs('#content'); c.innerHTML = marked.parse(md);
      decorateHeadings(c); decorateTables(c); decorateCallouts(c);
      highlightCode(c); await renderMermaidIn(c);
      buildTOC(c); observeHeadings(c);
    }
  };
  qs('#menu-btn').onclick   = () => qs('#sidebar').classList.toggle('open');
  qs('#search-btn').onclick = openSearch;
  qs('#search-close').onclick = hideModals;
  qs('#gallery-btn').onclick = openGallery;
  qs('#gallery-close').onclick = hideModals;
  qs('#scrim').onclick = hideModals;
  qs('#gallery-filter').onchange = e => renderGallery(e.target.value);

  let t;
  qs('#search-input').addEventListener('input', e => {
    clearTimeout(t);
    t = setTimeout(() => runSearch(e.target.value), 120);
  });
  qs('#search-results').addEventListener('click', e => {
    gotoResult(e.target.closest('.sr-item'));
  });

  document.addEventListener('keydown', e => {
    if(e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){
      e.preventDefault(); openSearch();
    } else if(e.key === 'Escape'){
      hideModals(); closeSidebarMobile();
    } else if(!qs('#search-modal').hidden){
      const items = qsa('.sr-item');
      let i = items.findIndex(x => x.classList.contains('active'));
      if(e.key === 'ArrowDown'){ e.preventDefault(); i = Math.min(items.length-1, i+1); }
      else if(e.key === 'ArrowUp'){ e.preventDefault(); i = Math.max(0, i-1); }
      else if(e.key === 'Enter'){ e.preventDefault(); gotoResult(items[i] || items[0]); return; }
      else return;
      items.forEach(x => x.classList.remove('active'));
      if(items[i]){ items[i].classList.add('active'); items[i].scrollIntoView({ block:'nearest' }); }
    }
  });
}
