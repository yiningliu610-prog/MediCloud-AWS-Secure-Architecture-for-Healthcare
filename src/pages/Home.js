import Typed from 'typed.js';
import * as echarts from 'echarts';
import { PILLARS, STATS, COLOR_MAP } from '../data/modules.js';
import { quizQuestions } from '../data/quiz-questions.js';
import { observeAndAnimate, staggerCards } from '../utils/animate.js';
import { showModal } from '../components/Modal.js';

export function renderHome(container) {
  container.innerHTML = `
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="security-grid absolute inset-0"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-slate-900"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            HIPAA-Compliant Cloud Architecture
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            <span class="bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">MediCloud</span>
            <br/>
            <span class="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent" id="typed-text"></span>
          </h1>
          <p class="text-lg text-slate-400 leading-relaxed mb-8 max-w-2xl">
            A comprehensive AWS cloud security architecture for healthcare data protection, featuring IAM, KMS, CloudTrail, CloudWatch, GuardDuty, Lambda auto-remediation, VPC network isolation, and OPA-based zero-trust access control.
          </p>
          <div class="flex flex-wrap gap-3">
            <a href="#/simulator" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30">
              Launch Threat Simulator
            </a>
            <a href="#/zero-trust" class="px-6 py-3 border border-slate-600 hover:border-slate-500 rounded-xl font-semibold transition-all hover:bg-slate-800">
              Try Zero Trust Playground
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="border-y border-slate-800 bg-slate-800/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          ${STATS.map(s => `
            <div class="text-center">
              <div class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">${s.value}</div>
              <div class="text-sm text-slate-500 mt-1">${s.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Four Pillars -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-14">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">Security Architecture</h2>
        <p class="text-slate-400 max-w-2xl mx-auto">Four integrated pillars protecting MediCloud's healthcare data across identity, encryption, network, and threat response layers.</p>
      </div>
      <div class="grid md:grid-cols-2 gap-6" id="pillars-grid">
        ${PILLARS.map(p => {
          const c = COLOR_MAP[p.color];
          return `
          <a href="${p.route}" class="card-hover block bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 group">
            <div class="flex items-start gap-5">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white shrink-0 shadow-lg">
                ${p.icon}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-semibold uppercase tracking-wider ${c.text} mb-1">${p.subtitle}</div>
                <h3 class="text-xl font-bold mb-2 group-hover:text-white transition-colors">${p.title}</h3>
                <p class="text-sm text-slate-400 leading-relaxed mb-4">${p.description}</p>
                <div class="flex flex-wrap gap-2">
                  ${p.stats.map(s => `<span class="px-2.5 py-1 text-xs rounded-lg bg-slate-700/50 ${c.text} border ${c.border}">${s}</span>`).join('')}
                </div>
              </div>
            </div>
          </a>`;
        }).join('')}
      </div>
    </section>

    <!-- Interactive Demos -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid md:grid-cols-2 gap-6">
        <a href="#/simulator" class="card-hover relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-indigo-900/40 to-slate-800 border border-indigo-500/20 group">
          <div class="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div class="relative">
            <div class="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">Interactive Demo</div>
            <h3 class="text-2xl font-bold mb-3">Threat Detection Simulator</h3>
            <p class="text-slate-400 text-sm leading-relaxed mb-4">Watch the automated threat response pipeline in action: GuardDuty detection, EventBridge routing, Lambda remediation, and S3 evidence archival.</p>
            <span class="inline-flex items-center gap-2 text-indigo-400 text-sm font-semibold group-hover:gap-3 transition-all">
              Launch Simulator <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </span>
          </div>
        </a>
        <a href="#/zero-trust" class="card-hover relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-pink-900/40 to-slate-800 border border-pink-500/20 group">
          <div class="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div class="relative">
            <div class="text-xs font-bold uppercase tracking-wider text-pink-400 mb-3">Interactive Demo</div>
            <h3 class="text-2xl font-bold mb-3">Zero Trust Playground</h3>
            <p class="text-slate-400 text-sm leading-relaxed mb-4">Toggle MFA, VPN, device trust, and geo-restrictions to see real-time risk scoring and access decisions based on OPA Rego policy.</p>
            <span class="inline-flex items-center gap-2 text-pink-400 text-sm font-semibold group-hover:gap-3 transition-all">
              Try Playground <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </span>
          </div>
        </a>
      </div>
    </section>

    <!-- MediCloud Overall Architecture -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-on-scroll">
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">AWS Cloud Architecture</div>
        <h2 class="text-3xl sm:text-4xl font-bold mb-3">MediCloud Overall Architecture</h2>
        <p class="text-slate-400 max-w-3xl mx-auto">End-to-end AWS security infrastructure: IAM, KMS, CloudTrail, CloudWatch, GuardDuty, SNS, Lambda, VPC, S3, and OPA Zero Trust — all integrated for HIPAA-compliant healthcare data protection.</p>
      </div>
      <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-4 overflow-hidden">
        <img src="/images/overall-architecture.jpg" alt="MediCloud Overall Architecture Diagram" class="w-full rounded-xl object-contain cursor-pointer hover:opacity-90 transition-opacity" id="overall-arch-img"/>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-6">
        ${['IAM', 'KMS', 'CloudTrail', 'CloudWatch', 'GuardDuty', 'Lambda', 'VPC', 'S3'].map(svc =>
          `<div class="bg-slate-800/50 rounded-lg p-2 text-center border border-slate-700/50">
            <span class="text-xs font-bold text-amber-400">${svc}</span>
          </div>`
        ).join('')}
      </div>
    </section>

    <!-- Architecture Diagrams -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-on-scroll">
      <h2 class="text-2xl font-bold mb-6 text-center">Detailed Architecture Diagrams</h2>
      <div class="flex gap-2 mb-6 justify-center flex-wrap" id="diagram-tabs">
        <button class="diagram-tab active px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white transition-all" data-img="/images/architecture/network-architecture.png">Network</button>
        <button class="diagram-tab px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all" data-img="/images/architecture/zero-trust-architecture.png">Zero Trust</button>
        <button class="diagram-tab px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all" data-img="/images/architecture/data-flow-diagram.png">Data Flow</button>
      </div>
      <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-4 overflow-hidden">
        <img id="diagram-display" src="/images/architecture/network-architecture.png" alt="Architecture diagram" class="w-full rounded-xl max-h-[500px] object-contain transition-opacity duration-300"/>
      </div>
    </section>

    <!-- Skills Radar -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-on-scroll">
      <div class="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 class="text-2xl font-bold mb-4">Technical Competencies</h2>
          <p class="text-slate-400 mb-6">Proficiency across seven cloud security domains, demonstrated through hands-on AWS implementations.</p>
          <div id="skills-chart" class="w-full h-80"></div>
        </div>
        <div>
          <h2 class="text-2xl font-bold mb-6">Quick Assessment</h2>
          <div id="quiz-content" class="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <p class="text-slate-400 mb-4">Test your cloud security knowledge with ${quizQuestions.length} questions.</p>
            <button id="start-quiz-btn" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all">
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    </section>
  `;

  // Typed.js
  const typed = new Typed('#typed-text', {
    strings: ['Security Architecture', 'Threat Response', 'Zero Trust', 'HIPAA Compliance'],
    typeSpeed: 60,
    backSpeed: 40,
    backDelay: 2000,
    loop: true,
  });

  // Pillar cards stagger
  staggerCards(container, '#pillars-grid > a');

  // Diagram tabs
  const tabs = container.querySelectorAll('.diagram-tab');
  const img = container.querySelector('#diagram-display');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('bg-blue-600', 'text-white', 'active'); t.classList.add('bg-slate-700', 'text-slate-300'); });
      tab.classList.remove('bg-slate-700', 'text-slate-300');
      tab.classList.add('bg-blue-600', 'text-white', 'active');
      img.style.opacity = '0';
      setTimeout(() => { img.src = tab.dataset.img; img.style.opacity = '1'; }, 200);
    });
  });

  // Overall architecture click → modal
  const overallImg = container.querySelector('#overall-arch-img');
  if (overallImg) {
    overallImg.addEventListener('click', () => {
      showModal({
        title: 'MediCloud Overall Architecture',
        body: `<img src="/images/overall-architecture.jpg" alt="MediCloud Overall Architecture" class="w-full rounded-lg"/>`,
        size: 'lg',
      });
    });
  }

  // Skills chart
  const chartEl = container.querySelector('#skills-chart');
  const chart = echarts.init(chartEl);
  const skillsData = [
    { name: 'Identity Mgmt', value: 95 },
    { name: 'Data Protection', value: 90 },
    { name: 'Network Security', value: 88 },
    { name: 'App Security', value: 85 },
    { name: 'Monitoring', value: 92 },
    { name: 'Incident Response', value: 87 },
    { name: 'Zero Trust', value: 93 },
  ];
  chart.setOption({
    backgroundColor: 'transparent',
    radar: {
      indicator: skillsData.map(i => ({ name: i.name, max: 100 })),
      center: ['50%', '50%'],
      radius: '65%',
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#334155' } },
      name: { textStyle: { color: '#94a3b8', fontSize: 12 } },
    },
    series: [{
      type: 'radar',
      data: [{ value: skillsData.map(i => i.value), areaStyle: { color: 'rgba(59,130,246,0.2)' }, lineStyle: { color: '#3b82f6', width: 2 }, itemStyle: { color: '#3b82f6' } }],
    }],
  });
  const resizeHandler = () => chart.resize();
  window.addEventListener('resize', resizeHandler);

  // Quiz
  let qIdx = 0, score = 0;
  const quizEl = container.querySelector('#quiz-content');
  container.querySelector('#start-quiz-btn').addEventListener('click', startQuiz);

  function startQuiz() {
    qIdx = 0; score = 0;
    showQuestion();
  }

  function showQuestion() {
    const q = quizQuestions[qIdx];
    quizEl.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <span class="text-sm text-slate-400">Question ${qIdx + 1} / ${quizQuestions.length}</span>
        <span class="text-sm text-blue-400">Score: ${score}</span>
      </div>
      <div class="w-full bg-slate-700 rounded-full h-1.5 mb-6">
        <div class="bg-blue-500 h-1.5 rounded-full transition-all" style="width:${((qIdx + 1) / quizQuestions.length) * 100}%"></div>
      </div>
      <h4 class="text-lg font-semibold mb-4">${q.question}</h4>
      <div class="space-y-2">
        ${q.options.map((o, i) => `<button class="quiz-opt w-full text-left p-3.5 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl transition-all text-sm" data-idx="${i}">${o}</button>`).join('')}
      </div>
      <div id="quiz-feedback" class="hidden mt-4"></div>
    `;
    quizEl.querySelectorAll('.quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => selectAnswer(parseInt(btn.dataset.idx)));
    });
  }

  function selectAnswer(idx) {
    const q = quizQuestions[qIdx];
    const opts = quizEl.querySelectorAll('.quiz-opt');
    opts.forEach(o => { o.disabled = true; o.classList.add('pointer-events-none'); });
    if (idx === q.correct) { score++; opts[idx].classList.add('!bg-emerald-600/30', 'border', 'border-emerald-500'); }
    else { opts[idx].classList.add('!bg-red-600/30', 'border', 'border-red-500'); opts[q.correct].classList.add('!bg-emerald-600/30', 'border', 'border-emerald-500'); }
    const fb = quizEl.querySelector('#quiz-feedback');
    fb.classList.remove('hidden');
    fb.innerHTML = `
      <div class="p-3 bg-slate-700/30 rounded-xl text-sm text-slate-300 mb-3">${q.explanation}</div>
      <button class="quiz-next px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-all">${qIdx < quizQuestions.length - 1 ? 'Next' : 'Results'}</button>
    `;
    fb.querySelector('.quiz-next').addEventListener('click', () => {
      qIdx++;
      if (qIdx < quizQuestions.length) showQuestion();
      else showResults();
    });
  }

  function showResults() {
    const pct = Math.round((score / quizQuestions.length) * 100);
    quizEl.innerHTML = `
      <div class="text-center py-4">
        <div class="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">${score}/${quizQuestions.length}</div>
        <div class="text-slate-400 mb-4">${pct}% Correct</div>
        <button class="quiz-retry px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-all">Retake</button>
      </div>
    `;
    quizEl.querySelector('.quiz-retry').addEventListener('click', startQuiz);
  }

  // Scroll animations
  const disconnect = observeAndAnimate(container);

  return () => {
    typed.destroy();
    chart.dispose();
    window.removeEventListener('resize', resizeHandler);
    disconnect();
  };
}
