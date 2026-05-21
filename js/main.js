/* ============================================================
   Sugeerth Murugesan — Portfolio
   Project data, category filtering, scroll reveal, mobile nav
   ============================================================ */

'use strict';

/* ---------- Project data ---------- */
const PROJECTS = [
  {
    name: 'deepseed',
    category: 'LLM Training & Infra',
    tagline: 'Real-time DeepSpeed training dashboard.',
    desc: '12 interactive D3.js charts streaming GPU metrics, loss curves, and gradient-flow visualizations, plus educational notebooks.',
    tech: ['Python', 'DeepSpeed', 'D3.js'],
    featured: true,
    demo: 'demos/deepseed/'
  },
  {
    name: 'ML System Design Handbook',
    category: 'ML Education',
    tagline: 'A FAANG-grade ML system design handbook.',
    desc: '12 chapters with an interactive web viewer, rendered Mermaid architecture diagrams, full-text search, and 18 worked interview problems.',
    tech: ['Vanilla JS', 'Marked', 'Mermaid'],
    featured: true,
    demo: 'demos/system-design/'
  },
  {
    name: 'GNN Explorer',
    category: 'ML Education',
    tagline: 'Graph Neural Network explorer.',
    desc: 'GCN, GAT, and GraphSAGE trained on the Cora citation network with interactive attention visualizations; 4.5x accuracy gain over raw-feature baselines.',
    tech: ['PyTorch', 'PyG', 'Plotly'],
    featured: true,
    demo: 'demos/gnn/'
  },
  {
    name: 'agent-trace-viz',
    category: 'Observability',
    tagline: 'Drop-in observability tracer for AI agents.',
    desc: 'Captures LLM calls, tool invocations, and multi-step decision trees into searchable, annotated traces with a live dashboard.',
    tech: ['Python', 'FastAPI', 'SQLite'],
    featured: true,
    demo: null
  },
  {
    name: 'Production RAG',
    category: 'RAG & Retrieval',
    tagline: 'Production-grade Retrieval-Augmented Generation system.',
    desc: 'Hybrid BM25+vector search, cross-encoder reranking, inline citations, and full answer traceability over private documents.',
    tech: ['Python', 'FastAPI', 'ChromaDB', 'Ollama'],
    featured: true,
    demo: null
  },
  {
    name: 'VoyageAI',
    category: 'AI Agents',
    tagline: 'Multi-agent travel planner.',
    desc: 'Coordinates flight, hotel, weather, and budget agents via LangGraph with full-trace observability through Langfuse.',
    tech: ['Python', 'LangGraph', 'Streamlit', 'Langfuse'],
    featured: false,
    demo: null
  },
  {
    name: 'Agentic Post-Training',
    category: 'LLM Training & Infra',
    tagline: 'Agentic post-training orchestrator.',
    desc: 'Runs PPO, GRPO, DPO, SPO, and RLHF (11 techniques) through a modular agent message bus.',
    tech: ['Python', 'Pydantic', 'LangChain'],
    featured: false,
    demo: null
  },
  {
    name: 'OMNISCOPE',
    category: 'Observability',
    tagline: 'Multi-agent observability platform.',
    desc: 'Agent-DAG tracing, multi-LLM judge panels, failure prediction, and time-travel debugging.',
    tech: ['Python', 'FastAPI', 'React', 'Ollama'],
    featured: false,
    demo: null
  },
  {
    name: 'LocalSWEAgent',
    category: 'AI Agents',
    tagline: 'A laptop-scale LLM that fixes real GitHub issues.',
    desc: 'A 3B-parameter local LLM that resolves real GitHub issues offline via Ollama, with a results dashboard benchmarking its fixes.',
    tech: ['Python', 'Ollama', 'Qwen2.5'],
    featured: false,
    demo: 'demos/localsweagent/'
  },
  {
    name: 'Multi-GPU Training Viz',
    category: 'LLM Training & Infra',
    tagline: 'Compare four distributed-training strategies.',
    desc: 'Side-by-side comparison of four distributed-training strategies — Single-GPU, DDP, FSDP, and DeepSpeed ZeRO-2 — with live loss curves and throughput metrics, reproducible on free Colab/Kaggle GPUs.',
    tech: ['Python', 'PyTorch', 'Jupyter'],
    featured: false,
    demo: null
  },
  {
    name: 'Multimodal Training Sweep',
    category: 'LLM Training & Infra',
    tagline: 'Parallel multimodal-LLM training-sweep orchestrator.',
    desc: 'A parallel multimodal-LLM training-sweep orchestrator with watchdog crash recovery and automatic deployment across 13 model variants.',
    tech: ['Python', 'PyYAML', 'Anthropic API'],
    featured: false,
    demo: null
  },
  {
    name: 'Self-Learning LLM Training',
    category: 'AI Agents',
    tagline: 'A self-learning multi-agent LLM training loop.',
    desc: 'Hierarchical Trainer to Evaluator to Judge to MetaJudge agents with Hyperband scheduling and a live observability dashboard.',
    tech: ['Python', 'Flask', 'Anthropic API'],
    featured: false,
    demo: null
  }
];

/* ---------- Tech stack groups ---------- */
const STACK = [
  { title: 'Languages', items: ['Python', 'TypeScript / JS', 'SQL', 'Bash'] },
  { title: 'ML & Training', items: ['PyTorch', 'DeepSpeed', 'FSDP / DDP', 'PyTorch Geometric', 'Hugging Face'] },
  { title: 'Agents & LLM', items: ['LangGraph', 'LangChain', 'Ollama', 'Anthropic API', 'ChromaDB'] },
  { title: 'Infra & Observability', items: ['FastAPI', 'Langfuse', 'Docker', 'D3.js', 'Streamlit'] }
];

/* ---------- SVG icons ---------- */
const ICON_ARROW = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
const ICON_STAR  = '<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z"/></svg>';
const ICON_LOCK  = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

/* ---------- Render project cards ---------- */
function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function renderProjects() {
  const grid = document.getElementById('projectGrid');
  grid.innerHTML = PROJECTS.map(p => {
    const badges = p.tech.map(t => `<span class="tech-badge">${escapeHtml(t)}</span>`).join('');
    const featured = p.featured
      ? `<span class="card-featured">${ICON_STAR} Featured</span>`
      : '';
    const action = p.demo
      ? `<a class="card-demo" href="${p.demo}" target="_blank" rel="noopener">${ICON_ARROW} Live Demo</a>`
      : `<span class="card-nodemo">${ICON_LOCK} Private repository</span>`;
    return `
      <article class="card" data-category="${escapeHtml(p.category)}">
        <div class="card-top">
          <span class="card-cat">${escapeHtml(p.category)}</span>
          ${featured}
        </div>
        <h3 class="card-name">${escapeHtml(p.name)}</h3>
        <p class="card-tagline">${escapeHtml(p.tagline)}</p>
        <p class="card-desc">${escapeHtml(p.desc)}</p>
        <div class="card-tech">${badges}</div>
        <div class="card-actions">${action}</div>
      </article>`;
  }).join('');
}

/* ---------- Render tech stack ---------- */
function renderStack() {
  const wrap = document.getElementById('stackGroups');
  wrap.innerHTML = STACK.map(g => `
    <div class="stack-group">
      <h3>${escapeHtml(g.title)}</h3>
      <ul>${g.items.map(i => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
    </div>`).join('');
}

/* ---------- Category filtering ---------- */
function initFilters() {
  const pills = document.querySelectorAll('.pill');
  const cards = () => document.querySelectorAll('.card');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.filter;
      cards().forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'));
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
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transition = 'opacity .6s var(--ease), transform .6s var(--ease)';
        e.target.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
        e.target.classList.add('in');
        cardIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.card').forEach(c => {
    c.classList.add('reveal');
    cardIO.observe(c);
  });
}

/* ---------- Sticky nav state ---------- */
function initNav() {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  renderStack();
  initFilters();
  initNav();
  initReveal();
});
