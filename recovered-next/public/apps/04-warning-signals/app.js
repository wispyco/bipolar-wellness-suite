/* ==========================================================================
   App 4: Early Warning Signal Detector -- Logic
   ========================================================================== */

// --- Warning Signs Data ---
let maniaSigns = [
  { id: 'm1', name: 'Decreased need for sleep', custom: false },
  { id: 'm2', name: 'Increased energy or restlessness', custom: false },
  { id: 'm3', name: 'Racing thoughts', custom: false },
  { id: 'm4', name: 'Rapid or pressured speech', custom: false },
  { id: 'm5', name: 'Grandiose thinking or plans', custom: false },
  { id: 'm6', name: 'Increased spending or impulsive decisions', custom: false },
  { id: 'm7', name: 'Irritability or agitation', custom: false },
  { id: 'm8', name: 'Increased goal-directed activity', custom: false },
  { id: 'm9', name: 'Risky or reckless behavior', custom: false },
  { id: 'm10', name: 'Feeling invincible or euphoric', custom: false }
];

let depressionSigns = [
  { id: 'd1', name: 'Withdrawal from social activities', custom: false },
  { id: 'd2', name: 'Persistent fatigue or low energy', custom: false },
  { id: 'd3', name: 'Difficulty concentrating', custom: false },
  { id: 'd4', name: 'Feelings of hopelessness', custom: false },
  { id: 'd5', name: 'Sleeping too much or insomnia', custom: false },
  { id: 'd6', name: 'Loss of interest in usual activities', custom: false },
  { id: 'd7', name: 'Changes in appetite', custom: false },
  { id: 'd8', name: 'Increased self-criticism', custom: false },
  { id: 'd9', name: 'Crying spells or emotional numbness', custom: false },
  { id: 'd10', name: 'Thoughts of worthlessness', custom: false }
];

// --- Sample Check-in Data (14 days) ---
// Story: days 1-5 stable, days 6-9 mania signs creeping, days 10-12 escalating, days 13-14 starting to stabilize
const sampleHistory = [];
const baseDate = new Date('2026-03-19');

const sampleRatings = [
  // Day 1-5: Stable (low scores)
  { mania: [0,0,0,0,0,0,0,0,0,0], depression: [0,0,1,0,0,0,0,0,0,0] },
  { mania: [0,0,0,0,0,0,0,0,0,0], depression: [0,0,0,0,0,0,0,1,0,0] },
  { mania: [0,0,0,0,0,0,0,0,0,0], depression: [0,1,0,0,0,0,0,0,0,0] },
  { mania: [0,0,0,0,0,0,0,0,0,0], depression: [0,0,0,0,1,0,0,0,0,0] },
  { mania: [0,1,0,0,0,0,0,0,0,0], depression: [0,0,0,0,0,0,0,0,0,0] },
  // Day 6-9: Mania creeping in
  { mania: [1,1,1,0,0,0,0,1,0,0], depression: [0,0,0,0,0,0,0,0,0,0] },
  { mania: [1,2,1,1,0,0,1,1,0,0], depression: [0,0,0,0,0,0,0,0,0,0] },
  { mania: [2,2,2,1,1,0,1,2,0,1], depression: [0,0,0,0,0,0,0,0,0,0] },
  { mania: [2,2,2,2,1,1,2,2,1,1], depression: [0,0,0,0,0,0,0,0,0,0] },
  // Day 10-12: Escalating
  { mania: [3,3,2,2,2,1,2,3,1,2], depression: [0,0,0,0,0,0,0,0,0,0] },
  { mania: [3,3,3,2,2,2,2,3,2,2], depression: [0,0,0,0,0,0,0,0,0,0] },
  { mania: [2,3,3,2,2,2,3,2,2,2], depression: [0,0,0,0,0,0,0,0,0,0] },
  // Day 13-14: Stabilizing with intervention
  { mania: [2,2,1,1,1,1,1,1,0,1], depression: [0,0,1,0,1,0,0,0,0,0] },
  { mania: [1,1,1,0,0,0,1,1,0,0], depression: [0,1,1,0,1,1,0,0,0,0] }
];

for (let i = 0; i < sampleRatings.length; i++) {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + i);
  const entry = {
    date: d.toISOString().slice(0, 10),
    mania: {},
    depression: {}
  };
  maniaSigns.forEach((s, j) => { entry.mania[s.id] = sampleRatings[i].mania[j] || 0; });
  depressionSigns.forEach((s, j) => { entry.depression[s.id] = sampleRatings[i].depression[j] || 0; });
  sampleHistory.push(entry);
}

let history = [...sampleHistory];
let currentRatings = { mania: {}, depression: {} };
let riskChart = null;
let splitChart = null;

// Initialize current ratings to 0
maniaSigns.forEach(s => currentRatings.mania[s.id] = 0);
depressionSigns.forEach(s => currentRatings.depression[s.id] = 0);

// --- Tab Navigation ---
document.querySelectorAll('.app-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.app-tab').forEach(t => { t.classList.remove('app-tab--active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('app-tab--active'); tab.setAttribute('aria-selected', 'true');
    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = true);
    const panel = document.querySelector(`[data-panel="${tab.dataset.tab}"]`);
    if (panel) {
      panel.hidden = false;
      if (tab.dataset.tab === 'trends') renderTrends();
      if (tab.dataset.tab === 'signs') renderManageSigns();
    }
  });
});

// --- Set today's date ---
document.getElementById('checkin-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

// --- Render Check-in Signs ---
function renderCheckin() {
  renderSignList('mania-signs', maniaSigns, 'mania');
  renderSignList('depression-signs', depressionSigns, 'depression');
  updateAlertBanner();
}

function renderSignList(containerId, signs, type) {
  const el = document.getElementById(containerId);
  el.innerHTML = signs.map(s => {
    const current = currentRatings[type][s.id] || 0;
    return `
      <div class="sign-item">
        <span class="sign-item__name">${esc(s.name)}</span>
        <div class="sign-item__rating">
          ${[0,1,2,3].map(v => `
            <button class="rating-btn ${current === v ? 'rating-btn--active-' + v : ''}"
              data-sign="${s.id}" data-type="${type}" data-value="${v}"
              aria-label="Rate ${v}">${v}</button>
          `).join('')}
        </div>
      </div>`;
  }).join('');

  el.querySelectorAll('.rating-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { sign, type: t, value } = btn.dataset;
      currentRatings[t][sign] = parseInt(value);
      renderCheckin();
    });
  });
}

// --- Alert Banner ---
function updateAlertBanner() {
  const maniaTotal = Object.values(currentRatings.mania).reduce((s, v) => s + v, 0);
  const depTotal = Object.values(currentRatings.depression).reduce((s, v) => s + v, 0);
  const total = maniaTotal + depTotal;

  const banner = document.getElementById('alert-banner');
  const icons = {
    green: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    yellow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
    orange: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    red: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
  };

  let level, title, desc, icon;
  if (total <= 8) {
    level = 'green'; title = 'Status: Stable'; desc = 'No significant warning signs detected. Continue your maintenance routine.'; icon = icons.green;
  } else if (total <= 18) {
    level = 'yellow'; title = 'Status: Early Warning'; desc = 'Some warning signs emerging. Increase self-care and monitoring.'; icon = icons.yellow;
  } else if (total <= 30) {
    level = 'orange'; title = 'Status: Escalating'; desc = 'Multiple warning signs active. Contact your care team.'; icon = icons.orange;
  } else {
    level = 'red'; title = 'Status: Crisis Level'; desc = 'Severe warning signs. Seek immediate professional support.'; icon = icons.red;
  }

  banner.className = `alert-banner alert-banner--${level}`;
  document.getElementById('alert-icon').innerHTML = icon;
  document.getElementById('alert-title').textContent = title;
  document.getElementById('alert-desc').textContent = desc;
  document.getElementById('alert-score').textContent = total;

  // Highlight corresponding action card
  document.querySelectorAll('.action-card').forEach(c => c.classList.remove('action-card--current'));
  const actionCard = document.querySelector(`.action-card--${level}`);
  if (actionCard) actionCard.classList.add('action-card--current');
}

// --- Save Check-in ---
document.getElementById('save-checkin').addEventListener('click', () => {
  const entry = {
    date: new Date().toISOString().slice(0, 10),
    mania: { ...currentRatings.mania },
    depression: { ...currentRatings.depression }
  };
  // Replace today's entry if exists, else add
  const idx = history.findIndex(h => h.date === entry.date);
  if (idx >= 0) history[idx] = entry;
  else history.push(entry);

  showToast();
});

function showToast() {
  const toast = document.getElementById('save-toast');
  toast.hidden = false; toast.classList.add('toast--visible');
  setTimeout(() => { toast.classList.remove('toast--visible'); setTimeout(() => toast.hidden = true, 300); }, 2000);
}

// --- Trends ---
function renderTrends() {
  const last14 = history.slice(-14);
  const labels = last14.map(h => {
    const d = new Date(h.date + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const maniaTotals = last14.map(h => Object.values(h.mania).reduce((s, v) => s + v, 0));
  const depTotals = last14.map(h => Object.values(h.depression).reduce((s, v) => s + v, 0));
  const totalScores = maniaTotals.map((m, i) => m + depTotals[i]);

  // Risk chart
  if (riskChart) riskChart.destroy();
  const ctx1 = document.getElementById('risk-chart').getContext('2d');
  riskChart = new Chart(ctx1, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Risk Score',
        data: totalScores,
        borderColor: '#7C6DAF',
        backgroundColor: 'rgba(124,109,175,0.1)',
        fill: true, tension: 0.3, pointRadius: 4, pointBackgroundColor: totalScores.map(s => {
          if (s <= 8) return '#5B8C5A';
          if (s <= 18) return '#E8A838';
          if (s <= 30) return '#D4776B';
          return '#B42828';
        })
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        annotation: { annotations: {} }
      },
      scales: {
        y: { beginAtZero: true, ticks: { color: '#6E6B7B' }, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { ticks: { color: '#6E6B7B', font: { size: 10 } }, grid: { display: false } }
      }
    }
  });

  // Split chart (mania vs depression)
  if (splitChart) splitChart.destroy();
  const ctx2 = document.getElementById('split-chart').getContext('2d');
  splitChart = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Mania Signs', data: maniaTotals, backgroundColor: 'rgba(212,119,107,0.6)', borderColor: '#D4776B', borderWidth: 1, borderRadius: 3 },
        { label: 'Depression Signs', data: depTotals, backgroundColor: 'rgba(59,89,152,0.6)', borderColor: '#3B5998', borderWidth: 1, borderRadius: 3 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#6E6B7B', usePointStyle: true, pointStyle: 'circle' } } },
      scales: {
        y: { beginAtZero: true, stacked: true, ticks: { color: '#6E6B7B' }, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { stacked: true, ticks: { color: '#6E6B7B', font: { size: 10 } }, grid: { display: false } }
      }
    }
  });

  // Heatmap
  renderHeatmap(last14, labels);
}

function renderHeatmap(data, dateLabels) {
  const allSigns = [...maniaSigns.map(s => ({ ...s, type: 'mania' })), ...depressionSigns.map(s => ({ ...s, type: 'depression' }))];
  const heatmap = document.getElementById('heatmap');

  let html = '<table class="heatmap-table"><thead><tr><th>Sign</th>';
  dateLabels.forEach(d => { html += `<th>${d}</th>`; });
  html += '</tr></thead><tbody>';

  allSigns.forEach(sign => {
    html += `<tr><th>${esc(sign.name)}</th>`;
    data.forEach(day => {
      const val = (day[sign.type] && day[sign.type][sign.id]) || 0;
      html += `<td><span class="heatmap-cell heatmap-cell--${val}">${val}</span></td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  heatmap.innerHTML = html;
}

// --- Manage Signs ---
function renderManageSigns() {
  renderManageList('manage-mania', maniaSigns, 'mania');
  renderManageList('manage-depression', depressionSigns, 'depression');
}

function renderManageList(containerId, signs, type) {
  const el = document.getElementById(containerId);
  el.innerHTML = signs.map(s => `
    <div class="manage-sign">
      <span class="manage-sign__name">${esc(s.name)}</span>
      ${s.custom ? `<span class="manage-sign__tag">Custom</span>` : `<span class="manage-sign__tag">Default</span>`}
      ${s.custom ? `<button class="manage-sign__remove" data-id="${s.id}" data-type="${type}" aria-label="Remove sign">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>` : ''}
    </div>
  `).join('');

  el.querySelectorAll('.manage-sign__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const { id, type: t } = btn.dataset;
      if (t === 'mania') maniaSigns = maniaSigns.filter(s => s.id !== id);
      else depressionSigns = depressionSigns.filter(s => s.id !== id);
      renderManageSigns();
      renderCheckin();
    });
  });
}

// --- Add Custom Sign ---
document.getElementById('add-sign-btn').addEventListener('click', () => {
  const nameInput = document.getElementById('new-sign-name');
  const typeSelect = document.getElementById('new-sign-type');
  const name = nameInput.value.trim();
  if (!name) return;

  const newSign = { id: 'custom_' + Date.now(), name, custom: true };
  if (typeSelect.value === 'mania') {
    maniaSigns.push(newSign);
    currentRatings.mania[newSign.id] = 0;
  } else {
    depressionSigns.push(newSign);
    currentRatings.depression[newSign.id] = 0;
  }

  nameInput.value = '';
  renderManageSigns();
  renderCheckin();
});

// --- Helpers ---
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

// --- Initialize ---
// Set today's ratings from last history entry to show a realistic starting state
const lastEntry = history[history.length - 1];
if (lastEntry) {
  Object.entries(lastEntry.mania).forEach(([k, v]) => { if (currentRatings.mania.hasOwnProperty(k)) currentRatings.mania[k] = v; });
  Object.entries(lastEntry.depression).forEach(([k, v]) => { if (currentRatings.depression.hasOwnProperty(k)) currentRatings.depression[k] = v; });
}

renderCheckin();
