import { renderCodeBlock } from '../components/CodeBlock.js';
import { showModal } from '../components/Modal.js';
import { k8sManifest } from '../data/k8s-manifest.js';
import { observeAndAnimate } from '../utils/animate.js';

const vpcDiagram = `
  <div class="relative bg-slate-900 rounded-xl p-6 border border-slate-700/50 overflow-hidden">
    <div class="text-center text-xs text-slate-500 mb-4 font-bold uppercase tracking-wider">VPC: 10.0.0.0/16 (medicloud-hospitalA-vpc)</div>
    <div class="grid grid-cols-2 gap-4">
      <!-- Public Subnet -->
      <div class="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
        <div class="text-xs font-bold text-emerald-400 mb-3">Public Subnet - 10.0.1.0/24</div>
        <div class="space-y-2">
          <div class="bg-slate-800 rounded-lg p-3 border border-slate-700 cursor-pointer hover:border-emerald-500/50 transition-colors vpc-node" data-node="web">
            <div class="text-xs font-bold">Web Server</div>
            <div class="text-xs text-slate-500">443 open, SSH: 172.1.153.50/32</div>
          </div>
          <div class="bg-slate-800 rounded-lg p-3 border border-slate-700 cursor-pointer hover:border-emerald-500/50 transition-colors vpc-node" data-node="nat">
            <div class="text-xs font-bold">NAT Instance</div>
            <div class="text-xs text-slate-500">t3.micro, SourceDestCheck=false</div>
          </div>
        </div>
      </div>
      <!-- Private Subnet -->
      <div class="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
        <div class="text-xs font-bold text-blue-400 mb-3">Private Subnet - 10.0.2.0/24</div>
        <div class="space-y-2">
          <div class="bg-slate-800 rounded-lg p-3 border border-slate-700 cursor-pointer hover:border-blue-500/50 transition-colors vpc-node" data-node="db">
            <div class="text-xs font-bold">Database</div>
            <div class="text-xs text-slate-500">MySQL 3306: from 10.0.1.0/24 only</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
      <div class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-emerald-500"></div> Internet Gateway</div>
      <div class="text-slate-700">|</div>
      <div class="flex items-center gap-1"><div class="w-2 h-2 rounded-full bg-amber-500"></div> NAT routing to private</div>
    </div>
  </div>
`;

const sgDetails = {
  web: {
    title: 'Web Server Security Group',
    body: `<div class="space-y-3">
      <div class="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10"><span class="text-xs font-bold text-emerald-400">INBOUND</span><div class="text-sm mt-1">TCP 443 (HTTPS) from 0.0.0.0/0</div><div class="text-sm">TCP 22 (SSH) from 172.1.153.50/32 only</div></div>
      <div class="bg-blue-500/5 rounded-lg p-3 border border-blue-500/10"><span class="text-xs font-bold text-blue-400">OUTBOUND</span><div class="text-sm mt-1">All traffic allowed</div></div>
      <p class="text-xs text-slate-500">SSH access locked to a single developer IP. HTTPS open for patient portal access.</p>
    </div>`
  },
  nat: {
    title: 'NAT Instance Security Group',
    body: `<div class="space-y-3">
      <div class="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10"><span class="text-xs font-bold text-emerald-400">INBOUND</span><div class="text-sm mt-1">TCP 22 (SSH) from 172.1.153.50/32 only</div></div>
      <div class="bg-blue-500/5 rounded-lg p-3 border border-blue-500/10"><span class="text-xs font-bold text-blue-400">OUTBOUND</span><div class="text-sm mt-1">All traffic allowed (for NAT functionality)</div></div>
      <p class="text-xs text-slate-500">SourceDestCheck disabled to allow packet forwarding from private subnet to internet.</p>
    </div>`
  },
  db: {
    title: 'Database Security Group',
    body: `<div class="space-y-3">
      <div class="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10"><span class="text-xs font-bold text-emerald-400">INBOUND</span><div class="text-sm mt-1">TCP 3306 (MySQL) from 10.0.1.0/24 only</div></div>
      <div class="bg-blue-500/5 rounded-lg p-3 border border-blue-500/10"><span class="text-xs font-bold text-blue-400">OUTBOUND</span><div class="text-sm mt-1">All traffic allowed</div></div>
      <p class="text-xs text-slate-500">Database only accessible from the public subnet (web servers). No direct internet access.</p>
    </div>`
  },
};

export function renderNetwork(container) {
  container.innerHTML = `
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-transparent"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">VPC + Kubernetes</div>
        <h1 class="text-3xl sm:text-4xl font-bold mb-3">Network Security</h1>
        <p class="text-slate-400 max-w-2xl">Public/private subnet isolation with NAT instance, locked-down security groups, and hardened Kubernetes deployments with Pod Security Standards.</p>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <!-- VPC Architecture -->
      <div class="mb-16 animate-on-scroll">
        <h2 class="text-2xl font-bold mb-6">VPC Architecture</h2>
        <p class="text-slate-400 text-sm mb-6">Click any component to see its security group rules.</p>
        ${vpcDiagram}
      </div>

      <!-- Architecture Diagram -->
      <div class="mb-16 animate-on-scroll">
        <h2 class="text-2xl font-bold mb-6">Network Architecture Diagram</h2>
        <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-4 overflow-hidden">
          <img src="/images/architecture/network-architecture.png" alt="Network architecture" class="w-full rounded-xl max-h-[500px] object-contain"/>
        </div>
      </div>

      <!-- Kubernetes -->
      <div class="animate-on-scroll">
        <h2 class="text-2xl font-bold mb-2">Kubernetes Security Hardening</h2>
        <p class="text-sm text-slate-400 mb-6">Production-grade nginx deployment with 6 security layers.</p>
        <div class="grid lg:grid-cols-5 gap-6">
          <div class="lg:col-span-3" style="max-height: 600px; overflow-y: auto">
            ${renderCodeBlock(k8sManifest, 'yaml', { title: 'hardened-nginx.yaml' })}
          </div>
          <div class="lg:col-span-2 space-y-3">
            ${[
              { title: 'Pod Security Standards', desc: 'Restricted profile enforced at namespace level', color: 'blue' },
              { title: 'RBAC', desc: 'Read-only Role for nginx ServiceAccount', color: 'emerald' },
              { title: 'NetworkPolicy', desc: 'Default deny + allow only port 80 ingress', color: 'amber' },
              { title: 'Non-root Container', desc: 'runAsNonRoot: true, runAsUser: 101', color: 'purple' },
              { title: 'Read-only Filesystem', desc: 'readOnlyRootFilesystem with tmpfs volumes', color: 'pink' },
              { title: 'Dropped Capabilities', desc: 'drop: ["ALL"], add: ["NET_BIND_SERVICE"]', color: 'red' },
            ].map(s => `
              <div class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <h4 class="text-sm font-bold text-${s.color}-400 mb-1">${s.title}</h4>
                <p class="text-xs text-slate-400">${s.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;

  // VPC node click → modal
  container.querySelectorAll('.vpc-node').forEach(node => {
    node.addEventListener('click', () => {
      const detail = sgDetails[node.dataset.node];
      if (detail) showModal(detail);
    });
  });

  const disconnect = observeAndAnimate(container);
  return () => disconnect();
}
