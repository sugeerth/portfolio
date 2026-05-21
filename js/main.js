/* ============================================================
   Sugeerth Murugesan — Portfolio
   Project data, category filtering, scroll reveal, mobile nav
   ============================================================ */

'use strict';

/* ---------- Project data ----------
   visibility : 'public' | 'private'
   code       : GitHub repo URL  (public repos only)
   demo       : live demo URL    (GitHub Pages for public, demos/ path for private)
   ------------------------------------------------------------ */
const PROJECTS = [
  {
    name: 'deepseed',
    category: 'LLM Training & Infra',
    tagline: 'Real-time DeepSpeed training dashboard.',
    desc: '12 interactive D3.js charts streaming GPU metrics, loss curves, and gradient-flow visualizations, plus educational notebooks.',
    tech: ['Python', 'DeepSpeed', 'D3.js'],
    featured: true,
    visibility: 'private',
    code: null,
    demo: 'demos/deepseed/'
  },
  {
    name: 'ML System Design Handbook',
    category: 'ML Education',
    tagline: 'An ML system design handbook.',
    desc: '12 chapters with an interactive web viewer, rendered Mermaid architecture diagrams, full-text search, and 18 worked interview problems.',
    tech: ['Vanilla JS', 'Marked', 'Mermaid'],
    featured: true,
    visibility: 'private',
    code: null,
    demo: null
  },
  {
    name: 'GNN Explorer',
    category: 'ML Education',
    tagline: 'Graph Neural Network explorer.',
    desc: 'GCN, GAT, and GraphSAGE trained on the Cora citation network with interactive attention visualizations; 4.5x accuracy gain over raw-feature baselines.',
    tech: ['PyTorch', 'PyG', 'Plotly'],
    featured: true,
    visibility: 'public',
    code: 'https://github.com/sugeerth/gnn',
    demo: 'https://sugeerth.github.io/gnn/'
  },
  {
    name: 'agent-trace-viz',
    category: 'Observability',
    tagline: 'Drop-in observability tracer for AI agents.',
    desc: 'Captures LLM calls, tool invocations, and multi-step decision trees into searchable, annotated traces with a live dashboard.',
    tech: ['Python', 'FastAPI', 'SQLite'],
    featured: true,
    visibility: 'public',
    code: 'https://github.com/sugeerth/agent-trace-viz',
    demo: null
  },
  {
    name: 'Production RAG',
    category: 'RAG & Retrieval',
    tagline: 'A retrieval-augmented generation system.',
    desc: 'Hybrid BM25+vector search, cross-encoder reranking, inline citations, and full answer traceability over private documents.',
    tech: ['Python', 'FastAPI', 'ChromaDB', 'Ollama'],
    featured: true,
    visibility: 'private',
    code: null,
    demo: null
  },
  {
    name: 'VoyageAI',
    category: 'AI Agents',
    tagline: 'Multi-agent travel planner.',
    desc: 'Coordinates flight, hotel, weather, and budget agents via LangGraph with full-trace observability through Langfuse.',
    tech: ['Python', 'LangGraph', 'Streamlit', 'Langfuse'],
    featured: false,
    visibility: 'public',
    code: 'https://github.com/sugeerth/agentic_data',
    demo: 'https://sugeerth.github.io/agentic_data/'
  },
  {
    name: 'Agentic Post-Training',
    category: 'LLM Training & Infra',
    tagline: 'Agentic post-training orchestrator.',
    desc: 'Runs PPO, GRPO, DPO, SPO, and RLHF (11 techniques) through a modular agent message bus.',
    tech: ['Python', 'Pydantic', 'LangChain'],
    featured: false,
    visibility: 'public',
    code: 'https://github.com/sugeerth/agentic-post-training',
    demo: 'https://sugeerth.github.io/agentic-post-training/'
  },
  {
    name: 'OMNISCOPE',
    category: 'Observability',
    tagline: 'Multi-agent observability platform.',
    desc: 'Agent-DAG tracing, multi-LLM judge panels, failure prediction, and time-travel debugging.',
    tech: ['Python', 'FastAPI', 'React', 'Ollama'],
    featured: false,
    visibility: 'public',
    code: 'https://github.com/sugeerth/simple_agent_tracer',
    demo: null
  },
  {
    name: 'LocalSWEAgent',
    category: 'AI Agents',
    tagline: 'A laptop-scale LLM that fixes real GitHub issues.',
    desc: 'A 3B-parameter local LLM that resolves real GitHub issues offline via Ollama, with a results dashboard benchmarking its fixes.',
    tech: ['Python', 'Ollama', 'Qwen2.5'],
    featured: false,
    visibility: 'private',
    code: null,
    demo: 'demos/localsweagent/'
  },
  {
    name: 'Multi-GPU Training Viz',
    category: 'LLM Training & Infra',
    tagline: 'Compare four distributed-training strategies.',
    desc: 'Side-by-side comparison of four distributed-training strategies — Single-GPU, DDP, FSDP, and DeepSpeed ZeRO-2 — with live loss curves and throughput metrics, reproducible on free Colab/Kaggle GPUs.',
    tech: ['Python', 'PyTorch', 'Jupyter'],
    featured: false,
    visibility: 'public',
    code: 'https://github.com/sugeerth/multi-gpu-training-viz',
    demo: null
  },
  {
    name: 'Multimodal Training Sweep',
    category: 'LLM Training & Infra',
    tagline: 'Parallel multimodal-LLM training-sweep orchestrator.',
    desc: 'A parallel multimodal-LLM training-sweep orchestrator with watchdog crash recovery and automatic deployment across 13 model variants.',
    tech: ['Python', 'PyYAML', 'Anthropic API'],
    featured: false,
    visibility: 'private',
    code: null,
    demo: null
  },
  {
    name: 'Self-Learning LLM Training',
    category: 'AI Agents',
    tagline: 'A self-learning multi-agent LLM training loop.',
    desc: 'Hierarchical Trainer to Evaluator to Judge to MetaJudge agents with Hyperband scheduling and a live observability dashboard.',
    tech: ['Python', 'Flask', 'Anthropic API'],
    featured: false,
    visibility: 'private',
    code: null,
    demo: null
  }
];

/* ---------- "What I build" expertise groups ---------- */
const EXPERTISE = [
  {
    title: 'LLM Training & Infrastructure',
    blurb: 'Distributed training pipelines and reproducible post-training at any scale.',
    items: ['PyTorch', 'DeepSpeed ZeRO', 'FSDP / DDP', 'RLHF · DPO · GRPO · PPO', 'Multi-GPU sweeps', 'Crash-recovery orchestration']
  },
  {
    title: 'Agentic Systems',
    blurb: 'Multi-agent orchestration with message buses, planners, and self-learning loops.',
    items: ['LangGraph', 'LangChain', 'Agent message bus', 'Hierarchical judge panels', 'Hyperband scheduling', 'Pydantic']
  },
  {
    title: 'RAG & Retrieval',
    blurb: 'Production retrieval with hybrid search, reranking, and full citation traceability.',
    items: ['Hybrid BM25 + vector', 'ChromaDB', 'Cross-encoder reranking', 'Inline citations', 'Ollama', 'Local-first inference']
  },
  {
    title: 'AI Observability',
    blurb: 'Tracers and dashboards that make agent behavior searchable and debuggable.',
    items: ['Agent-DAG tracing', 'Langfuse', 'Time-travel debugging', 'Failure prediction', 'FastAPI', 'D3.js dashboards']
  }
];

/* ---------- SVG icons ---------- */
const ICON_ARROW  = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
const ICON_STAR   = '<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z"/></svg>';
const ICON_LOCK   = '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
const ICON_GLOBE  = '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>';
const ICON_GITHUB = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z"/></svg>';

/* ---------- Helpers ---------- */
function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function isExternal(url) { return /^https?:\/\//.test(url); }

/* ---------- Render project cards ---------- */
function renderProjects() {
  const grid = document.getElementById('projectGrid');
  // Highlight projects first: public / open-source repos lead, featured first within each group
  const ordered = [...PROJECTS].sort((a, b) => {
    const av = a.visibility === 'public' ? 0 : 1;
    const bv = b.visibility === 'public' ? 0 : 1;
    if (av !== bv) return av - bv;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });
  grid.innerHTML = ordered.map(p => {
    const badges = p.tech.map(t => `<span class="tech-badge">${escapeHtml(t)}</span>`).join('');

    const featured = p.featured
      ? `<span class="tag tag-featured">${ICON_STAR} Featured</span>`
      : '';

    const visBadge = p.visibility === 'public'
      ? `<span class="tag tag-public">${ICON_GLOBE} Public</span>`
      : `<span class="tag tag-private">${ICON_LOCK} Private</span>`;

    // Action buttons
    const actions = [];
    if (p.code) {
      actions.push(
        `<a class="card-btn card-btn-code" href="${escapeHtml(p.code)}" target="_blank" rel="noopener">${ICON_GITHUB} Code</a>`
      );
    }
    if (p.demo) {
      const ext = isExternal(p.demo);
      actions.push(
        `<a class="card-btn card-btn-demo" href="${escapeHtml(p.demo)}"` +
        `${ext ? ' target="_blank" rel="noopener"' : ''}>${ICON_ARROW} Live Demo</a>`
      );
    }
    const actionsHtml = actions.length
      ? actions.join('')
      : `<span class="card-note">${ICON_LOCK} Private — available on request</span>`;

    return `
      <article class="card${p.featured ? ' card-featured-state' : ''}" data-category="${escapeHtml(p.category)}">
        <div class="card-top">
          <span class="card-cat">${escapeHtml(p.category)}</span>
          <div class="card-tags">
            ${featured}
            ${visBadge}
          </div>
        </div>
        <h3 class="card-name">${escapeHtml(p.name)}</h3>
        <p class="card-tagline">${escapeHtml(p.tagline)}</p>
        <p class="card-desc">${escapeHtml(p.desc)}</p>
        <div class="card-tech">${badges}</div>
        <div class="card-actions">${actionsHtml}</div>
      </article>`;
  }).join('');
}

/* ---------- Render "What I build" expertise ---------- */
function renderExpertise() {
  const wrap = document.getElementById('expertiseGroups');
  if (!wrap) return;
  wrap.innerHTML = EXPERTISE.map(g => `
    <div class="expertise-card">
      <h3>${escapeHtml(g.title)}</h3>
      <p class="expertise-blurb">${escapeHtml(g.blurb)}</p>
      <div class="expertise-items">
        ${g.items.map(i => `<span class="expertise-chip">${escapeHtml(i)}</span>`).join('')}
      </div>
    </div>`).join('');
}

/* ---------- Category filtering ---------- */
function initFilters() {
  const pills = document.querySelectorAll('.pill');
  const cards = () => document.querySelectorAll('.card');
  const countEl = document.getElementById('filterCount');

  function applyFilter(filter) {
    let visible = 0;
    cards().forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) visible++;
    });
    if (countEl) {
      countEl.textContent = filter === 'all'
        ? `${visible} projects`
        : `${visible} project${visible === 1 ? '' : 's'}`;
    }
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      applyFilter(pill.dataset.filter);
    });
  });
  applyFilter('all');
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'));
    document.querySelectorAll('.card').forEach(c => c.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));

  // Stagger project cards as they appear
  const cardIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const idx = [...e.target.parentElement.children].indexOf(e.target);
        e.target.style.transitionDelay = `${Math.min(idx, 8) * 55}ms`;
        e.target.classList.add('in');
        cardIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.card').forEach(c => {
    c.classList.add('reveal-card');
    cardIO.observe(c);
  });
}

/* ---------- Animated stat counters ---------- */
function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-count]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    nums.forEach(n => { n.textContent = n.dataset.count; });
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const dur = 1100;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(eased * target);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
}

/* ---------- Sticky nav + scroll-spy ---------- */
function initNav() {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.classList.toggle('is-open', open);
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );

  // Scroll-spy: highlight current section in nav
  const sections = ['about', 'projects', 'expertise', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navMap = {};
  links.querySelectorAll('a[href^="#"]').forEach(a => {
    navMap[a.getAttribute('href').slice(1)] = a;
  });
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const link = navMap[e.target.id];
        if (link && e.isIntersecting) {
          Object.values(navMap).forEach(l => l.classList.remove('current'));
          link.classList.add('current');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }
}

/* ---------- Year ---------- */
function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  renderExpertise();
  initFilters();
  initNav();
  initReveal();
  initCounters();
  initYear();
});
