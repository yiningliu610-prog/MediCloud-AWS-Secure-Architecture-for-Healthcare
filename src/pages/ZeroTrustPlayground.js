import { renderRiskGauge } from '../components/RiskGauge.js';
import { renderCodeBlock } from '../components/CodeBlock.js';
import { regoPolicy } from '../data/rego-policy.js';

const COUNTRIES = ['US', 'CA', 'GB', 'DE', 'CN', 'RU', 'BR', 'IN'];
const ALLOWED_COUNTRIES = ['US', 'CA', 'GB'];

function evaluate(input) {
  const denyReasons = [];
  if (!input.user.mfa) denyReasons.push('Multi-factor authentication required');
  if (!input.device.trusted) denyReasons.push('Device not in trusted state');
  if (!input.network.vpn) denyReasons.push('VPN connection required');
  if (input.user.suspended) denyReasons.push('User account is suspended');
  if (!input.device.compliant) denyReasons.push('Device does not meet compliance requirements');

  const userRisk = (!input.user.mfa ? 0.3 : 0) + (input.user.suspended ? 0.2 : 0) + (!input.user.recentActivity ? 0.1 : 0);
  const deviceRisk = (!input.device.trusted ? 0.4 : 0) + (!input.device.compliant ? 0.2 : 0) + (input.device.suspiciousLocation ? 0.1 : 0);
  const networkRisk = (!input.network.vpn ? 0.3 : 0) + (input.network.unusualTraffic ? 0.2 : 0) + (input.network.newLocation ? 0.1 : 0);
  const riskScore = (userRisk * 0.4) + (deviceRisk * 0.3) + (networkRisk * 0.3);

  const geoAllowed = ALLOWED_COUNTRIES.includes(input.network.country);
  if (!geoAllowed) denyReasons.push(`Geographic restriction: ${input.network.country} not in allowed list`);

  const allow = denyReasons.length === 0;

  return {
    allow,
    denyReasons,
    riskScore: Math.min(riskScore, 1),
    geoAllowed,
    requireStepUpAuth: riskScore > 0.7,
    requireAdditionalVerification: riskScore > 0.5,
    breakdown: { userRisk, deviceRisk, networkRisk },
  };
}

export function renderZeroTrustPlayground(container) {
  container.innerHTML = `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-10">
        <a href="#/identity" class="text-sm text-slate-500 hover:text-slate-300 transition-colors mb-4 inline-block">&larr; Identity & Access</a>
        <h1 class="text-3xl sm:text-4xl font-bold mb-3">Zero Trust Access Evaluator</h1>
        <p class="text-slate-400 max-w-2xl">Toggle security context parameters to see real-time access decisions and risk scoring based on the OPA Rego policy.</p>
      </div>

      <div class="grid lg:grid-cols-3 gap-6 mb-10">
        <!-- Controls -->
        <div class="lg:col-span-2 space-y-4">
          <div class="grid sm:grid-cols-3 gap-4">
            <!-- User Context -->
            <div class="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
              <h3 class="text-sm font-bold uppercase tracking-wider text-blue-400 mb-4 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                User Context
              </h3>
              <div class="space-y-3">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" class="zt-toggle w-5 h-5 rounded border-slate-500 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0" data-field="user.mfa" checked/>
                  <span class="text-sm group-hover:text-white transition-colors">MFA Enabled</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" class="zt-toggle w-5 h-5 rounded border-slate-500 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0" data-field="user.suspended"/>
                  <span class="text-sm group-hover:text-white transition-colors">Account Suspended</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" class="zt-toggle w-5 h-5 rounded border-slate-500 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0" data-field="user.recentActivity" checked/>
                  <span class="text-sm group-hover:text-white transition-colors">Recent Activity</span>
                </label>
              </div>
            </div>

            <!-- Device Context -->
            <div class="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
              <h3 class="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                Device Context
              </h3>
              <div class="space-y-3">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" class="zt-toggle w-5 h-5 rounded border-slate-500 bg-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0" data-field="device.trusted" checked/>
                  <span class="text-sm group-hover:text-white transition-colors">Device Trusted</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" class="zt-toggle w-5 h-5 rounded border-slate-500 bg-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0" data-field="device.compliant" checked/>
                  <span class="text-sm group-hover:text-white transition-colors">Device Compliant</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" class="zt-toggle w-5 h-5 rounded border-slate-500 bg-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0" data-field="device.suspiciousLocation"/>
                  <span class="text-sm group-hover:text-white transition-colors">Suspicious Location</span>
                </label>
              </div>
            </div>

            <!-- Network Context -->
            <div class="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
              <h3 class="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9"/></svg>
                Network Context
              </h3>
              <div class="space-y-3">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" class="zt-toggle w-5 h-5 rounded border-slate-500 bg-slate-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-0" data-field="network.vpn" checked/>
                  <span class="text-sm group-hover:text-white transition-colors">VPN Connected</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" class="zt-toggle w-5 h-5 rounded border-slate-500 bg-slate-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-0" data-field="network.unusualTraffic"/>
                  <span class="text-sm group-hover:text-white transition-colors">Unusual Traffic</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" class="zt-toggle w-5 h-5 rounded border-slate-500 bg-slate-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-0" data-field="network.newLocation"/>
                  <span class="text-sm group-hover:text-white transition-colors">New Location</span>
                </label>
                <div>
                  <label class="text-xs text-slate-500 block mb-1">Country</label>
                  <select id="country-select" class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:ring-amber-500">
                    ${COUNTRIES.map(c => `<option value="${c}" ${c === 'US' ? 'selected' : ''}>${c} ${ALLOWED_COUNTRIES.includes(c) ? '' : '(blocked)'}</option>`).join('')}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Preset Scenarios -->
          <div class="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Scenarios</h3>
            <div class="flex flex-wrap gap-2">
              <button class="scenario-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all" data-scenario="trusted">Trusted Employee</button>
              <button class="scenario-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all" data-scenario="remote">Remote Worker</button>
              <button class="scenario-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all" data-scenario="attacker">Compromised Account</button>
              <button class="scenario-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-all" data-scenario="foreign">Foreign Access</button>
            </div>
          </div>
        </div>

        <!-- Decision Panel -->
        <div class="space-y-4">
          <div id="decision-panel" class="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 text-center">
            <!-- Filled by updateDecision -->
          </div>
          <div id="deny-reasons" class="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 hidden">
            <h4 class="text-sm font-bold text-red-400 mb-3">Denial Reasons</h4>
            <ul id="deny-list" class="space-y-2 text-sm"></ul>
          </div>
          <div id="risk-breakdown" class="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
            <h4 class="text-sm font-bold text-slate-400 mb-3">Risk Breakdown</h4>
            <div id="breakdown-bars" class="space-y-3"></div>
          </div>
        </div>
      </div>

      <!-- Rego Policy -->
      <div>
        <h3 class="text-lg font-bold mb-3">OPA Rego Policy</h3>
        <div class="overflow-hidden rounded-xl border border-slate-700/50" style="max-height: 500px; overflow-y: auto">
          ${renderCodeBlock(regoPolicy, 'javascript', { title: 'zero-trust-policy.rego' })}
        </div>
      </div>
    </section>
  `;

  const scenarios = {
    trusted: { 'user.mfa': true, 'user.suspended': false, 'user.recentActivity': true, 'device.trusted': true, 'device.compliant': true, 'device.suspiciousLocation': false, 'network.vpn': true, 'network.unusualTraffic': false, 'network.newLocation': false, country: 'US' },
    remote: { 'user.mfa': true, 'user.suspended': false, 'user.recentActivity': true, 'device.trusted': true, 'device.compliant': false, 'device.suspiciousLocation': false, 'network.vpn': false, 'network.unusualTraffic': false, 'network.newLocation': true, country: 'US' },
    attacker: { 'user.mfa': false, 'user.suspended': false, 'user.recentActivity': false, 'device.trusted': false, 'device.compliant': false, 'device.suspiciousLocation': true, 'network.vpn': false, 'network.unusualTraffic': true, 'network.newLocation': true, country: 'RU' },
    foreign: { 'user.mfa': true, 'user.suspended': false, 'user.recentActivity': true, 'device.trusted': true, 'device.compliant': true, 'device.suspiciousLocation': false, 'network.vpn': true, 'network.unusualTraffic': false, 'network.newLocation': false, country: 'CN' },
  };

  function getInput() {
    const get = (f) => container.querySelector(`[data-field="${f}"]`)?.checked ?? false;
    return {
      user: { mfa: get('user.mfa'), suspended: get('user.suspended'), recentActivity: get('user.recentActivity') },
      device: { trusted: get('device.trusted'), compliant: get('device.compliant'), suspiciousLocation: get('device.suspiciousLocation') },
      network: { vpn: get('network.vpn'), unusualTraffic: get('network.unusualTraffic'), newLocation: get('network.newLocation'), country: container.querySelector('#country-select').value },
    };
  }

  function updateDecision() {
    const input = getInput();
    const result = evaluate(input);

    // Decision panel
    const panel = container.querySelector('#decision-panel');
    panel.innerHTML = `
      <div class="mb-4">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-lg font-bold ${result.allow ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}">
          ${result.allow ? '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> ALLOW' : '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg> DENY'}
        </div>
      </div>
      ${renderRiskGauge(result.riskScore)}
      ${result.requireStepUpAuth ? '<div class="mt-3 text-xs text-amber-400 font-medium">Step-up authentication required</div>' : ''}
      ${result.requireAdditionalVerification && !result.requireStepUpAuth ? '<div class="mt-3 text-xs text-amber-400 font-medium">Additional verification recommended</div>' : ''}
    `;

    // Deny reasons
    const denySection = container.querySelector('#deny-reasons');
    const denyList = container.querySelector('#deny-list');
    if (result.denyReasons.length > 0) {
      denySection.classList.remove('hidden');
      denyList.innerHTML = result.denyReasons.map(r => `<li class="flex items-start gap-2"><svg class="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg><span class="text-slate-300">${r}</span></li>`).join('');
    } else {
      denySection.classList.add('hidden');
    }

    // Risk breakdown
    const breakdownEl = container.querySelector('#breakdown-bars');
    const bars = [
      { label: 'User Risk (40%)', value: result.breakdown.userRisk, max: 0.6, color: 'bg-blue-500' },
      { label: 'Device Risk (30%)', value: result.breakdown.deviceRisk, max: 0.7, color: 'bg-emerald-500' },
      { label: 'Network Risk (30%)', value: result.breakdown.networkRisk, max: 0.6, color: 'bg-amber-500' },
    ];
    breakdownEl.innerHTML = bars.map(b => `
      <div>
        <div class="flex justify-between text-xs mb-1">
          <span class="text-slate-400">${b.label}</span>
          <span class="text-slate-300">${(b.value * 100).toFixed(0)}%</span>
        </div>
        <div class="w-full bg-slate-700 rounded-full h-1.5">
          <div class="${b.color} h-1.5 rounded-full transition-all duration-500" style="width: ${(b.value / b.max) * 100}%"></div>
        </div>
      </div>
    `).join('');
  }

  // Event listeners
  container.querySelectorAll('.zt-toggle').forEach(toggle => {
    toggle.addEventListener('change', updateDecision);
  });
  container.querySelector('#country-select').addEventListener('change', updateDecision);

  container.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = scenarios[btn.dataset.scenario];
      Object.entries(s).forEach(([key, val]) => {
        if (key === 'country') {
          container.querySelector('#country-select').value = val;
        } else {
          const el = container.querySelector(`[data-field="${key}"]`);
          if (el) el.checked = val;
        }
      });
      updateDecision();
    });
  });

  // Initial render
  updateDecision();
}
