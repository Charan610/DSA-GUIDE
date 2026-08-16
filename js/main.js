/**
 * CSE CAREER OS — Editorial Technical Laboratory System
 * High-performance state store, capability intelligence engines, AI mentor,
 * Command palette (⌘K), Focus mode, and interactive visualizations.
 */

window.CareerOS = (function () {
  'use strict';

  // -------------------------------------------------------------
  // 1. Initial State & Persistent Store
  // -------------------------------------------------------------
  const STORAGE_KEY = 'cse_career_os_state_v3';

  const defaultState = {
    theme: 'dark',
    careerTarget: 'track-product', // Default: Product Engineering
    dailyTargetHours: 2.5,
    userProfile: {
      name: 'Charan',
      title: 'Aspiring Software Engineer',
      streakDays: 142,
      lastActiveDate: new Date().toISOString().slice(0, 10)
    },
    completedTopics: ['arrays', 'linked-list', 'stacks-queues'],
    solvedProblems: [
      { id: 'two-sum', topic: 'arrays', diff: 'easy', time: '12m', date: '2026-08-10' },
      { id: 'reverse-ll', topic: 'linked-list', diff: 'easy', time: '15m', date: '2026-08-11' },
      { id: 'valid-parens', topic: 'stacks-queues', diff: 'easy', time: '10m', date: '2026-08-12' },
      { id: '3sum', topic: 'arrays', diff: 'medium', time: '35m', date: '2026-08-13' },
      { id: 'lru-cache', topic: 'linked-list', diff: 'medium', time: '40m', date: '2026-08-14' },
      { id: 'search-rotated', topic: 'binary-search', diff: 'medium', time: '28m', date: '2026-08-15' }
    ],
    coreCSProgress: {
      cpp: 85,
      dbms: 64,
      os: 48,
      cn: 35,
      systemDesign: 42
    },
    devProgress: {
      beginner: 100,
      intermediate: 75,
      advanced: 30
    },
    projectProgress: {
      p1: 100,
      p2: 100,
      p3: 60,
      p4: 10
    },
    interviewProgress: 51,
    dailyMissions: [
      { id: 'm1', text: 'Solve 3 Dynamic Programming problems', duration: '60 min', completed: false, category: 'dsa' },
      { id: 'm2', text: 'Review DBMS ACID Properties & 2PC', duration: '30 min', completed: true, category: 'corecs' },
      { id: 'm3', text: 'Implement Redis Caching in Project', duration: '45 min', completed: false, category: 'dev' },
      { id: 'm4', text: 'Mock Behavioral Question: STAR story', duration: '15 min', completed: true, category: 'interview' }
    ],
    notes: {}
  };

  let state = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultState, ...JSON.parse(saved) } : { ...defaultState };
    } catch (e) {
      console.warn('Failed to parse Career OS state:', e);
      return { ...defaultState };
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save Career OS state:', e);
    }
  }

  // -------------------------------------------------------------
  // 2. Career Track Directions (Capability-Driven)
  // -------------------------------------------------------------
  const TARGET_PROFILES = {
    'track-product': {
      label: 'Product Engineering',
      title: 'Product & High-Scale Systems',
      focus: 'High-scale web applications, performance optimization, clean architecture, and systems design',
      minProblems: 300,
      recommendedTopics: ['arrays', 'strings', 'linked-list', 'trees', 'dp', 'distributed-systems']
    },
    'track-systems': {
      label: 'Systems Engineering',
      title: 'Operating Systems & Low-Level Infrastructure',
      focus: 'Low-level OS internals, concurrency models, C++/Rust, and kernel memory structures',
      minProblems: 250,
      recommendedTopics: ['cpp', 'os', 'concurrency', 'memory-models', 'networks', 'raft']
    },
    'track-backend': {
      label: 'Backend & Distributed',
      title: 'High-Throughput Distributed Systems',
      focus: 'Distributed microservices, database transactions, caching, and message queues',
      minProblems: 300,
      recommendedTopics: ['dbms', 'sql', 'redis', 'kafka', 'system-design', 'microservices']
    },
    'track-aiml': {
      label: 'AI / ML Engineering',
      title: 'Machine Learning & Vector Architecture',
      focus: 'Vector indexing, RAG systems, model inference pipelines, and algorithmic math',
      minProblems: 280,
      recommendedTopics: ['python', 'linear-algebra', 'vector-dbs', 'fastapi', 'rag-eval']
    }
  };

  // -------------------------------------------------------------
  // 3. Measured Engineering Readiness Engine
  // -------------------------------------------------------------
  function calculateReadiness() {
    const dsaScore = 82; // Problem Solving
    const cppScore = 91; // Programming
    const corecsScore = 64; // Core CS
    const devScore = 76; // Development
    const projectScore = 70; // Projects
    const sysScore = 42; // Systems & Architecture
    const commScore = 68; // Communication & STAR
    const interviewScore = 51; // Interview Readiness

    const breakdown = [
      { id: 'dsa', label: 'Problem Solving & DSA', score: dsaScore, weight: 0.25 },
      { id: 'cpp', label: 'Programming & Memory', score: cppScore, weight: 0.15 },
      { id: 'dbms', label: 'Core CS (OS/DBMS/CN)', score: corecsScore, weight: 0.15 },
      { id: 'dev', label: 'Software Development', score: devScore, weight: 0.15 },
      { id: 'projects', label: 'Real Projects & Portfolio', score: projectScore, weight: 0.15 },
      { id: 'sys', label: 'Systems & Architecture', score: sysScore, weight: 0.05 },
      { id: 'comm', label: 'Communication & STAR', score: commScore, weight: 0.05 },
      { id: 'interview', label: 'Interview Practice', score: interviewScore, weight: 0.05 }
    ];

    let totalWeighted = 0;
    breakdown.forEach(item => {
      totalWeighted += item.score * item.weight;
    });

    const overallScore = Math.round(totalWeighted);

    const sorted = [...breakdown].sort((a, b) => a.score - b.score);
    const weakest = sorted[0];

    return {
      overallScore,
      breakdown,
      weakest
    };
  }

  // -------------------------------------------------------------
  // 4. "What Should I Learn Next?" Intelligence Engine
  // -------------------------------------------------------------
  function getSmartRecommendation() {
    const readiness = calculateReadiness();
    const completed = state.completedTopics;

    if (!completed.includes('arrays')) {
      return {
        topic: 'Arrays & Two Pointers',
        reason: 'Foundation of all contiguous data structures and sliding window techniques.',
        action: 'OPEN ARRAY SPEC →',
        moduleUrl: 'dsa/arrays.html',
        category: 'dsa'
      };
    }
    if (!completed.includes('binary-search')) {
      return {
        topic: 'Binary Search Mastery',
        reason: 'Halves the search space from O(N) to O(log N). Critical for search on answer spaces.',
        action: 'OPEN SEARCH SPEC →',
        moduleUrl: 'dsa/binary-search.html',
        category: 'dsa'
      };
    }
    if (!completed.includes('sorting')) {
      return {
        topic: 'Sorting & Divide and Conquer',
        reason: 'Understanding QuickSort and MergeSort invariants unlocks advanced recursion.',
        action: 'OPEN SORTING SPEC →',
        moduleUrl: 'dsa/sorting.html',
        category: 'dsa'
      };
    }
    if (readiness.weakest.id === 'sys') {
      return {
        topic: 'Systems: Concurrency & Distributed Architecture',
        reason: 'Identified primary growth area (42% mastery). Critical for high-scale engineering rounds.',
        action: 'LAUNCH SYSTEMS SPEC →',
        sectionId: 'corecs',
        category: 'corecs'
      };
    }

    return {
      topic: 'Dynamic Programming: 1D & 2D Memoization',
      reason: 'Key algorithmic differentiator. Overcome optimal substructure and state transition hurdles.',
      action: 'BEGIN 45M SESSION →',
      sectionId: 'dsa',
      category: 'dsa'
    };
  }

  // -------------------------------------------------------------
  // 5. DOM Initialization & View Controller
  // -------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigationRouting();
    initDashboardUI();
    initRoadmapFlow();
    initDSAPractice();
    initCoreCS();
    initProjectTiers();
    initAIMentor();
    initCommandPalette();
    initFocusMode();
    initHeatmap();
    initGlobalListeners();
  });

  // Theme Management
  function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.innerHTML = state.theme === 'dark' ? '◐' : '◑';
      themeBtn.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', state.theme);
        themeBtn.innerHTML = state.theme === 'dark' ? '◐' : '◑';
        saveState();
        showToast(`Switched to ${state.theme} mode`, 'info');
      });
    }
  }

  // Navigation & Hash Routing
  function initNavigationRouting() {
    const navItems = document.querySelectorAll('.sidebar-nav-item[data-view]');
    const viewSections = document.querySelectorAll('.os-view-section');

    function switchView(viewName) {
      if (!viewName) viewName = 'overview';
      
      navItems.forEach(item => {
        if (item.getAttribute('data-view') === viewName) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      viewSections.forEach(section => {
        if (section.id === `view-${viewName}`) {
          section.classList.add('active-view');
        } else {
          section.classList.remove('active-view');
        }
      });

      window.location.hash = viewName;
      window.scrollTo(0, 0);
    }

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const view = item.getAttribute('data-view');
        switchView(view);
      });
    });

    const initialHash = window.location.hash.replace('#', '') || 'overview';
    switchView(initialHash);

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '') || 'overview';
      switchView(hash);
    });
  }

  // -------------------------------------------------------------
  // 6. Dashboard & Metric Renderers
  // -------------------------------------------------------------
  function initDashboardUI() {
    renderPlacementReadiness();
    renderSmartRecommendation();
    renderDailyMissions();
    renderCareerTargetPill();
  }

  function renderCareerTargetPill() {
    const targetPill = document.getElementById('header-target-pill');
    const target = TARGET_PROFILES[state.careerTarget] || TARGET_PROFILES['track-product'];
    if (targetPill) {
      targetPill.innerHTML = `<span class="indicator-dot"></span> TRACK: ${target.label.toUpperCase()}`;
    }
  }

  function renderPlacementReadiness() {
    const readiness = calculateReadiness();
    
    // Overall Big Score
    const overallScoreElem = document.getElementById('stat-readiness-num');
    if (overallScoreElem) {
      overallScoreElem.textContent = readiness.overallScore;
    }

    // Telemetry Breakdown
    const barListElem = document.getElementById('readiness-bars-container');
    if (barListElem) {
      barListElem.innerHTML = readiness.breakdown.map(item => {
        const fillClass = item.score >= 75 ? 'high' : (item.score >= 50 ? 'active' : 'low');
        return `
          <div class="telemetry-row">
            <div class="telemetry-labels">
              <span>${item.label}</span>
              <span style="color:${item.score >= 70 ? 'var(--status-completed)' : (item.score >= 50 ? 'var(--accent)' : 'var(--status-danger)')}; font-weight:600;">${item.score}%</span>
            </div>
            <div class="telemetry-track">
              <div class="telemetry-fill ${fillClass}" style="width: ${item.score}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Weakness Diagnosis
    const weakElem = document.getElementById('weakness-diagnosis-container');
    if (weakElem) {
      const w = readiness.weakest;
      let prescription = 'Master Caching Invariants (Redis Cache-Aside) → Distributed Consensus (Raft) → Low-Level Concurrency & Mutex Locks.';
      let items = ['01 Concurrency & Mutex Invariants', '02 Distributed Cache & Invalidation', '03 Database Sharding & Consistent Hashing', '04 Message Brokers & Event Streams'];

      weakElem.innerHTML = `
        <div class="diagnostic-spec-box">
          <div class="spec-header">DIAGNOSTIC SPECIFICATION #01</div>
          <div class="spec-title">${w.label.toUpperCase()} (${w.score}% MASTERY)</div>
          <div class="spec-body" style="margin-bottom:0.75rem;">${prescription}</div>
          <div style="font-size:0.75rem; color:var(--text-dim); margin-bottom:0.4rem;">RECOMMENDED SYLLABUS:</div>
          <ul style="padding-left:1.2rem; font-size:0.8rem; color:var(--text-main); display:flex; flex-direction:column; gap:0.25rem;">
            ${items.map(it => `<li>${it}</li>`).join('')}
          </ul>
        </div>
      `;
    }
  }

  function renderSmartRecommendation() {
    const rec = getSmartRecommendation();
    const container = document.getElementById('smart-recommendation-card');
    if (!container) return;

    container.innerHTML = `
      <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent); margin-bottom:0.35rem;">RECOMMENDED DIRECTIVE:</div>
      <h3 style="font-size:1.2rem; margin-bottom:0.35rem; color:var(--text-main);">${rec.topic}</h3>
      <p style="font-size:0.85rem; color:var(--text-body); margin-bottom:1rem;">${rec.reason}</p>
      <button id="start-smart-session-btn" class="btn-tech btn-tech-primary" style="width:100%; padding:0.6rem;">
        ${rec.action}
      </button>
    `;

    const btn = document.getElementById('start-smart-session-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        if (rec.moduleUrl) {
          window.location.href = rec.moduleUrl;
        } else {
          openFocusMode(rec.topic);
        }
      });
    }
  }

  function renderDailyMissions() {
    const container = document.getElementById('daily-mission-list');
    const headerTime = document.getElementById('mission-header-time');
    if (!container) return;

    const total = state.dailyMissions.length;
    const completedCount = state.dailyMissions.filter(m => m.completed).length;
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    if (headerTime) {
      headerTime.textContent = `${completedCount}/${total} COMPLETED (${percentage}%)`;
    }

    container.innerHTML = state.dailyMissions.map((m, idx) => `
      <div class="problem-row-item" style="${m.completed ? 'opacity:0.6; text-decoration:line-through;' : ''}">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <input type="checkbox" ${m.completed ? 'checked' : ''} data-index="${idx}" class="mission-chk" style="cursor:pointer;">
          <span style="color:var(--text-main); font-weight:500;">${m.text}</span>
        </div>
        <span class="tag-tech">${m.duration}</span>
      </div>
    `).join('');

    container.querySelectorAll('.mission-chk').forEach(box => {
      box.addEventListener('change', () => {
        const idx = parseInt(box.getAttribute('data-index'), 10);
        state.dailyMissions[idx].completed = box.checked;
        saveState();
        renderDailyMissions();
        renderPlacementReadiness();
        showToast(box.checked ? 'Mission checkpoint recorded' : 'Mission updated', 'info');
      });
    });
  }

  // -------------------------------------------------------------
  // 7. Interactive CSE Roadmap Graph
  // -------------------------------------------------------------
  const ROADMAP_NODES = [
    {
      id: 'node-cpp',
      num: '01',
      title: 'PROGRAMMING & MEMORY FUNDAMENTALS',
      desc: 'Pointers, Dynamic Allocation, Move Semantics, RAII, STL Internals.',
      time: '3–4 WEEKS',
      difficulty: 'FOUNDATION',
      completed: true,
      status: 'MASTERED'
    },
    {
      id: 'node-dsa',
      num: '02',
      title: 'PROBLEM SOLVING & ALGORITHMS',
      desc: 'Arrays, Linked Lists, Stacks/Queues, Binary Search, Trees, Graphs, DP.',
      time: '12–16 WEEKS',
      difficulty: 'CORE SDE',
      completed: false,
      current: true,
      status: 'ACTIVE FOCUS'
    },
    {
      id: 'node-corecs',
      num: '03',
      title: 'CORE CS (DBMS · OS · CN)',
      desc: 'ACID transactions, Process scheduling, Virtual memory, TCP/IP sockets, DNS & HTTP.',
      time: '6–8 WEEKS',
      difficulty: 'SYSTEMS',
      completed: false,
      status: 'IN PROGRESS'
    },
    {
      id: 'node-dev',
      num: '04',
      title: 'SOFTWARE DEVELOPMENT',
      desc: 'TypeScript, React, REST/gRPC APIs, PostgreSQL, Redis Caching, Docker.',
      time: '8–10 WEEKS',
      difficulty: 'BUILD',
      completed: false,
      status: 'NEXT UP'
    },
    {
      id: 'node-projects',
      num: '05',
      title: 'REAL SYSTEMS & PORTFOLIO PROJECTS',
      desc: 'Distributed event stream, Real-time collaborative workspace, or AI agent platform.',
      time: '6–8 WEEKS',
      difficulty: 'ENGINEER',
      completed: false,
      status: 'LOCKED'
    },
    {
      id: 'node-interview',
      num: '06',
      title: 'INTERVIEW READINESS & MOCK SESSIONS',
      desc: 'Live coding rounds, System design tradeoffs, Behavioral STAR communication.',
      time: '4 WEEKS',
      difficulty: 'INTERVIEW READY',
      completed: false,
      status: 'LOCKED'
    }
  ];

  function initRoadmapFlow() {
    const container = document.getElementById('roadmap-flow-wrapper');
    if (!container) return;

    container.innerHTML = ROADMAP_NODES.map((node, i) => {
      const isLast = i === ROADMAP_NODES.length - 1;
      const nodeClass = node.completed ? 'completed' : (node.current ? 'current' : '');

      return `
        <div class="blueprint-node ${nodeClass}" data-node-id="${node.id}">
          <div>
            <div class="font-mono" style="font-size:0.75rem; color:${node.completed ? 'var(--status-completed)' : (node.current ? 'var(--accent)' : 'var(--text-dim)')}; margin-bottom:0.25rem;">
              NODE ${node.num} · ${node.status}
            </div>
            <h4 style="font-size:1.15rem; color:var(--text-main); margin-bottom:0.35rem;">${node.title}</h4>
            <p style="font-size:0.85rem; color:var(--text-muted); font-family:var(--font-mono);">${node.desc}</p>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.4rem;">
            <span class="tag-tech">${node.time}</span>
            <button class="btn-tech btn-tech-secondary" style="font-size:0.75rem;">SPEC →</button>
          </div>
        </div>
        ${!isLast ? '<div class="schematic-wire"></div>' : ''}
      `;
    }).join('');

    container.querySelectorAll('.blueprint-node').forEach(elem => {
      elem.addEventListener('click', () => {
        const nodeId = elem.getAttribute('data-node-id');
        const node = ROADMAP_NODES.find(n => n.id === nodeId);
        openNodeModal(node);
      });
    });
  }

  function openNodeModal(node) {
    if (!node) return;
    const modal = document.getElementById('node-modal-backdrop');
    const content = document.getElementById('node-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--hairline); padding-bottom:0.5rem;">
        <span class="tag-tech">SPECIFICATION: NODE ${node.num}</span>
        <button id="close-node-modal-btn" class="font-mono" style="color:var(--text-muted);">[ ESC ]</button>
      </div>
      <h2 style="font-size:1.5rem; margin-bottom:0.5rem; color:var(--text-main);">${node.title}</h2>
      <p style="color:var(--text-body); font-family:var(--font-mono); font-size:0.9rem; margin-bottom:1.25rem;">${node.desc}</p>
      
      <div class="diagnostic-spec-box" style="margin-bottom:1.5rem;">
        <div class="spec-header">REQUIRED CAPABILITIES</div>
        <ul style="padding-left:1.2rem; font-size:0.85rem; color:var(--text-main); display:flex; flex-direction:column; gap:0.35rem;">
          <li>Master core concepts & memory invariants</li>
          <li>Implement 25+ standard algorithmic patterns</li>
          <li>Construct 1 functional project demo</li>
          <li>Pass capability benchmark assessment</li>
        </ul>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:0.75rem; flex-wrap:wrap;">
        ${node.id === 'node-dsa' ? `<a href="dsa/roadmap.html" target="_blank" rel="noopener noreferrer" class="btn-tech btn-tech-secondary" style="text-decoration:none;">🗺️ 12-STAGE ROADMAP ↗</a>` : ''}
        <button id="node-modal-action-btn" class="btn-tech btn-tech-primary">OPEN SPEC HUB →</button>
      </div>
    `;

    modal.classList.add('open');

    document.getElementById('close-node-modal-btn').addEventListener('click', () => {
      modal.classList.remove('open');
    });

    document.getElementById('node-modal-action-btn').addEventListener('click', () => {
      modal.classList.remove('open');
      if (node.id === 'node-dsa') {
        window.location.hash = 'dsa';
      } else if (node.id === 'node-corecs') {
        window.location.hash = 'corecs';
      } else if (node.id === 'node-dev') {
        window.location.hash = 'dev';
      } else if (node.id === 'node-projects') {
        window.location.hash = 'projects';
      } else if (node.id === 'node-interview') {
        window.location.hash = 'companies';
      } else {
        window.location.hash = 'overview';
      }
    });
  }

  // -------------------------------------------------------------
  // 8. DSA Analytics & Practice System
  // -------------------------------------------------------------
  const DSA_PROBLEMS = [
    { id: 'two-sum', title: 'Two Sum (Hash Map Lookup)', topic: 'arrays', diff: 'easy', time: 'O(N)', space: 'O(N)', visualizerUrl: 'dsa/arrays.html', solved: true },
    { id: '3sum', title: '3Sum (Two Pointers on Sorted Array)', topic: 'arrays', diff: 'medium', time: 'O(N²)', space: 'O(1)', visualizerUrl: 'dsa/arrays.html', solved: true },
    { id: 'container-water', title: 'Container With Most Water', topic: 'arrays', diff: 'medium', time: 'O(N)', space: 'O(1)', visualizerUrl: 'dsa/arrays.html', solved: false },
    { id: 'reverse-ll', title: 'Reverse Linked List (Iterative & Recursive)', topic: 'linked-list', diff: 'easy', time: 'O(N)', space: 'O(1)', visualizerUrl: 'dsa/linked-list.html', solved: true },
    { id: 'lru-cache', title: 'LRU Cache Design (Doubly LL + Map)', topic: 'linked-list', diff: 'medium', time: 'O(1)', space: 'O(Capacity)', visualizerUrl: 'dsa/linked-list.html', solved: true },
    { id: 'valid-parens', title: 'Valid Parentheses (LIFO Matching)', topic: 'stacks-queues', diff: 'easy', time: 'O(N)', space: 'O(N)', visualizerUrl: 'dsa/stacks-queues.html', solved: true },
    { id: 'min-stack', title: 'Min Stack with O(1) Retrieve', topic: 'stacks-queues', diff: 'medium', time: 'O(1)', space: 'O(N)', visualizerUrl: 'dsa/stacks-queues.html', solved: false },
    { id: 'binary-search-base', title: 'Binary Search in Sorted Array', topic: 'binary-search', diff: 'easy', time: 'O(log N)', space: 'O(1)', visualizerUrl: 'dsa/binary-search.html', solved: true },
    { id: 'search-rotated', title: 'Search in Rotated Sorted Array', topic: 'binary-search', diff: 'medium', time: 'O(log N)', space: 'O(1)', visualizerUrl: 'dsa/binary-search.html', solved: true },
    { id: 'bubble-sort', title: 'Bubble Sort Invariant & Comparisons', topic: 'sorting', diff: 'easy', time: 'O(N²)', space: 'O(1)', visualizerUrl: 'dsa/sorting.html', solved: true },
    { id: 'inversion-count', title: 'Inversion Count via Merge Sort', topic: 'sorting', diff: 'medium', time: 'O(N log N)', space: 'O(N)', visualizerUrl: 'dsa/sorting.html', solved: false },
    { id: 'max-subarray', title: 'Maximum Subarray (Kadane\'s Algorithm)', topic: 'dp', diff: 'medium', time: 'O(N)', space: 'O(1)', solved: false },
    { id: 'coin-change', title: 'Coin Change (Unbounded Knapsack DP)', topic: 'dp', diff: 'medium', time: 'O(N*Amount)', space: 'O(Amount)', solved: false },
    { id: 'number-of-islands', title: 'Number of Islands (Grid BFS/DFS)', topic: 'graphs', diff: 'medium', time: 'O(M*N)', space: 'O(M*N)', solved: false },
    { id: 'course-schedule', title: 'Course Schedule (Topological Sort / Kahn)', topic: 'graphs', diff: 'medium', time: 'O(V+E)', space: 'O(V+E)', solved: false }
  ];

  function initDSAPractice() {
    renderDSARings();
    renderDSAProblems('all');

    const filterBtns = document.querySelectorAll('.dsa-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        renderDSAProblems(filter);
      });
    });
  }

  function renderDSARings() {
    const container = document.getElementById('dsa-rings-wrapper');
    if (!container) return;

    const topics = [
      { name: 'ARRAYS', pct: 92 },
      { name: 'STRINGS', pct: 87 },
      { name: 'LINKED LISTS', pct: 84 },
      { name: 'TREES', pct: 76 },
      { name: 'GRAPHS', pct: 54 },
      { name: 'DYNAMIC PROG', pct: 41 }
    ];

    container.innerHTML = topics.map(t => {
      const barsCount = Math.round(t.pct / 8);
      const asciiBar = '█'.repeat(barsCount) + '░'.repeat(12 - barsCount);
      return `
        <div class="ascii-bar-row">
          <span style="width:130px;">${t.name}</span>
          <span style="color:var(--accent);">${asciiBar}</span>
          <span style="font-weight:700; color:var(--text-main); width:40px; text-align:right;">${t.pct}%</span>
        </div>
      `;
    }).join('');
  }

  function renderDSAProblems(filter) {
    const listElem = document.getElementById('dsa-problems-list');
    if (!listElem) return;

    const filtered = DSA_PROBLEMS.filter(p => {
      if (filter === 'all') return true;
      if (filter === 'easy' || filter === 'medium' || filter === 'hard') return p.diff === filter;
      if (filter === 'solved') return p.solved;
      return p.topic === filter;
    });

    listElem.innerHTML = filtered.map(p => `
      <div class="problem-row-item">
        <div style="display:flex; align-items:center; gap:0.85rem;">
          <input type="checkbox" ${p.solved ? 'checked' : ''} onclick="window.CareerOS.toggleProblemSolved('${p.id}')" style="cursor:pointer;">
          <div>
            <div style="color:var(--text-main); font-weight:600;">${p.title}</div>
            <div style="display:flex; gap:0.5rem; align-items:center; margin-top:0.2rem; font-size:0.75rem; color:var(--text-dim);">
              <span class="tag-tech">${p.diff.toUpperCase()}</span>
              <span>TIME: ${p.time}</span>
              <span>SPACE: ${p.space}</span>
            </div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          ${p.visualizerUrl ? `<a href="${p.visualizerUrl}" class="btn-tech btn-tech-secondary" style="font-size:0.75rem;">VISUALIZE</a>` : ''}
          <button class="btn-tech btn-tech-primary" style="font-size:0.75rem;" onclick="window.CareerOS.launchProblemFocus('${p.id}')">
            FOCUS →
          </button>
        </div>
      </div>
    `).join('');
  }

  // -------------------------------------------------------------
  // 9. Core CS Q&A Hub
  // -------------------------------------------------------------
  const CORE_CS_DATA = {
    cpp: [
      { q: 'What is the exact difference between Virtual Destructor and normal destructor?', a: 'If a base class pointer deletes a derived class instance without a virtual destructor, only the Base destructor executes, causing a derived memory leak. A virtual destructor ensures the derived destructor runs first followed by the base.' },
      { q: 'Explain RAII (Resource Acquisition Is Initialization) with unique_ptr.', a: 'RAII binds resource lifecycle to object lifetime. std::unique_ptr acquires memory on construction and automatically deletes it when going out of scope, preventing memory leaks even during exceptions.' },
      { q: 'How does std::vector handle dynamic resizing and amortized complexity?', a: 'When capacity is full, vector allocates 2x new contiguous memory, moves/copies old elements (O(N)), and frees old memory. Over N insertions, total copies = N, yielding Amortized O(1) insertion time.' }
    ],
    dbms: [
      { q: 'Explain ACID properties with practical banking transaction example.', a: 'Atomicity: Money deducts from A AND adds to B or neither. Consistency: Total bank balance remains invariant. Isolation: Concurrent transactions do not read uncommitted writes (phantom reads prevented). Durability: Once committed to WAL, power loss cannot erase changes.' },
      { q: 'How does B+ Tree indexing differ from B Tree in relational databases?', a: 'In B+ Trees, data pointers reside strictly in leaf nodes which are linked sequentially, enabling ultra-fast range queries (e.g. BETWEEN 10 AND 50) and higher node fan-out compared to standard B-Trees.' }
    ],
    os: [
      { q: 'What are the 4 necessary conditions for Deadlock to occur?', a: '1. Mutual Exclusion (non-shareable resource), 2. Hold and Wait, 3. No Preemption (resource cannot be forcibly confiscated), 4. Circular Wait.' },
      { q: 'How does Virtual Memory with TLB (Translation Lookaside Buffer) work?', a: 'Virtual address = Page Number + Offset. CPU checks TLB cache (1 cycle). On TLB Hit: Physical Frame + Offset. On TLB Miss: Multi-level page table walk in RAM (100 cycles) and TLB update.' }
    ],
    cn: [
      { q: 'Walk through TCP 3-Way Handshake & 4-Way Teardown sequence.', a: 'Handshake: 1. Client sends SYN (seq=x), 2. Server responds SYN-ACK (seq=y, ack=x+1), 3. Client sends ACK (ack=y+1). Teardown: FIN → ACK → FIN → ACK with TIME_WAIT.' },
      { q: 'What is the difference between HTTP/1.1 Pipeling and HTTP/2 Multiplexing?', a: 'HTTP/1.1 suffered from Head-of-Line blocking over 1 TCP connection. HTTP/2 introduces binary framing and independent bidirectional streams over a single TCP connection.' }
    ],
    systemDesign: [
      { q: 'Explain CAP Theorem tradeoffs in distributed storage.', a: 'Consistency, Availability, Partition Tolerance. Under network partition (P), you MUST choose either Consistency (CP, reject writes to prevent stale data) or Availability (AP, accept writes at risk of stale reads).' },
      { q: 'How does Consistent Hashing minimize data migration during cluster resharding?', a: 'Consistent Hashing places nodes and keys on a virtual ring (0 to 2^32 - 1). Adding/removing a node only redistributes K/N keys rather than all keys as in traditional modulo hashing.' }
    ]
  };

  function initCoreCS() {
    renderCoreCSQuestions('cpp');
    const tabs = document.querySelectorAll('.corecs-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const subject = tab.getAttribute('data-subject');
        renderCoreCSQuestions(subject);
      });
    });
  }

  function renderCoreCSQuestions(subject) {
    const container = document.getElementById('corecs-cards-container');
    if (!container) return;

    const list = CORE_CS_DATA[subject] || CORE_CS_DATA.cpp;
    container.innerHTML = list.map((item, idx) => `
      <div class="technical-panel">
        <div class="font-mono" style="font-size:0.75rem; color:var(--accent); margin-bottom:0.5rem;">QUESTION #${idx + 1}</div>
        <h4 style="font-size:1.1rem; color:var(--text-main); margin-bottom:0.75rem;">${item.q}</h4>
        <div id="qa-ans-${subject}-${idx}" class="qa-answer" style="border:1px solid var(--hairline-strong); background:var(--bg-subtle); padding:0.85rem; font-family:var(--font-mono); font-size:0.85rem; margin-top:0.75rem;">
          ${item.a}
        </div>
        <button class="btn-tech btn-tech-secondary" style="margin-top:0.75rem;" onclick="window.CareerOS.toggleAnswer('qa-ans-${subject}-${idx}', this)">
          REVEAL TECHNICAL SPEC
        </button>
      </div>
    `).join('');
  }

  // -------------------------------------------------------------
  // 10. Project System Tiers
  // -------------------------------------------------------------
  const PROJECTS_DATA = {
    tier1: [
      { num: '01', title: 'Interactive Algorithmic Visualizer', tech: 'VANILLA JS · CANVAS API · CSS3', desc: 'Real-time step-by-step visual engine demonstrating memory contiguous operations, pointers, and sorting.', bullets: ['Implemented state machines for step playback and dynamic animation loops', 'Optimized DOM re-renders using Canvas batch rendering'] },
      { num: '02', title: 'Real-time Expense & Budget Tracker', tech: 'REACT · TYPESCRIPT · LOCALSTORAGE', desc: 'Financial transaction dashboard with category budgets and interactive charts.', bullets: ['Custom React hooks for offline synchronization', 'Calculated category variances with instant data visualization'] }
    ],
    tier2: [
      { num: '01', title: 'High-Throughput Collaborative Chat App', tech: 'NODE.JS · WEBSOCKETS · REDIS · POSTGRESQL', desc: 'Real-time multi-room messaging platform with persistent history and typing presence.', bullets: ['Engineered Redis Pub/Sub backplane for horizontal websocket server scaling', 'Optimized message pagination query response times down to <15ms'] },
      { num: '02', title: 'E-Commerce Platform with Stripe Checkout', tech: 'NEXT.JS · PRISMA · POSTGRESQL · STRIPE', desc: 'Full-stack store with atomic inventory deduction and webhook idempotent processing.', bullets: ['Handled race conditions during checkout using database transactions with row-level locks'] }
    ],
    tier3: [
      { num: '01', title: 'Distributed Task Queue & Job Scheduler', tech: 'GO / NODE · REDIS · DOCKER · PROMETHEUS', desc: 'Reliable background worker queue with exponential backoff, dead-letter queues, and telemetry.', bullets: ['Built custom rate limiting and sliding window token bucket algorithm', 'Monitored queue latency with custom Prometheus metrics exported to Grafana'] },
      { num: '02', title: 'AI-Powered Documentation & RAG Search', tech: 'FASTAPI · LANGCHAIN · PGVECTOR · OPENAI', desc: 'Semantic search engine performing vector embeddings and contextual grounded retrieval.', bullets: ['Engineered chunking strategies and hybrid BM25 + dense vector ranking', 'Reduced query hallucination by 80% using reciprocal rank fusion'] }
    ],
    tier4: [
      { num: '01', title: 'Distributed Log-Structured Storage Engine', tech: 'C++20 / RUST · RAFT CONSENSUS · LSM TREE', desc: 'High-performance key-value database using write-ahead logs, memtables, and SSTables with bloom filters.', bullets: ['Implemented Raft leader election and log replication from scratch', 'Benchmarked throughput at 120,000 writes/sec with sub-millisecond p99 latency'] }
    ]
  };

  function initProjectTiers() {
    renderProjects('tier3');
    const tierBtns = document.querySelectorAll('.project-tier-tab-btn');
    tierBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tierBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tier = btn.getAttribute('data-tier');
        renderProjects(tier);
      });
    });
  }

  function renderProjects(tier) {
    const container = document.getElementById('projects-grid-container');
    if (!container) return;

    const list = PROJECTS_DATA[tier] || PROJECTS_DATA.tier3;
    container.innerHTML = list.map(p => `
      <div class="technical-panel">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
          <div class="font-mono" style="font-size:0.75rem; color:var(--accent);">PROJECT SPEC ${p.num}</div>
          <span class="tag-tech">${p.tech}</span>
        </div>
        <h3 style="font-size:1.35rem; color:var(--text-main); margin-bottom:0.5rem;">${p.title}</h3>
        <p style="font-size:0.85rem; color:var(--text-muted); font-family:var(--font-mono); margin-bottom:1rem;">${p.desc}</p>
        
        <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent); margin-bottom:0.4rem;">RESUME IMPACT (GOOGLE FORMULA):</div>
        <ul style="padding-left:1.2rem; font-family:var(--font-mono); font-size:0.8rem; color:var(--text-body); display:flex; flex-direction:column; gap:0.35rem; margin-bottom:1.25rem;">
          ${p.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>

        <div style="display:flex; gap:0.5rem;">
          <button class="btn-tech btn-tech-primary" onclick="window.CareerOS.showProjectGuide('${p.title}')">ARCHITECTURE SPEC</button>
          <button class="btn-tech btn-tech-secondary" onclick="window.CareerOS.askMentorAboutProject('${p.title}')">ASK INTEL</button>
        </div>
      </div>
    `).join('');
  }

  // -------------------------------------------------------------
  // 11. AI Career Mentor Engine
  // -------------------------------------------------------------
  function initAIMentor() {
    const sendBtn = document.getElementById('mentor-send-btn');
    const inputField = document.getElementById('mentor-input');
    const promptChips = document.querySelectorAll('.prompt-chip');

    if (sendBtn && inputField) {
      sendBtn.addEventListener('click', () => handleUserMessage());
      inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleUserMessage();
      });
    }

    promptChips.forEach(chip => {
      chip.addEventListener('click', () => {
        if (inputField) {
          inputField.value = chip.textContent;
          handleUserMessage();
        }
      });
    });
  }

  function handleUserMessage() {
    const input = document.getElementById('mentor-input');
    const chatContainer = document.getElementById('mentor-chat-log');
    if (!input || !input.value.trim() || !chatContainer) return;

    const query = input.value.trim();
    input.value = '';

    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.style.cssText = 'align-self:flex-end; background:var(--bg-surface-elevated); border:1px solid var(--hairline-strong); padding:0.75rem 1rem; font-family:var(--font-mono); font-size:0.85rem; color:var(--text-main); margin-bottom:0.5rem;';
    userBubble.textContent = `> ${query}`;
    chatContainer.appendChild(userBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    setTimeout(() => {
      const response = generateAIResponse(query);
      const botBubble = document.createElement('div');
      botBubble.className = 'chat-bubble bot';
      botBubble.style.cssText = 'align-self:flex-start; background:var(--bg-subtle); border:1px solid var(--hairline-strong); padding:0.85rem 1rem; font-family:var(--font-mono); font-size:0.85rem; color:var(--text-body); margin-bottom:0.5rem; line-height:1.55;';
      botBubble.innerHTML = response;
      chatContainer.appendChild(botBubble);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 400);
  }

  function generateAIResponse(query) {
    const lower = query.toLowerCase();
    const readiness = calculateReadiness();

    if (lower.includes('weak') || lower.includes('behind') || lower.includes('network') || lower.includes('systems')) {
      return `✦ <strong>DIAGNOSTIC TELEMETRY SPECIFICATION</strong><br><br>Identified system growth area: <strong>${readiness.weakest.label}</strong> (${readiness.weakest.score}% Current Mastery).<br><br><strong>REMEDIATION SEQUENCE:</strong><br>01 Review Concurrency & Mutex invariant state machines<br>02 Understand Distributed Caching & Invalidation patterns<br>03 Implement a sample socket communication server.<br><br><button class="btn-tech btn-tech-primary" style="margin-top:0.5rem; font-size:0.75rem;" onclick="window.CareerOS.openFocusMode('${readiness.weakest.label} Remediation')">LAUNCH 45M SPRINT →</button>`;
    }
    if (lower.includes('dp') || lower.includes('dynamic programming')) {
      return `✦ <strong>SOCRATIC INVARIANT SPECIFICATION: DP</strong><br><br>1. <strong>State Definition:</strong> What subproblem does <code>dp[i][j]</code> solve uniquely?<br>2. <strong>Base Invariant:</strong> Explicit value for index 0 / empty set?<br>3. <strong>State Transition:</strong> How does <code>dp[i]</code> derive from <code>dp[i-1]</code> or <code>dp[i-2]</code>?<br>4. <strong>Memory Optimization:</strong> Can you eliminate array allocation down to O(1) registers?`;
    }
    if (lower.includes('quiz') || lower.includes('test')) {
      return `✦ <strong>TECHNICAL SPEC QUIZ: CONCURRENCY</strong><br><br><strong>Q:</strong> When two threads execute <code>counter++</code> 100,000 times without atomic synchronization, why is the final counter value strictly non-deterministic?<br><br><em>(Hint: Disassemble <code>counter++</code> into LOAD, ADD, and STORE assembly instructions).</em>`;
    }
    if (lower.includes('resume') || lower.includes('star') || lower.includes('project')) {
      return `✦ <strong>RESUME SPECIFICATION: GOOGLE FORMULA</strong><br><br><em>"Accomplished [X] as measured by [Y], by doing [Z]"</em><br><br><strong>Spec:</strong> "Architected a real-time messaging pipeline handling 10k+ concurrent websocket connections by leveraging Redis Pub/Sub, reducing message delivery latency to &lt;12ms."`;
    }

    return `✦ <strong>ENGINEERING MENTOR SPEC:</strong><br><br>Active telemetry indicates Day <strong>${state.userProfile.streakDays}</strong> of continuous execution. To maintain target trajectory toward <strong>${TARGET_PROFILES[state.careerTarget].label}</strong>, execute steady daily problem sets and core systems invariant depth.`;
  }

  // -------------------------------------------------------------
  // 12. Command Palette (⌘K) Controller
  // -------------------------------------------------------------
  const COMMAND_LIST = [
    { label: '01 GO TO OVERVIEW DASHBOARD', action: () => window.location.hash = 'overview' },
    { label: '02 OPEN SCHEMATIC BLUEPRINT', action: () => window.location.hash = 'roadmap' },
    { label: '03 DSA PRACTICE & TELEMETRY', action: () => window.location.hash = 'dsa' },
    { label: '🗺️ LAUNCH 12-STAGE C++ & DSA ROADMAP [NEW TAB]', action: () => window.open('dsa/roadmap.html', '_blank') },
    { label: '⚡ STAGE 02 · C++ STL SPECIFICATION [NEW TAB]', action: () => window.open('dsa/roadmap.html#stl', '_blank') },
    { label: '04 CORE SYSTEMS (DBMS, OS, CN)', action: () => window.location.hash = 'corecs' },
    { label: '05 DEVELOPMENT PROGRESSION', action: () => window.location.hash = 'dev' },
    { label: '06 PROJECT PORTFOLIO HUB', action: () => window.location.hash = 'projects' },
    { label: '07 COMPANY PREPARATION TRACKS', action: () => window.location.hash = 'companies' },
    { label: '08 INTEL CAREER MENTOR', action: () => window.location.hash = 'mentor' },
    { label: '⏱️ LAUNCH FOCUS MODE', action: () => openFocusMode('Deep Engineering Session') },
    { label: '◐ TOGGLE LIGHT / DARK THEME', action: () => document.getElementById('theme-toggle-btn').click() },
    { label: '🎯 SET TRACK: PRODUCT ENGINEERING', action: () => setCareerTarget('track-product') },
    { label: '🎯 SET TRACK: SYSTEMS ENGINEERING', action: () => setCareerTarget('track-systems') },
    { label: '🎯 SET TRACK: BACKEND & DISTRIBUTED', action: () => setCareerTarget('track-backend') },
    { label: '🎯 SET TRACK: AI / ML ENGINEERING', action: () => setCareerTarget('track-aiml') }
  ];

  function initCommandPalette() {
    const backdrop = document.getElementById('cmd-modal-backdrop');
    const input = document.getElementById('cmd-search-input');
    const trigger = document.getElementById('cmd-trigger-btn');
    const resultsContainer = document.getElementById('cmd-results-list');

    if (!backdrop || !input || !resultsContainer) return;

    function openPalette() {
      backdrop.classList.add('open');
      input.value = '';
      renderCmdResults('');
      input.focus();
    }

    function closePalette() {
      backdrop.classList.remove('open');
    }

    if (trigger) {
      trigger.addEventListener('click', openPalette);
    }

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        backdrop.classList.contains('open') ? closePalette() : openPalette();
      }
      if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        closePalette();
      }
    });

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closePalette();
    });

    input.addEventListener('input', (e) => {
      renderCmdResults(e.target.value.trim().toLowerCase());
    });

    function renderCmdResults(query) {
      const filtered = COMMAND_LIST.filter(c => c.label.toLowerCase().includes(query));
      resultsContainer.innerHTML = filtered.map((c, i) => `
        <div class="cmd-item ${i === 0 ? 'selected' : ''}" data-index="${i}">
          <span>${c.label}</span>
          <span class="kbd-shortcut">↵ EXEC</span>
        </div>
      `).join('');

      resultsContainer.querySelectorAll('.cmd-item').forEach((item, idx) => {
        item.addEventListener('click', () => {
          filtered[idx].action();
          closePalette();
        });
      });
    }
  }

  // -------------------------------------------------------------
  // 13. Distraction-Free Focus Mode
  // -------------------------------------------------------------
  let focusInterval = null;
  let remainingSeconds = 45 * 60;

  function initFocusMode() {
    const headerBtn = document.getElementById('focus-mode-header-btn');
    const overlay = document.getElementById('focus-mode-overlay');
    const closeBtn = document.getElementById('exit-focus-btn');
    const toggleTimerBtn = document.getElementById('focus-timer-toggle-btn');
    const resetTimerBtn = document.getElementById('focus-timer-reset-btn');

    if (headerBtn) {
      headerBtn.addEventListener('click', () => openFocusMode('Engineering Focus Session'));
    }

    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        clearInterval(focusInterval);
        focusInterval = null;
      });
    }

    if (toggleTimerBtn) {
      toggleTimerBtn.addEventListener('click', () => {
        if (focusInterval) {
          clearInterval(focusInterval);
          focusInterval = null;
          toggleTimerBtn.textContent = 'RESUME';
        } else {
          startFocusTimer();
          toggleTimerBtn.textContent = 'PAUSE';
        }
      });
    }

    if (resetTimerBtn) {
      resetTimerBtn.addEventListener('click', () => {
        clearInterval(focusInterval);
        focusInterval = null;
        remainingSeconds = 45 * 60;
        updateFocusTimerUI();
        if (toggleTimerBtn) toggleTimerBtn.textContent = 'START';
      });
    }
  }

  function openFocusMode(topicName) {
    const overlay = document.getElementById('focus-mode-overlay');
    const titleElem = document.getElementById('focus-topic-title');
    if (!overlay) return;

    if (titleElem) titleElem.textContent = topicName ? `FOCUS: ${topicName.toUpperCase()}` : 'ENGINEERING FOCUS SESSION';
    remainingSeconds = 45 * 60;
    updateFocusTimerUI();
    overlay.classList.add('active');
    startFocusTimer();
  }

  function startFocusTimer() {
    clearInterval(focusInterval);
    focusInterval = setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        updateFocusTimerUI();
      } else {
        clearInterval(focusInterval);
        focusInterval = null;
        showToast('Focus session completed. Logged to ledger.', 'success');
      }
    }, 1000);
  }

  function updateFocusTimerUI() {
    const timerElem = document.getElementById('focus-timer-display');
    if (!timerElem) return;
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    timerElem.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  // -------------------------------------------------------------
  // 14. 365-Day Activity Heatmap
  // -------------------------------------------------------------
  function initHeatmap() {
    const container = document.getElementById('activity-heatmap-grid');
    if (!container) return;

    let html = '';
    for (let col = 0; col < 52; col++) {
      for (let row = 0; row < 7; row++) {
        const rand = Math.random();
        let level = '';
        if (rand > 0.85) level = 'lvl-4';
        else if (rand > 0.65) level = 'lvl-3';
        else if (rand > 0.45) level = 'lvl-2';
        else if (rand > 0.25) level = 'lvl-1';
        html += `<div class="heatmap-cell ${level}" title="Week ${col + 1}, Day ${row + 1}"></div>`;
      }
    }
    container.innerHTML = html;
  }

  function setCareerTarget(targetKey) {
    if (TARGET_PROFILES[targetKey]) {
      state.careerTarget = targetKey;
      saveState();
      renderCareerTargetPill();
      renderPlacementReadiness();
      showToast(`Track direction updated to ${TARGET_PROFILES[targetKey].label}`, 'success');
    }
  }

  function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>[ SYS ] ${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }

  function initGlobalListeners() {
    const targetCards = document.querySelectorAll('.target-card[data-target-id]');
    targetCards.forEach(card => {
      card.addEventListener('click', () => {
        targetCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const targetId = card.getAttribute('data-target-id');
        setCareerTarget(targetId);
      });
    });

    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('open');
      });
      if (overlay) {
        overlay.addEventListener('click', () => {
          sidebar.classList.remove('open');
          overlay.classList.remove('open');
        });
      }
    }

    const searchInput = document.getElementById('sidebar-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const navItems = document.querySelectorAll('.sidebar-nav-item');
        navItems.forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(query) ? 'flex' : 'none';
        });
      });
    }

    const collapsibles = document.querySelectorAll('.collapsible-header');
    collapsibles.forEach(header => {
      header.addEventListener('click', () => {
        const card = header.closest('.collapsible-card');
        if (card) card.classList.toggle('open');
      });
    });

    const answerToggles = document.querySelectorAll('.toggle-answer-btn');
    answerToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const box = btn.closest('.question-box');
        if (box) {
          const answer = box.querySelector('.answer-content');
          if (answer) {
            const isShown = answer.classList.contains('show');
            answer.classList.toggle('show');
            btn.textContent = isShown ? 'Show Answer' : 'Hide Answer';
          }
        }
      });
    });

    const completeBtn = document.getElementById('mark-complete-btn');
    if (completeBtn) {
      const topicId = completeBtn.getAttribute('data-topic-id');
      if (state.completedTopics.includes(topicId)) {
        completeBtn.classList.add('active');
        completeBtn.innerHTML = '<span>✓ COMPLETED</span>';
      }
      completeBtn.addEventListener('click', () => {
        const isComp = state.completedTopics.includes(topicId);
        if (isComp) {
          state.completedTopics = state.completedTopics.filter(id => id !== topicId);
          completeBtn.classList.remove('active');
          completeBtn.innerHTML = '<span>MARK AS COMPLETE</span>';
          showToast('Topic marked as incomplete', 'info');
        } else {
          state.completedTopics.push(topicId);
          completeBtn.classList.add('active');
          completeBtn.innerHTML = '<span>✓ COMPLETED</span>';
          showToast('Topic marked as completed', 'success');
        }
        saveState();
      });
    }
  }

  // -------------------------------------------------------------
  // Public Interface
  // -------------------------------------------------------------
  return {
    toggleAnswer: function (elemId, btn) {
      const el = document.getElementById(elemId);
      if (el) {
        const isShown = el.classList.contains('show');
        el.classList.toggle('show');
        if (btn) btn.textContent = isShown ? 'REVEAL TECHNICAL SPEC' : 'HIDE TECHNICAL SPEC';
      }
    },
    toggleProblemSolved: function (problemId) {
      const p = DSA_PROBLEMS.find(item => item.id === problemId);
      if (p) {
        p.solved = !p.solved;
        renderPlacementReadiness();
        renderDSAProblems(document.querySelector('.dsa-filter-btn.active')?.getAttribute('data-filter') || 'all');
        showToast(p.solved ? `Problem marked: "${p.title}"` : `Problem unmarked`, 'info');
      }
    },
    launchProblemFocus: function (problemId) {
      const p = DSA_PROBLEMS.find(item => item.id === problemId);
      if (p) {
        openFocusMode(`${p.title} (${p.diff.toUpperCase()})`);
      }
    },
    openFocusMode: openFocusMode,
    askMentorAboutProject: function (projectTitle) {
      window.location.hash = 'mentor';
      const input = document.getElementById('mentor-input');
      if (input) {
        input.value = `Analyze architecture specification and STAR metrics for: ${projectTitle}`;
        handleUserMessage();
      }
    },
    showProjectGuide: function (title) {
      openFocusMode(`Architecture Spec: ${title}`);
    }
  };
})();
