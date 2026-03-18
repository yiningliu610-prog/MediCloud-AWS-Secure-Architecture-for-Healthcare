import { renderCodeBlock } from '../components/CodeBlock.js';
import { showModal } from '../components/Modal.js';
import { lambdaCode } from '../data/lambda-code.js';
import { observeAndAnimate } from '../utils/animate.js';

const eventBridgeRule = `{
  "source": ["aws.guardduty"],
  "detail-type": ["GuardDuty Finding"],
  "detail": {
    "severity": [{ "numeric": [">=", 1] }]
  }
}`;

export function renderThreatResponse(container) {
  container.innerHTML = `
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-transparent"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">GuardDuty + Lambda</div>
        <h1 class="text-3xl sm:text-4xl font-bold mb-3">Threat Detection & Response</h1>
        <p class="text-slate-400 max-w-2xl">Automated threat detection pipeline with GuardDuty continuous monitoring, EventBridge routing, Lambda auto-remediation, and S3 evidence archival.</p>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Stats -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        ${[
          { value: '361', label: 'Total Findings', sub: '8 High / 127 Medium / 226 Low', color: 'indigo' },
          { value: '<1 min', label: 'Detection Time', sub: 'GuardDuty real-time analysis', color: 'blue' },
          { value: '<5 sec', label: 'Alert Delivery', sub: 'EventBridge + SNS pipeline', color: 'amber' },
          { value: '2.3s', label: 'Lambda Response', sub: 'Auto-remediation average', color: 'emerald' },
        ].map(s => `
          <div class="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 text-center animate-on-scroll">
            <div class="text-2xl font-bold text-${s.color}-400 mb-1">${s.value}</div>
            <div class="text-sm font-medium mb-1">${s.label}</div>
            <div class="text-xs text-slate-500">${s.sub}</div>
          </div>
        `).join('')}
      </div>

      <!-- Pipeline Overview -->
      <div class="bg-slate-800/30 rounded-2xl p-8 border border-slate-700/50 mb-14 animate-on-scroll">
        <h2 class="text-2xl font-bold mb-6">Automated Response Pipeline</h2>
        <div class="flex flex-wrap items-center justify-center gap-3">
          ${[
            { name: 'GuardDuty', desc: 'Detect', color: '#6366f1' },
            { name: 'EventBridge', desc: 'Route', color: '#f59e0b' },
            { name: 'SNS', desc: 'Notify', color: '#3b82f6' },
            { name: 'Lambda', desc: 'Remediate', color: '#10b981' },
            { name: 'S3', desc: 'Archive', color: '#a855f7' },
          ].map((n, i, arr) => `
            <div class="flex items-center gap-3">
              <div class="flex flex-col items-center p-4 rounded-xl border border-slate-600 bg-slate-800 min-w-[90px]">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style="background: ${n.color}20; color: ${n.color}">
                  <div class="w-3 h-3 rounded-full" style="background: ${n.color}"></div>
                </div>
                <span class="text-sm font-bold">${n.name}</span>
                <span class="text-xs text-slate-500">${n.desc}</span>
              </div>
              ${i < arr.length - 1 ? '<svg class="w-5 h-5 text-slate-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>' : ''}
            </div>
          `).join('')}
        </div>
        <div class="text-center mt-6">
          <a href="#/simulator" class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium text-sm transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
            Run Interactive Simulation
          </a>
        </div>
      </div>

      <!-- EventBridge + Lambda -->
      <div class="grid lg:grid-cols-2 gap-6 animate-on-scroll">
        <div>
          <h3 class="text-lg font-bold mb-4">EventBridge Rule</h3>
          ${renderCodeBlock(eventBridgeRule, 'json', { title: 'guardduty-to-lambda-rule.json' })}
          <div class="mt-4 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <h4 class="text-sm font-bold text-amber-400 mb-2">Finding Categories</h4>
            <div class="grid grid-cols-2 gap-2 text-sm">
              ${[
                ['UnauthorizedAccess', '8 findings'],
                ['Recon/PortProbe', '45 findings'],
                ['CryptoCurrency', '12 findings'],
                ['Trojan', '3 findings'],
              ].map(([cat, count]) => `
                <div class="flex justify-between p-2 bg-slate-700/30 rounded-lg">
                  <span class="text-slate-300 text-xs">${cat}</span>
                  <span class="text-slate-500 text-xs">${count}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-bold mb-4">Lambda Auto-Remediation</h3>
          <div style="max-height: 500px; overflow-y: auto">
            ${renderCodeBlock(lambdaCode, 'python', { title: 'AutoRemediation.py', highlightLines: [38, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 28, 29, 30, 31, 32, 33, 34, 35] })}
          </div>
        </div>
      </div>

      <!-- Screenshots -->
      <div class="mt-16 animate-on-scroll">
        <h2 class="text-2xl font-bold mb-6">Lab Evidence</h2>
        <div class="grid sm:grid-cols-3 gap-4">
          ${[1, 2, 3].map(i => `
            <div class="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden cursor-pointer hover:border-slate-500 transition-colors screenshot-thumb">
              <img src="/images/screenshots/Screenshot-${i}.png" alt="Lab screenshot ${i}" class="w-full h-48 object-cover object-top"/>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // Screenshot click → modal with full image
  container.querySelectorAll('.screenshot-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const imgSrc = thumb.querySelector('img').src;
      showModal({
        title: 'Lab Evidence',
        body: `<img src="${imgSrc}" alt="Lab screenshot" class="w-full rounded-lg"/>`,
        size: 'lg',
      });
    });
  });

  const disconnect = observeAndAnimate(container);
  return () => disconnect();
}
