/* ==========================================================================
   App 9: Chronotherapy Planner -- Logic
   ========================================================================== */

// --- Sample Exposure Log ---
const baseDate = new Date('2026-03-22');
let exposureLog = [];
for (let i = 0; i < 10; i++) {
  const d = new Date(baseDate); d.setDate(d.getDate() + i);
  const moodBefore = Math.max(1, Math.min(10, Math.round(3 + Math.random() * 3)));
  const moodAfter = Math.min(10, moodBefore + Math.round(1 + Math.random() * 2));
  exposureLog.push({
    date: d.toISOString().slice(0, 10),
    time: '07:' + String(25 + Math.floor(Math.random() * 10)).padStart(2, '0'),
    duration: [25, 30, 30, 30, 30, 30, 30, 30, 30, 30][i],
    intensity: '10000',
    moodBefore,
    moodAfter,
    notes: ['First session, felt okay', 'Slightly more alert after', 'Good session', 'Energy up by afternoon',
            'Missed yesterday, back on track', 'Noticeable lift', 'Best morning in a while', 'Consistent now',
            'Stable mood all day', 'Feeling the routine helping'][i]
  });
}

let moodChart = null;

// --- Blue Light Checklist ---
const CHECKLIST_ITEMS = [
  'Blue light filter activated on phone (Night Shift / f.lux)',
  'Blue light filter activated on computer',
  'Amber/orange glasses available for evening use',
  'Overhead lights switched to warm/dim setting by 6 PM',
  'Blackout curtains installed in bedroom',
  'No TV or bright screens within 1 hour of bedtime',
  'Bedroom temperature set to 65-68F (18-20C)',
  'All standby lights covered or removed from bedroom'
];
let checklistState = [true, true, false, true, true, false, false, false];

// --- Tab Navigation ---
document.querySelectorAll('.app-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.app-tab').forEach(t => { t.classList.remove('app-tab--active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('app-tab--active'); tab.setAttribute('aria-selected', 'true');
    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = true);
    const panel = document.querySelector(`[data-panel="${tab.dataset.tab}"]`);
    if (panel) {
      panel.hidden = false;
      if (tab.dataset.tab === 'light') renderSchedule();
      if (tab.dataset.tab === 'dark') renderChecklist();
      if (tab.dataset.tab === 'log') renderLog();
    }
  });
});

// --- Light Therapy Schedule ---
function renderSchedule() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const time = document.getElementById('blt-time').value || '07:30';
  const grid = document.getElementById('blt-schedule');
  grid.innerHTML = days.map((day, i) => {
    const done = i < 5; // demo: first 5 days done
    return `
    <div class="schedule-day">
      <div class="schedule-day__name">${day}</div>
      <div class="schedule-day__time">${formatTime12(time)}</div>
      <div class="schedule-day__status ${done ? 'schedule-day__status--done' : 'schedule-day__status--pending'}">${done ? 'Done' : 'Pending'}</div>
    </div>`;
  }).join('');
}

// --- Blue Light Checklist ---
function renderChecklist() {
  const el = document.getElementById('blue-light-checklist');
  el.innerHTML = CHECKLIST_ITEMS.map((item, i) => `
    <div class="checklist-item">
      <button class="checklist-item__check ${checklistState[i] ? 'checklist-item__check--done' : ''}" data-idx="${i}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
      </button>
      <span class="checklist-item__text">${item}</span>
    </div>
  `).join('');

  el.querySelectorAll('.checklist-item__check').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      checklistState[idx] = !checklistState[idx];
      renderChecklist();
    });
  });
}

// --- Exposure Log ---
function renderLog() {
  document.getElementById('log-date').value = new Date().toISOString().slice(0, 10);

  // Chart
  const labels = exposureLog.map(e => {
    const d = new Date(e.date + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  if (moodChart) moodChart.destroy();
  moodChart = new Chart(document.getElementById('mood-chart').getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Mood Before',
          data: exposureLog.map(e => e.moodBefore),
          borderColor: '#D4776B', backgroundColor: 'rgba(212,119,107,0.1)',
          fill: true, tension: 0.3, pointRadius: 4
        },
        {
          label: 'Mood After',
          data: exposureLog.map(e => e.moodAfter),
          borderColor: '#5B8C5A', backgroundColor: 'rgba(91,140,90,0.1)',
          fill: true, tension: 0.3, pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#6E6B7B', usePointStyle: true, pointStyle: 'circle' } } },
      scales: {
        y: { min: 0, max: 10, ticks: { color: '#6E6B7B', stepSize: 2 }, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { ticks: { color: '#6E6B7B', font: { size: 10 } }, grid: { display: false } }
      }
    }
  });

  // History list
  const hist = document.getElementById('log-history');
  hist.innerHTML = exposureLog.slice().reverse().map(e => {
    const date = new Date(e.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `
    <div class="log-entry">
      <span class="log-entry__date">${date}</span>
      <span class="log-entry__detail">${formatTime12(e.time)} -- ${e.duration} min at ${Number(e.intensity).toLocaleString()} lux</span>
      <div class="log-entry__mood"><span class="mood-dot mood-dot--before"></span>${e.moodBefore} <span class="mood-dot mood-dot--after"></span>${e.moodAfter}</div>
    </div>`;
  }).join('');
}

// --- Range sliders ---
document.getElementById('log-mood-before').addEventListener('input', e => {
  document.getElementById('mood-before-val').textContent = e.target.value;
});
document.getElementById('log-mood-after').addEventListener('input', e => {
  document.getElementById('mood-after-val').textContent = e.target.value;
});

// --- Log Form Submit ---
document.getElementById('log-form').addEventListener('submit', e => {
  e.preventDefault();
  exposureLog.push({
    date: document.getElementById('log-date').value,
    time: document.getElementById('log-time').value,
    duration: parseInt(document.getElementById('log-duration').value),
    intensity: document.getElementById('log-intensity').value,
    moodBefore: parseInt(document.getElementById('log-mood-before').value),
    moodAfter: parseInt(document.getElementById('log-mood-after').value),
    notes: document.getElementById('log-notes').value
  });
  document.getElementById('log-notes').value = '';
  renderLog();
  showToast();
});

// --- Helpers ---
function formatTime12(t) {
  if (!t) return '--';
  const [h, m] = t.split(':').map(Number);
  return (h % 12 || 12) + ':' + String(m).padStart(2, '0') + (h >= 12 ? ' PM' : ' AM');
}

function showToast() {
  const t = document.getElementById('save-toast');
  t.hidden = false; t.classList.add('toast--visible');
  setTimeout(() => { t.classList.remove('toast--visible'); setTimeout(() => t.hidden = true, 300); }, 2000);
}

// --- Init ---
renderSchedule();
