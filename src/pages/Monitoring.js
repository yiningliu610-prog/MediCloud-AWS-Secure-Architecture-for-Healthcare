import { renderCodeBlock } from '../components/CodeBlock.js';
import { observeAndAnimate } from '../utils/animate.js';

const metricFilterPattern = `{
  "FilterName": "AccessDenied_MetricFilter",
  "FilterPattern": "{ $.errorCode = \\"AccessDenied\\" }",
  "MetricTransformations": {
    "MetricNamespace": "MediCloud/Security",
    "MetricName": "AccessDeniedCount",
    "MetricValue": "1",
    "DefaultValue": "0"
  }
}`;

const trailConfig = `{
  "TrailName": "medicloud-records-tail",
  "IsMultiRegionTrail": true,
  "S3BucketName": "aws-cloudtrail-logs-502339147379-66b0f3b9",
  "CloudWatchLogsLogGroupArn": "arn:aws:logs:us-east-2:...:log-group:medicloud-records-watch",
  "IsLogging": true,
  "EventSelectors": [
    {
      "ReadWriteType": "All",
      "IncludeManagementEvents": true,
      "DataResources": [
        {
          "Type": "AWS::S3::Object",
          "Values": ["arn:aws:s3:::medicloud-records/"]
        }
      ]
    }
  ],
  "InsightSelectors": [
    { "InsightType": "ApiCallRateInsight" },
    { "InsightType": "ApiErrorRateInsight" }
  ]
}`;

export function renderMonitoring(container) {
  container.innerHTML = `
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-amber-900/30 to-transparent"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">AWS Monitoring</div>
        <h1 class="text-3xl sm:text-4xl font-bold mb-3">CloudTrail & CloudWatch</h1>
        <p class="text-slate-400 max-w-2xl">Comprehensive API-level visibility and real-time security monitoring across all AWS regions, with automated alerting for unauthorized access attempts.</p>
      </div>
    </section>

    <!-- Monitoring Stats -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        ${[
          { value: '1,247', label: 'Events Captured', sub: 'Security-relevant activities', color: 'amber' },
          { value: '23', label: 'Access Denied', sub: 'Unauthorized attempts blocked', color: 'red' },
          { value: '45s', label: 'Detection Time', sub: 'Target < 1 minute', color: 'blue' },
          { value: '98.5%', label: 'Compliance Score', sub: 'HIPAA audit readiness', color: 'emerald' },
        ].map(s => `
          <div class="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 text-center animate-on-scroll">
            <div class="text-2xl font-bold text-${s.color}-400 mb-1">${s.value}</div>
            <div class="text-sm font-medium mb-1">${s.label}</div>
            <div class="text-xs text-slate-500">${s.sub}</div>
          </div>
        `).join('')}
      </div>

      <!-- Integration Flow -->
      <div class="bg-slate-800/30 rounded-2xl p-8 border border-slate-700/50 mb-14 animate-on-scroll">
        <h2 class="text-2xl font-bold mb-6">Monitoring Pipeline</h2>
        <div class="flex flex-wrap items-center justify-center gap-3">
          ${[
            { name: 'CloudTrail', desc: 'API Logging', color: '#f59e0b' },
            { name: 'S3 Bucket', desc: 'Log Storage', color: '#a855f7' },
            { name: 'CloudWatch Logs', desc: 'Real-time Stream', color: '#3b82f6' },
            { name: 'Metric Filters', desc: 'Pattern Match', color: '#10b981' },
            { name: 'CloudWatch Alarm', desc: 'Threshold Alert', color: '#ef4444' },
            { name: 'SNS', desc: 'Notification', color: '#6366f1' },
          ].map((n, i, arr) => `
            <div class="flex items-center gap-3">
              <div class="flex flex-col items-center p-4 rounded-xl border border-slate-600 bg-slate-800 min-w-[100px]">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style="background: ${n.color}20; color: ${n.color}">
                  <div class="w-3 h-3 rounded-full" style="background: ${n.color}"></div>
                </div>
                <span class="text-xs font-bold text-center">${n.name}</span>
                <span class="text-xs text-slate-500 text-center">${n.desc}</span>
              </div>
              ${i < arr.length - 1 ? '<svg class="w-5 h-5 text-slate-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>' : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- CloudTrail + CloudWatch Details -->
      <div class="grid lg:grid-cols-2 gap-6 mb-14">
        <!-- CloudTrail -->
        <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden animate-on-scroll">
          <div class="p-6 border-b border-slate-700/50 bg-gradient-to-r from-amber-500/10 to-transparent">
            <h3 class="text-lg font-bold text-amber-400 mb-1">AWS CloudTrail</h3>
            <p class="text-sm text-slate-400">Multi-region trail capturing all API activity for audit and compliance</p>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Trail Configuration</h4>
              <div class="space-y-2 text-sm">
                ${[
                  ['Trail Name', 'medicloud-records-tail'],
                  ['Type', 'Multi-region (all AWS regions)'],
                  ['S3 Bucket', 'aws-cloudtrail-logs-...'],
                  ['CloudWatch Log Group', 'medicloud-records-watch'],
                  ['Status', '<span class="text-emerald-400">Logging Active</span>'],
                ].map(([k, v]) => `
                  <div class="flex justify-between p-2 bg-slate-700/30 rounded-lg">
                    <span class="text-slate-400">${k}</span>
                    <span class="text-slate-200">${v}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Events Captured</h4>
              <div class="flex flex-wrap gap-2">
                ${['ConsoleLogin', 'S3 Operations', 'IAM Changes', 'EC2 Actions', 'KMS Events', 'CloudTrail Config'].map(e =>
                  `<span class="px-2 py-1 text-xs rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">${e}</span>`
                ).join('')}
              </div>
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Capabilities</h4>
              <ul class="space-y-1 text-sm text-slate-300">
                <li class="flex items-center gap-2"><span class="text-emerald-400">&#10003;</span> Management Events: ALL API activity</li>
                <li class="flex items-center gap-2"><span class="text-emerald-400">&#10003;</span> Data Events: S3 object-level operations (uploads, reads, deletes)</li>
                <li class="flex items-center gap-2"><span class="text-emerald-400">&#10003;</span> Insights: API call rate + error rate anomaly detection</li>
                <li class="flex items-center gap-2"><span class="text-emerald-400">&#10003;</span> KMS integration for encrypted audit logs</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- CloudWatch -->
        <div class="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden animate-on-scroll">
          <div class="p-6 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-transparent">
            <h3 class="text-lg font-bold text-blue-400 mb-1">AWS CloudWatch</h3>
            <p class="text-sm text-slate-400">Real-time log streaming, metric filters, and automated security alarms</p>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Log Group Configuration</h4>
              <div class="space-y-2 text-sm">
                ${[
                  ['Log Group', 'medicloud-records-watch'],
                  ['Source', 'CloudTrail real-time stream'],
                  ['Format', 'Standardized JSON'],
                  ['IAM', 'Push permissions for log delivery'],
                ].map(([k, v]) => `
                  <div class="flex justify-between p-2 bg-slate-700/30 rounded-lg">
                    <span class="text-slate-400">${k}</span>
                    <span class="text-slate-200">${v}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dashboard Metrics</h4>
              <div class="grid grid-cols-2 gap-2">
                ${[
                  ['156', 'Console Logins'],
                  ['23', 'Access Denied'],
                  ['8', 'S3 Operations'],
                  ['47', 'Config Changes'],
                  ['12', 'Event Sources'],
                  ['31', 'Failed Operations'],
                ].map(([val, label]) => `
                  <div class="bg-slate-700/30 rounded-lg p-2 text-center">
                    <div class="text-sm font-bold text-blue-400">${val}</div>
                    <div class="text-xs text-slate-500">${label}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Security Alarm</h4>
              <div class="bg-red-500/5 border border-red-500/20 rounded-lg p-3 text-sm">
                <span class="text-red-400 font-bold">AccessDenied Alarm:</span>
                <span class="text-slate-300"> Triggers when &gt; 5 AccessDenied events occur within 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Config Code -->
      <div class="grid lg:grid-cols-2 gap-6 animate-on-scroll">
        <div>
          <h3 class="text-lg font-bold mb-4">CloudTrail Configuration</h3>
          <div style="max-height: 450px; overflow-y: auto">
            ${renderCodeBlock(trailConfig, 'json', { title: 'medicloud-trail-config.json', highlightLines: [3, 4, 5, 12, 13, 14, 21, 22] })}
          </div>
        </div>
        <div>
          <h3 class="text-lg font-bold mb-4">CloudWatch Metric Filter</h3>
          ${renderCodeBlock(metricFilterPattern, 'json', { title: 'access-denied-filter.json', highlightLines: [3, 5, 6] })}
          <div class="mt-6 bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
            <h4 class="text-sm font-bold text-emerald-400 mb-3">How It Works in MediCloud</h4>
            <ol class="space-y-2 text-sm text-slate-300">
              <li class="flex gap-2"><span class="text-amber-400 font-bold shrink-0">1.</span> CloudTrail logs every AWS API call across all regions to S3</li>
              <li class="flex gap-2"><span class="text-amber-400 font-bold shrink-0">2.</span> Logs stream in real-time to CloudWatch Log Group</li>
              <li class="flex gap-2"><span class="text-amber-400 font-bold shrink-0">3.</span> Metric filter scans for AccessDenied errors (e.g. Biller accessing hospitalA)</li>
              <li class="flex gap-2"><span class="text-amber-400 font-bold shrink-0">4.</span> CloudWatch Alarm fires if threshold exceeded (&gt;5 in 5 min)</li>
              <li class="flex gap-2"><span class="text-amber-400 font-bold shrink-0">5.</span> SNS sends email/SMS notification to security team</li>
              <li class="flex gap-2"><span class="text-amber-400 font-bold shrink-0">6.</span> GuardDuty complements with ML-based threat detection</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  `;

  const disconnect = observeAndAnimate(container);
  return () => disconnect();
}
