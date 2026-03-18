import { renderCodeBlock } from '../components/CodeBlock.js';
import { showModal } from '../components/Modal.js';
import { doctorPolicy, billerPolicy, devUserPolicy, opsUserPolicy } from '../data/policies.js';
import { observeAndAnimate } from '../utils/animate.js';

const roles = [
  {
    id: 'doctor',
    name: 'DoctorRole',
    type: 'IAM Role (EC2)',
    purpose: 'Healthcare provider access to patient Electronic Medical Records (EMR)',
    desc: 'Allows applications attached to the Doctor role to read patient medical records from the MediCloud S3 bucket, scoped to the hospitalA directory only. Includes KMS encrypt/decrypt for encrypted EMR data.',
    color: 'blue',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
    allows: ['s3:GetObject (hospitalA/*)', 's3:ListBucket (hospitalA/)', 'KMS Encrypt/Decrypt'],
    denies: ['s3:PutObject / DeleteObject', 'Access to non-hospitalA paths'],
    policy: doctorPolicy,
    policyFile: 'doctor-role-policy.json',
    highlights: [5, 6, 15, 16, 17, 18],
    simRows: [
      ['s3:GetObject', 'medicloud-records/hospitalA/patient001.json', true],
      ['s3:ListBucket', 'medicloud-records (prefix: hospitalA/)', true],
      ['s3:PutObject', 'medicloud-records/hospitalA/new.json', false],
      ['s3:GetObject', 'medicloud-records/hospitalB/patient.json', false],
    ],
  },
  {
    id: 'biller',
    name: 'Biller User',
    type: 'IAM User',
    purpose: 'Hospital billing and financial operations with read-only S3 access',
    desc: 'Allows billing staff to read S3 objects for billing information across all buckets, but explicitly denied access to sensitive patient medical records in hospitalA. KMS decrypt-only for encrypted billing data.',
    color: 'amber',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
    allows: ['s3:GetObject (all buckets)', 's3:ListBucket', 'KMS Decrypt only'],
    denies: ['s3:PutObject / DeleteObject', 's3:GetObject hospitalA/*', 'ACL modifications'],
    policy: billerPolicy,
    policyFile: 'biller-user-policy.json',
    highlights: [32, 33, 34, 35, 36, 37, 38, 39],
    simRows: [
      ['s3:GetObject', 'billing-data/invoice001.json', true],
      ['s3:ListBucket', 'billing-data', true],
      ['s3:GetObject', 'medicloud-records/hospitalA/patient.json', false],
      ['s3:PutObject', 'billing-data/new-invoice.json', false],
    ],
  },
  {
    id: 'devuser',
    name: 'DevUser',
    type: 'IAM User',
    purpose: 'Developer access for application testing and data management',
    desc: 'Strictly limited to S3 read-only operations for development and testing purposes. Uses NotAction deny to block all other AWS services — cannot access EC2, Lambda, KMS, IAM (except own password), or any infrastructure.',
    color: 'emerald',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>',
    allows: ['s3:GetObject', 's3:ListBucket', 'iam:GetUser / ChangePassword'],
    denies: ['All other AWS services (NotAction)', 'EC2, Lambda, KMS, IAM admin'],
    policy: devUserPolicy,
    policyFile: 'DevUserS3ReadOnly.json',
    highlights: [6, 7, 13, 14, 15, 16],
    simRows: [
      ['s3:GetObject', 'test-data/sample.json', true],
      ['s3:ListBucket', 'dev-bucket', true],
      ['ec2:DescribeInstances', '*', false],
      ['lambda:InvokeFunction', '*', false],
    ],
  },
  {
    id: 'opsuser',
    name: 'OpsUser',
    type: 'IAM User',
    purpose: 'Infrastructure operations and EC2 instance management',
    desc: 'Full EC2 management capabilities for operational tasks — start, stop, terminate instances, manage security groups, EBS volumes, and AMIs. Explicitly denied all S3 access to prevent any data exposure.',
    color: 'purple',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"/></svg>',
    allows: ['ec2:* (full EC2 access)', 'Instance management', 'Security group config'],
    denies: ['s3:* (all S3 denied)', 'Cannot access any data storage'],
    policy: opsUserPolicy,
    policyFile: 'OpsUserEC2Full.json',
    highlights: [4, 5, 9, 10],
    simRows: [
      ['ec2:RunInstances', 'i-0abc123', true],
      ['ec2:TerminateInstances', 'i-0abc123', true],
      ['s3:GetObject', 'medicloud-records/hospitalA/*', false],
      ['s3:ListBucket', 'billing-data', false],
    ],
  },
];

const colorMap = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400',    gradFrom: 'from-blue-500/10' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400',   gradFrom: 'from-amber-500/10' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', gradFrom: 'from-emerald-500/10' },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  text: 'text-purple-400',  gradFrom: 'from-purple-500/10' },
};

export function renderIdentity(container) {
  container.innerHTML = `
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-transparent"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">AWS IAM + Zero Trust</div>
        <h1 class="text-3xl sm:text-4xl font-bold mb-3">Identity & Access Management</h1>
        <p class="text-slate-400 max-w-2xl">Four IAM roles implementing least-privilege access, separation of duties, and explicit Deny policies for HIPAA-compliant healthcare data protection on AWS.</p>
      </div>
    </section>

    <!-- Roles Overview Matrix -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl font-bold mb-6">Role Comparison Matrix</h2>
      <div class="overflow-x-auto animate-on-scroll">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b border-slate-700">
              <th class="text-left p-3 text-slate-400 font-medium">Role</th>
              <th class="text-left p-3 text-slate-400 font-medium">Type</th>
              <th class="text-left p-3 text-slate-400 font-medium">Primary Service</th>
              <th class="text-center p-3 text-slate-400 font-medium">S3 Read</th>
              <th class="text-center p-3 text-slate-400 font-medium">S3 Write</th>
              <th class="text-center p-3 text-slate-400 font-medium">EC2</th>
              <th class="text-center p-3 text-slate-400 font-medium">KMS</th>
            </tr>
          </thead>
          <tbody>
            ${[
              { name: 'DoctorRole', type: 'IAM Role', svc: 'S3 (EMR)', s3r: 'hospitalA only', s3w: false, ec2: false, kms: 'Encrypt/Decrypt', color: 'blue' },
              { name: 'Biller', type: 'IAM User', svc: 'S3 (Billing)', s3r: 'All (except hospitalA)', s3w: false, ec2: false, kms: 'Decrypt only', color: 'amber' },
              { name: 'DevUser', type: 'IAM User', svc: 'S3 (Dev/Test)', s3r: 'All', s3w: false, ec2: false, kms: false, color: 'emerald' },
              { name: 'OpsUser', type: 'IAM User', svc: 'EC2 (Infra)', s3r: false, s3w: false, ec2: 'Full access', kms: false, color: 'purple' },
            ].map(r => `
              <tr class="border-b border-slate-800 hover:bg-slate-800/30">
                <td class="p-3 font-bold text-${r.color}-400">${r.name}</td>
                <td class="p-3 text-slate-300">${r.type}</td>
                <td class="p-3 text-slate-300">${r.svc}</td>
                <td class="p-3 text-center">${r.s3r ? `<span class="text-xs text-emerald-400">${r.s3r}</span>` : '<span class="text-red-400 text-xs">Denied</span>'}</td>
                <td class="p-3 text-center"><span class="text-red-400 text-xs">Denied</span></td>
                <td class="p-3 text-center">${r.ec2 ? `<span class="text-xs text-emerald-400">${r.ec2}</span>` : '<span class="text-red-400 text-xs">Denied</span>'}</td>
                <td class="p-3 text-center">${r.kms ? `<span class="text-xs text-emerald-400">${r.kms}</span>` : '<span class="text-red-400 text-xs">None</span>'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Security Principles -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8 animate-on-scroll">
        ${[
          { title: 'Least Privilege', desc: 'Each role has minimal necessary permissions', icon: '🔒' },
          { title: 'Separation of Duties', desc: 'Doctor, Biller, Dev, Ops completely segregated', icon: '🔀' },
          { title: 'Explicit Deny', desc: 'Dangerous operations explicitly denied, not just omitted', icon: '🚫' },
          { title: 'Service Isolation', desc: 'OpsUser cannot access data; DevUser cannot access infra', icon: '🧱' },
        ].map(p => `
          <div class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div class="text-lg mb-2">${p.icon}</div>
            <h4 class="text-sm font-bold mb-1">${p.title}</h4>
            <p class="text-xs text-slate-400">${p.desc}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Role Details with Tabs -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl font-bold mb-6">Role Details & Policies</h2>
      <div class="flex gap-2 mb-6 flex-wrap" id="role-tabs">
        ${roles.map((r, i) => {
          const c = colorMap[r.color];
          return `<button class="role-tab px-4 py-2 rounded-lg text-sm font-medium transition-all ${i === 0 ? c.bg + ' ' + c.text + ' ' + c.border + ' border' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}" data-idx="${i}">${r.name}</button>`;
        }).join('')}
      </div>

      <div id="role-detail"></div>
    </section>

    <!-- Access Simulation -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 animate-on-scroll">
        <h3 class="text-xl font-bold mb-6">IAM Policy Simulator Results</h3>
        <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          ${roles.map(r => `
            <div>
              <h4 class="text-sm font-bold ${colorMap[r.color].text} uppercase tracking-wider mb-4">${r.name}</h4>
              <div class="space-y-2">
                ${r.simRows.map(([action, resource, allowed]) => simRow(action, resource, allowed)).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Zero Trust CTA -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-on-scroll">
      <a href="#/zero-trust" class="card-hover block bg-gradient-to-br from-pink-900/30 to-slate-800/50 rounded-2xl p-8 border border-pink-500/20 group">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">Interactive Demo</div>
            <h3 class="text-2xl font-bold mb-2">Zero Trust Playground</h3>
            <p class="text-slate-400 text-sm">Toggle MFA, VPN, device trust and see real-time risk scoring based on OPA Rego policy.</p>
          </div>
          <svg class="w-8 h-8 text-pink-400 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </div>
      </a>
    </section>
  `;

  // Role tab switching
  function showRole(idx) {
    const r = roles[idx];
    const c = colorMap[r.color];
    const detail = container.querySelector('#role-detail');
    detail.innerHTML = `
      <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
        <div class="p-6 border-b border-slate-700/50 bg-gradient-to-r ${c.gradFrom} to-transparent">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center ${c.text}">
              ${r.icon}
            </div>
            <div>
              <h3 class="text-lg font-bold">${r.name}</h3>
              <p class="text-xs text-slate-400">${r.type} — ${r.purpose}</p>
            </div>
          </div>
          <p class="text-sm text-slate-300 mb-4">${r.desc}</p>
          <div class="flex flex-wrap gap-2">
            ${r.allows.map(a => `<span class="px-2 py-0.5 text-xs rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${a}</span>`).join('')}
            ${r.denies.map(d => `<span class="px-2 py-0.5 text-xs rounded bg-red-500/10 text-red-400 border border-red-500/20">${d}</span>`).join('')}
          </div>
        </div>
        <div class="p-4">
          ${renderCodeBlock(r.policy, 'json', { title: r.policyFile, highlightLines: r.highlights })}
        </div>
      </div>
    `;
  }

  // Tab clicks
  const tabs = container.querySelectorAll('.role-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.idx);
      tabs.forEach((t, i) => {
        const c = colorMap[roles[i].color];
        if (i === idx) {
          t.className = `role-tab px-4 py-2 rounded-lg text-sm font-medium transition-all ${c.bg} ${c.text} ${c.border} border`;
        } else {
          t.className = 'role-tab px-4 py-2 rounded-lg text-sm font-medium transition-all bg-slate-700 text-slate-300 hover:bg-slate-600';
        }
      });
      showRole(idx);
    });
  });

  // Show first role
  showRole(0);

  const disconnect = observeAndAnimate(container);
  return () => disconnect();
}

function simRow(action, resource, allowed) {
  return `
    <div class="flex items-center gap-2 p-2.5 rounded-lg ${allowed ? 'bg-emerald-500/5 border border-emerald-500/10' : 'bg-red-500/5 border border-red-500/10'}">
      <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${allowed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}">
        ${allowed ? '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>' : '<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'}
      </div>
      <div class="min-w-0">
        <span class="text-xs font-mono ${allowed ? 'text-emerald-400' : 'text-red-400'}">${action}</span>
        <div class="text-xs text-slate-500 truncate">${resource}</div>
      </div>
      <span class="ml-auto text-xs font-bold shrink-0 ${allowed ? 'text-emerald-400' : 'text-red-400'}">${allowed ? 'ALLOW' : 'DENY'}</span>
    </div>`;
}
