import { renderCodeBlock } from '../components/CodeBlock.js';
import { kmsPolicy } from '../data/policies.js';
import { observeAndAnimate } from '../utils/animate.js';

export function renderEncryption(container) {
  container.innerHTML = `
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-900/30 to-transparent"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">KMS Encryption</div>
        <h1 class="text-3xl sm:text-4xl font-bold mb-3">Data Protection & Encryption</h1>
        <p class="text-slate-400 max-w-2xl">Customer-managed KMS keys with role-based cryptographic permissions, automatic annual rotation, and denial of key deletion for data recovery protection.</p>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- Key Features -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        ${[
          { icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', title: 'Role-Based Crypto', desc: 'Doctor: full encrypt/decrypt. Biller: decrypt only.' },
          { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', title: 'Auto Key Rotation', desc: 'Annual automatic rotation with no downtime.' },
          { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Deny Key Deletion', desc: 'Explicit Deny prevents accidental or malicious key destruction.' },
          { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', title: 'CloudTrail Audit', desc: 'All key usage logged via encryption context conditions.' },
        ].map(f => `
          <div class="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 animate-on-scroll">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${f.icon}"/></svg>
            </div>
            <h3 class="font-bold mb-1">${f.title}</h3>
            <p class="text-sm text-slate-400">${f.desc}</p>
          </div>
        `).join('')}
      </div>

      <!-- KMS Policy -->
      <div class="animate-on-scroll">
        <h2 class="text-2xl font-bold mb-6">KMS Key Policy</h2>
        <div class="grid lg:grid-cols-5 gap-6">
          <div class="lg:col-span-3">
            ${renderCodeBlock(kmsPolicy, 'json', { title: 'medicloud-key-policy.json', highlightLines: [12, 13, 14, 25, 26, 38, 39, 40, 41, 42, 43, 44, 45, 50, 51] })}
          </div>
          <div class="lg:col-span-2 space-y-4">
            <div class="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h3 class="font-bold mb-4">Permission Matrix</h3>
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-slate-500 border-b border-slate-700">
                    <th class="pb-2 text-left">Action</th>
                    <th class="pb-2 text-center">Doctor</th>
                    <th class="pb-2 text-center">Biller</th>
                  </tr>
                </thead>
                <tbody class="text-slate-300">
                  ${[
                    ['Encrypt', true, false],
                    ['Decrypt', true, true],
                    ['GenerateDataKey', true, false],
                    ['DescribeKey', true, true],
                    ['ScheduleKeyDeletion', false, false],
                  ].map(([action, doc, bil]) => `
                    <tr class="border-b border-slate-700/50">
                      <td class="py-2 font-mono text-xs">${action}</td>
                      <td class="py-2 text-center">${doc ? '<span class="text-emerald-400">&#10003;</span>' : '<span class="text-red-400">&#10007;</span>'}</td>
                      <td class="py-2 text-center">${bil ? '<span class="text-emerald-400">&#10003;</span>' : '<span class="text-red-400">&#10007;</span>'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            <div class="bg-red-500/5 rounded-2xl p-6 border border-red-500/10">
              <h4 class="text-red-400 font-bold text-sm mb-2">Key Deletion Protection</h4>
              <p class="text-sm text-slate-400">The explicit Deny on ScheduleKeyDeletion applies to ALL principals including root. This prevents catastrophic data loss if the encryption key is destroyed, as all encrypted PHI would become permanently unrecoverable.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  const disconnect = observeAndAnimate(container);
  return () => disconnect();
}
