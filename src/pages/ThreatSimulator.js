import anime from 'animejs';
import { renderCodeBlock } from '../components/CodeBlock.js';
import { showModal } from '../components/Modal.js';
import { lambdaCode } from '../data/lambda-code.js';

const NODES = [
  { id: 'guardduty', label: 'GuardDuty', desc: 'Threat Detection', color: '#6366f1', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { id: 'eventbridge', label: 'EventBridge', desc: 'Event Routing', color: '#f59e0b', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'sns', label: 'SNS Topic', desc: 'Notification', color: '#3b82f6', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { id: 'lambda', label: 'Lambda', desc: 'Auto-Remediate', color: '#10b981', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { id: 's3', label: 'S3 Evidence', desc: 'Archive', color: '#a855f7', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
];

const FINDING_TYPES = [
  'UnauthorizedAccess:EC2/MaliciousIPCaller.Custom',
  'Recon:EC2/PortProbeUnprotectedPort',
  'CryptoCurrency:EC2/BitcoinTool.B!DNS',
  'Trojan:EC2/DriveBySourceTraffic!DNS',
  'Impact:EC2/PortSweep',
];

function generateFinding(severity) {
  const type = FINDING_TYPES[Math.floor(Math.random() * FINDING_TYPES.length)];
  const id = `f-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  return {
    id, type, severity,
    region: 'us-east-2',
    account: '502339147379',
    resource: {
      instanceDetails: {
        instanceId: `i-${Math.random().toString(16).slice(2, 12)}`,
        instanceType: 't3.micro',
      },
    },
  };
}

export function renderThreatSimulator(container) {
  container.innerHTML = `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="mb-10">
        <a href="#/threat-response" class="text-sm text-slate-500 hover:text-slate-300 transition-colors mb-4 inline-block">&larr; Threat Response</a>
        <h1 class="text-3xl sm:text-4xl font-bold mb-3">Threat Detection Simulator</h1>
        <p class="text-slate-400 max-w-2xl">Simulate a GuardDuty finding and watch the automated response pipeline process it in real time.</p>
      </div>

      <!-- Controls -->
      <div class="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 mb-8">
        <div class="flex flex-wrap items-center gap-6">
          <div class="flex-1 min-w-[200px]">
            <label class="text-sm text-slate-400 block mb-2">Severity Level: <span id="sev-label" class="text-amber-400 font-bold">5.0</span></label>
            <input type="range" id="severity-slider" min="1" max="8" step="0.5" value="5" class="w-full accent-blue-500"/>
          </div>
          <button id="simulate-btn" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Simulate Threat
          </button>
          <button id="reset-btn" class="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition-all text-sm text-slate-300">Reset</button>
        </div>
      </div>

      <!-- Pipeline -->
      <div class="bg-slate-800/30 rounded-2xl p-8 border border-slate-700/50 mb-8 overflow-x-auto">
        <div class="flex items-center justify-between min-w-[700px] gap-2" id="pipeline">
          ${NODES.map((node, i) => `
            <div class="flex items-center ${i < NODES.length - 1 ? 'flex-1' : ''}">
              <button class="pipeline-node relative flex flex-col items-center p-4 rounded-2xl border-2 border-slate-600 bg-slate-800 cursor-pointer hover:border-slate-500 transition-all min-w-[100px]" data-node="${node.id}" style="--node-color: ${node.color}">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-2" style="background: ${node.color}20; color: ${node.color}">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${node.icon}"/></svg>
                </div>
                <span class="text-sm font-bold">${node.label}</span>
                <span class="text-xs text-slate-500">${node.desc}</span>
                <div class="node-indicator absolute -top-1 -right-1 w-3 h-3 rounded-full bg-slate-600 border-2 border-slate-800"></div>
              </button>
              ${i < NODES.length - 1 ? `
                <div class="flex-1 h-0.5 bg-slate-700 mx-2 relative overflow-hidden connection" data-from="${node.id}">
                  <div class="packet absolute w-3 h-3 rounded-full -top-[5px]" style="background: ${node.color}; box-shadow: 0 0 10px ${node.color}; left: -12px; opacity: 0;"></div>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Event Log + Code -->
      <div class="grid lg:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-bold mb-3">Event Log</h3>
          <div class="terminal rounded-xl overflow-hidden" style="height: 420px">
            <div class="terminal-header">
              <div class="terminal-dot" style="background:#ff5f57"></div>
              <div class="terminal-dot" style="background:#febc2e"></div>
              <div class="terminal-dot" style="background:#28c840"></div>
              <span class="text-xs text-slate-500 ml-3">threat-response.log</span>
            </div>
            <div id="event-log" class="p-4 overflow-y-auto text-xs font-mono" style="height: 388px">
              <div class="text-slate-600">Waiting for simulation...</div>
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-bold mb-3">Lambda Function</h3>
          <div class="overflow-hidden rounded-xl border border-slate-700/50" style="max-height: 420px; overflow-y: auto">
            ${renderCodeBlock(lambdaCode, 'python', { title: 'AutoRemediation.py' })}
          </div>
        </div>
      </div>

      <!-- Finding Detail -->
      <div id="finding-detail" class="hidden mt-8">
        <h3 class="text-lg font-bold mb-3">Generated Finding</h3>
        <div id="finding-json" class="overflow-hidden rounded-xl border border-slate-700/50"></div>
      </div>
    </section>
  `;

  const sevSlider = container.querySelector('#severity-slider');
  const sevLabel = container.querySelector('#sev-label');
  const simBtn = container.querySelector('#simulate-btn');
  const resetBtn = container.querySelector('#reset-btn');
  const eventLog = container.querySelector('#event-log');
  let running = false;

  sevSlider.addEventListener('input', () => {
    const v = parseFloat(sevSlider.value);
    sevLabel.textContent = v.toFixed(1);
    sevLabel.className = v >= 7 ? 'text-red-400 font-bold' : v >= 4 ? 'text-amber-400 font-bold' : 'text-green-400 font-bold';
  });

  // Node click → modal
  container.querySelectorAll('.pipeline-node').forEach(node => {
    node.addEventListener('click', () => {
      const n = NODES.find(x => x.id === node.dataset.node);
      const details = {
        guardduty: 'Continuously monitors VPC Flow Logs, CloudTrail events, and DNS logs. Uses machine learning and threat intelligence to identify malicious activity.',
        eventbridge: 'Routes GuardDuty findings based on severity filters. Event pattern matches source "aws.guardduty" and routes to SNS, Lambda, and CloudWatch Logs.',
        sns: 'Distributes notifications to the Lambda function via subscriptions. Delivers finding metadata as SNS Records in the Lambda event payload.',
        lambda: 'Parses finding details, archives evidence to S3, and tags suspected EC2 instances. Supports LOG_ONLY mode and MIN_SEVERITY threshold.',
        s3: 'Stores finding evidence as timestamped JSON files under guardduty/findings/ prefix. Enables forensic analysis and compliance audit trails.',
      };
      showModal({
        title: n.label,
        body: `<p class="mb-3">${details[n.id]}</p>
          <div class="flex items-center gap-2 text-sm">
            <div class="w-3 h-3 rounded-full" style="background: ${n.color}"></div>
            <span class="text-slate-400">${n.desc}</span>
          </div>`,
      });
    });
  });

  function log(msg, level = 'info') {
    const ts = new Date().toISOString().split('T')[1].slice(0, 12);
    const colors = { info: 'text-blue-400', warn: 'text-amber-400', error: 'text-red-400', success: 'text-emerald-400' };
    eventLog.innerHTML += `<div><span class="text-slate-600">${ts}</span> <span class="${colors[level] || colors.info}">[${level.toUpperCase()}]</span> ${msg}</div>`;
    eventLog.scrollTop = eventLog.scrollHeight;
  }

  function activateNode(nodeId) {
    const el = container.querySelector(`[data-node="${nodeId}"]`);
    const indicator = el.querySelector('.node-indicator');
    const n = NODES.find(x => x.id === nodeId);
    indicator.style.background = n.color;
    indicator.style.boxShadow = `0 0 8px ${n.color}`;
    el.style.borderColor = n.color;
    el.classList.add('node-active');
  }

  async function animateConnection(fromId) {
    const conn = container.querySelector(`[data-from="${fromId}"]`);
    if (!conn) return;
    const packet = conn.querySelector('.packet');
    await anime({
      targets: packet,
      left: ['0%', '100%'],
      opacity: [1, 0],
      duration: 600,
      easing: 'easeInOutQuad',
    }).finished;
  }

  async function simulate() {
    if (running) return;
    running = true;
    simBtn.disabled = true;
    simBtn.classList.add('opacity-50');

    // Reset nodes
    container.querySelectorAll('.node-indicator').forEach(i => { i.style.background = '#475569'; i.style.boxShadow = 'none'; });
    container.querySelectorAll('.pipeline-node').forEach(n => { n.style.borderColor = '#475569'; n.classList.remove('node-active'); });
    eventLog.innerHTML = '';

    const severity = parseFloat(sevSlider.value);
    const finding = generateFinding(severity);

    // Step 1: GuardDuty
    log('GuardDuty finding generated', 'info');
    log(`Type: ${finding.type}`, 'info');
    log(`Severity: ${severity} | Instance: ${finding.resource.instanceDetails.instanceId}`, 'info');
    activateNode('guardduty');
    await delay(800);

    // Step 2: EventBridge
    await animateConnection('guardduty');
    log('EventBridge rule matched: severity >= 1', 'info');
    log('Routing to SNS topic and Lambda target...', 'info');
    activateNode('eventbridge');
    await delay(600);

    // Step 3: SNS
    await animateConnection('eventbridge');
    log('SNS notification dispatched', 'success');
    log('Subscribers notified: Lambda, CloudWatch Logs', 'info');
    activateNode('sns');
    await delay(600);

    // Step 4: Lambda
    await animateConnection('sns');
    log('Lambda invoked: AutoRemediation', 'info');
    activateNode('lambda');
    await delay(300);
    log(`[finding] id=${finding.id} type=${finding.type} sev=${severity}`, 'info');
    await delay(400);

    if (severity >= 4) {
      log(`[tag] EC2 ${finding.resource.instanceDetails.instanceId} tagged: GuardDuty=suspected`, 'warn');
    } else {
      log(`[skip] severity ${severity} < MIN_SEVERITY 4.0`, 'info');
    }
    await delay(400);

    // Step 5: S3
    await animateConnection('lambda');
    const key = `guardduty/findings/${finding.id}_${new Date().toISOString().replace(/[:-]/g, '').split('.')[0]}Z.json`;
    log(`[evidence] finding saved to s3://medicloud-evidence/${key}`, 'success');
    activateNode('s3');
    await delay(400);

    log('Pipeline complete. All services nominal.', 'success');

    // Show finding JSON
    const detailSection = container.querySelector('#finding-detail');
    detailSection.classList.remove('hidden');
    detailSection.querySelector('#finding-json').innerHTML = renderCodeBlock(JSON.stringify(finding, null, 2), 'json', { title: 'GuardDuty Finding' });

    running = false;
    simBtn.disabled = false;
    simBtn.classList.remove('opacity-50');
  }

  resetBtn.addEventListener('click', () => {
    eventLog.innerHTML = '<div class="text-slate-600">Waiting for simulation...</div>';
    container.querySelectorAll('.node-indicator').forEach(i => { i.style.background = '#475569'; i.style.boxShadow = 'none'; });
    container.querySelectorAll('.pipeline-node').forEach(n => { n.style.borderColor = '#475569'; n.classList.remove('node-active'); });
    container.querySelector('#finding-detail').classList.add('hidden');
    running = false;
    simBtn.disabled = false;
    simBtn.classList.remove('opacity-50');
  });

  simBtn.addEventListener('click', simulate);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
