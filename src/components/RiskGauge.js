export function renderRiskGauge(score, size = 200) {
  const radius = 80;
  const circumference = Math.PI * radius; // semicircle
  const offset = circumference - (score * circumference);

  let color, label;
  if (score <= 0.3) { color = '#10b981'; label = 'Low Risk'; }
  else if (score <= 0.5) { color = '#f59e0b'; label = 'Medium Risk'; }
  else if (score <= 0.7) { color = '#f97316'; label = 'High Risk'; }
  else { color = '#ef4444'; label = 'Critical Risk'; }

  return `
    <div class="flex flex-col items-center">
      <svg width="${size}" height="${size * 0.6}" viewBox="0 0 200 120" class="overflow-visible">
        <!-- Background arc -->
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#334155" stroke-width="12" stroke-linecap="round"/>
        <!-- Score arc -->
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
          style="transition: stroke-dashoffset 0.8s ease-out, stroke 0.3s ease"/>
        <!-- Score text -->
        <text x="100" y="85" text-anchor="middle" fill="white" font-size="28" font-weight="700" font-family="Inter">${(score * 100).toFixed(0)}%</text>
        <text x="100" y="108" text-anchor="middle" fill="${color}" font-size="13" font-weight="600" font-family="Inter">${label}</text>
      </svg>
    </div>`;
}
