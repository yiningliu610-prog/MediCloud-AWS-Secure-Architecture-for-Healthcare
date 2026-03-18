export const COLOR_MAP = {
  blue:   { gradient: 'from-blue-500 to-blue-600',   text: 'text-blue-400',   bg: 'bg-blue-500', border: 'border-blue-500/30', glow: 'glow-blue' },
  green:  { gradient: 'from-emerald-500 to-emerald-600', text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/30', glow: 'glow-green' },
  purple: { gradient: 'from-purple-500 to-purple-600', text: 'text-purple-400', bg: 'bg-purple-500', border: 'border-purple-500/30', glow: 'glow-blue' },
  red:    { gradient: 'from-red-500 to-red-600',     text: 'text-red-400',    bg: 'bg-red-500', border: 'border-red-500/30', glow: 'glow-pink' },
  indigo: { gradient: 'from-indigo-500 to-indigo-600', text: 'text-indigo-400', bg: 'bg-indigo-500', border: 'border-indigo-500/30', glow: 'glow-indigo' },
  pink:   { gradient: 'from-pink-500 to-pink-600',   text: 'text-pink-400',   bg: 'bg-pink-500', border: 'border-pink-500/30', glow: 'glow-pink' },
  yellow: { gradient: 'from-amber-500 to-amber-600', text: 'text-amber-400',  bg: 'bg-amber-500', border: 'border-amber-500/30', glow: 'glow-blue' },
};

export const PILLARS = [
  {
    id: 'identity',
    title: 'Identity & Access',
    subtitle: 'IAM + Zero Trust',
    description: 'Role-based access with explicit Deny policies, MFA enforcement, and policy-as-code using OPA Rego',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
    color: 'blue',
    route: '#/identity',
    stats: ['4 IAM Roles', 'OPA Rego', 'MFA Enforced'],
  },
  {
    id: 'encryption',
    title: 'Data Protection',
    subtitle: 'KMS Encryption',
    description: 'Customer-managed KMS keys with role-based crypto permissions, automatic rotation, and CloudTrail integration',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`,
    color: 'green',
    route: '#/encryption',
    stats: ['KMS Keys', 'Auto Rotation', 'Deny Deletion'],
  },
  {
    id: 'network',
    title: 'Network Security',
    subtitle: 'VPC + Kubernetes',
    description: 'Public/private subnet isolation with NAT instance, locked security groups, and hardened K8s deployments',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>`,
    color: 'purple',
    route: '#/network',
    stats: ['VPC Isolation', '3 Security Groups', 'K8s Hardened'],
  },
  {
    id: 'threat',
    title: 'Threat Response',
    subtitle: 'GuardDuty + Lambda',
    description: 'Automated threat detection pipeline with GuardDuty, EventBridge routing, Lambda remediation, and S3 evidence archival',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
    color: 'indigo',
    route: '#/threat-response',
    stats: ['361 Findings', 'Auto Remediation', '<5s Response'],
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Audit',
    subtitle: 'CloudTrail + CloudWatch',
    description: 'Multi-region CloudTrail logging, CloudWatch real-time streaming, metric filters for AccessDenied detection, and automated alarm notifications',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
    color: 'yellow',
    route: '#/monitoring',
    stats: ['1,247 Events', 'Real-time Alerts', '98.5% Compliance'],
  },
];

export const STATS = [
  { value: '47', label: 'Security Controls' },
  { value: '8+', label: 'AWS Services' },
  { value: '25.5h', label: 'Implementation' },
  { value: '361', label: 'Threats Detected' },
];
