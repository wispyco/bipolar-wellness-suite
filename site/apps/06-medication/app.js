/* ==========================================================================
   App 6: Medication Adherence Tracker -- Logic
   ========================================================================== */

const MED_COLORS = ['#3B5998','#7C6DAF','#E8A838','#5B8C5A','#D4776B'];

// --- Medications ---
let medications = [
  { id: 'med1', name: 'Lithium', dose: '300mg', frequency: 'twice', time: '08:00', color: MED_COLORS[0] },
  { id: 'med2', name: 'Lamotrigine', dose: '200mg', frequency: 'once-evening', time: '21:00', color: MED_COLORS[1] },
  { id: 'med3', name: 'Quetiapine', dose: '100mg', frequency: 'once-evening', time: '22:00', color: MED_COLORS[2] }
];

// --- Sample adherence history (14 days) ---
const baseDate = new Date('2026-03-19');
let adherenceHistory = [];

const sampleAdherence = [
  // [med1_morning, med1_evening, med2, med3] -- true=taken, false=missed
  { med1: [true,true], med2: [true], med3: [true] },
  { med1: [true,true], med2: [true], med3: [true] },
  { med1: [true,true], med2: [true], med3: [true] },
  { med1: [true,true], med2: [true], med3: [false] }, // forgot quetiapine
  { med1: [true,true], med2: [true], med3: [true] },
  { med1: [true,false], med2: [true], med3: [true] }, // missed evening lithium (social event)
  { med1: [true,true], med2: [false], med3: [true] }, // missed lamotrigine
  { med1: [true,true], med2: [true], med3: [true] },
  { med1: [true,true], med2: [true], med3: [true] },
  { med1: [false,true], med2: [true], med3: [true] }, // slept through morning
  { med1: [true,true], med2: [true], med3: [true] },
  { med1: [true,true], med2: [true], med3: [true] },
  { med1: [true,true], med2: [true], med3: [false] }, // forgot again
  { med1: [true,true], med2: [true], med3: [true] }
];

for (let i = 0; i < sampleAdherence.length; i++) {
  const d = new Date(baseDate); d.setDate(d.getDate() + i);
  adherenceHistory.push({
    date: d.toISOString().slice(0,10),
    doses: sampleAdherence[i]
  });
}

// Today's taken state
let todayTaken = {};
medications.forEach(m => {
  const doseCount = m.frequency === 'twice' ? 2 : m.frequency === 'three' ? 3 : 1;
  todayTaken[m.id] = new Array(doseCount).fill(false);
});

// --- Side Effects ---
let sideEffects = [
  { date: '2026-03-20', medId: 'med1', type: 'tremor', severity: 2, notes: 'Mild hand tremor in the morning' },
  { date: '2026-03-22', medId: 'med3', type: 'drowsiness', severity: 3, notes: 'Hard to wake up, felt groggy until 10am' },
  { date: '2026-03-24', medId: 'med1', type: 'thirst', severity: 2, notes: 'Drinking much more water than usual' },
  { date: '2026-03-25', medId: 'med3', type: 'weight-gain', severity: 2, notes: 'Increased appetite, especially at night' },
  { date: '2026-03-27', medId: 'med1', type: 'tremor', severity: 3, notes: 'Tremor worse today, spilled coffee' },
  { date: '2026-03-28', medId: 'med3', type: 'drowsiness', severity: 4, notes: 'Could not function until noon' },
  { date: '2026-03-30', medId: 'med2', type: 'headache', severity: 2, notes: 'Dull headache in the afternoon' },
  { date: '2026-03-31', medId: 'med1', type: 'cognitive-fog', severity: 2, notes: 'Felt mentally sluggish' },
  { date: '2026-04-01', medId: 'med3', type: 'drowsiness', severity: 3, notes: 'Morning grogginess, improving by afternoon' }
];

// --- Effectiveness ratings (weekly) ---
let effectivenessHistory = [
  { week: 'Mar 17', ratings: { med1: 4, med2: 3, med3: 3 } },
  { week: 'Mar 24', ratings: { med1: 4, med2: 4, med3: 2 } }
];
let currentEffectiveness = {};
medications.forEach(m => currentEffectiveness[m.id] = 3);
let currentSeverity = 3;

// --- Tab Navigation ---
document.querySelectorAll('.app-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.app-tab').forEach(t => { t.classList.remove('app-tab--active'); t.setAttribute('aria-selected','false'); });
    tab.classList.add('app-tab--active'); tab.setAttribute('aria-selected','true');
    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = true);
    const panel = document.querySelector(`[data-panel="${tab.dataset.tab}"]`);
    if (panel) {
      panel.hidden = false;
      if (tab.dataset.tab === 'medications') renderMedList();
      if (tab.dataset.tab === 'adherence') renderAdherence();
      if (tab.dataset.tab === 'sideeffects') renderSideEffects();
      if (tab.dataset.tab === 'effectiveness') renderEffectiveness();
    }
  });
});

// --- Date ---
document.getElementById('today-date').textContent = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

// --- Today's Meds ---
function renderToday() {
  const list = document.getElementById('today-list');
  let html = '';
  medications.forEach(m => {
    const doses = todayTaken[m.id] || [false];
    const labels = m.frequency === 'twice' ? ['Morning','Evening'] : m.frequency === 'three' ? ['Morning','Afternoon','Evening'] : [freqLabel(m.frequency)];
    doses.forEach((taken, i) => {
      html += `
      <div class="today-item ${taken ? 'today-item--taken' : ''}">
        <button class="today-item__check ${taken ? 'today-item__check--done' : ''}" data-med="${m.id}" data-dose="${i}" aria-label="${taken ? 'Taken' : 'Not taken'}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
        <div class="today-item__info">
          <div class="today-item__name">${esc(m.name)} ${esc(m.dose)}</div>
          <div class="today-item__detail">${labels[i]}</div>
        </div>
        <span class="today-item__time">${formatTime12(m.time)}</span>
      </div>`;
    });
  });
  list.innerHTML = html;

  list.querySelectorAll('.today-item__check').forEach(btn => {
    btn.addEventListener('click', () => {
      const { med, dose } = btn.dataset;
      todayTaken[med][parseInt(dose)] = !todayTaken[med][parseInt(dose)];
      renderToday();
      updateSummary();
    });
  });

  // Populate side effect med dropdown
  const sel = document.getElementById('se-med');
  sel.innerHTML = medications.map(m => `<option value="${m.id}">${esc(m.name)}</option>`).join('');
}

// --- Summary ---
function updateSummary() {
  const last7 = adherenceHistory.slice(-7);
  let totalDoses = 0, takenDoses = 0;
  last7.forEach(day => {
    Object.values(day.doses).forEach(doses => {
      doses.forEach(d => { totalDoses++; if (d) takenDoses++; });
    });
  });
  const pct = totalDoses > 0 ? Math.round(takenDoses / totalDoses * 100) : 0;
  document.getElementById('adherence-pct').textContent = pct + '%';

  const circ = 2 * Math.PI * 34;
  const ring = document.getElementById('adherence-ring');
  ring.style.strokeDashoffset = circ * (1 - pct / 100);
  ring.style.stroke = pct >= 90 ? '#5B8C5A' : pct >= 70 ? '#E8A838' : '#D4776B';
  document.getElementById('adherence-pct').style.color = pct >= 90 ? '#5B8C5A' : pct >= 70 ? '#E8A838' : '#D4776B';

  // Streak
  let streak = 0;
  for (let i = adherenceHistory.length - 1; i >= 0; i--) {
    const allTaken = Object.values(adherenceHistory[i].doses).every(d => d.every(Boolean));
    if (allTaken) streak++; else break;
  }
  document.getElementById('streak-count').textContent = streak;

  // Missed this week
  let missed = 0;
  last7.forEach(day => { Object.values(day.doses).forEach(d => { d.forEach(v => { if (!v) missed++; }); }); });
  document.getElementById('missed-count').textContent = missed;
}

// --- Severity Buttons ---
document.querySelectorAll('#severity-btns .sev-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#severity-btns .sev-btn').forEach(b => b.classList.remove('sev-btn--active'));
    btn.classList.add('sev-btn--active');
    currentSeverity = parseInt(btn.dataset.val);
  });
});

// --- Side Effect Form ---
document.getElementById('side-effect-form').addEventListener('submit', e => {
  e.preventDefault();
  sideEffects.push({
    date: new Date().toISOString().slice(0,10),
    medId: document.getElementById('se-med').value,
    type: document.getElementById('se-type').value,
    severity: currentSeverity,
    notes: document.getElementById('se-notes').value
  });
  document.getElementById('se-notes').value = '';
  showToast();
});

// --- Add Medication ---
document.getElementById('add-med-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('med-name').value.trim();
  const dose = document.getElementById('med-dose').value.trim();
  if (!name) return;
  const id = 'med_' + Date.now();
  medications.push({
    id, name, dose,
    frequency: document.getElementById('med-freq').value,
    time: document.getElementById('med-time').value,
    color: MED_COLORS[medications.length % MED_COLORS.length]
  });
  const cnt = medications[medications.length-1].frequency === 'twice' ? 2 : medications[medications.length-1].frequency === 'three' ? 3 : 1;
  todayTaken[id] = new Array(cnt).fill(false);
  currentEffectiveness[id] = 3;
  document.getElementById('med-name').value = '';
  document.getElementById('med-dose').value = '';
  renderMedList();
  renderToday();
});

// --- Med List ---
function renderMedList() {
  const el = document.getElementById('med-list');
  el.innerHTML = medications.map(m => `
    <div class="med-card">
      <div class="med-card__color" style="background:${m.color}"></div>
      <div class="med-card__info">
        <div class="med-card__name">${esc(m.name)} ${esc(m.dose)}</div>
        <div class="med-card__details">${freqLabel(m.frequency)} at ${formatTime12(m.time)}</div>
      </div>
      <button class="med-card__remove" data-id="${m.id}" aria-label="Remove">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `).join('');
  el.querySelectorAll('.med-card__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      medications = medications.filter(m => m.id !== btn.dataset.id);
      delete todayTaken[btn.dataset.id];
      delete currentEffectiveness[btn.dataset.id];
      renderMedList(); renderToday();
    });
  });
}

// --- Adherence Charts ---
let adherenceChart = null, perMedChart = null;
function renderAdherence() {
  const last14 = adherenceHistory.slice(-14);
  const labels = last14.map(h => { const d = new Date(h.date+'T00:00:00'); return d.toLocaleDateString('en-US',{month:'short',day:'numeric'}); });

  // Daily adherence %
  const dailyPct = last14.map(day => {
    let total = 0, taken = 0;
    Object.values(day.doses).forEach(d => { d.forEach(v => { total++; if(v) taken++; }); });
    return total > 0 ? Math.round(taken/total*100) : 0;
  });

  if (adherenceChart) adherenceChart.destroy();
  adherenceChart = new Chart(document.getElementById('adherence-chart').getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Adherence %',
        data: dailyPct,
        backgroundColor: dailyPct.map(p => p >= 100 ? 'rgba(91,140,90,0.6)' : p >= 50 ? 'rgba(232,168,56,0.6)' : 'rgba(212,119,107,0.6)'),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, ticks: { color: '#6E6B7B', callback: v => v+'%' }, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { ticks: { color: '#6E6B7B', font: { size: 10 } }, grid: { display: false } }
      }
    }
  });

  // Per-medication adherence
  const medPcts = medications.map(m => {
    let total = 0, taken = 0;
    last14.forEach(day => {
      const doses = day.doses[m.id];
      if (doses) doses.forEach(v => { total++; if(v) taken++; });
    });
    return total > 0 ? Math.round(taken/total*100) : 0;
  });

  if (perMedChart) perMedChart.destroy();
  perMedChart = new Chart(document.getElementById('per-med-chart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: medications.map(m => m.name),
      datasets: [{
        data: medPcts,
        backgroundColor: medications.map(m => m.color + '99'),
        borderColor: medications.map(m => m.color),
        borderWidth: 1, borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: { min: 0, max: 100, ticks: { color: '#6E6B7B', callback: v => v+'%' }, grid: { color: 'rgba(0,0,0,0.05)' } },
        y: { ticks: { color: '#6E6B7B' }, grid: { display: false } }
      }
    }
  });

  // Missed patterns by day of week
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const missedByDay = new Array(7).fill(0);
  const totalByDay = new Array(7).fill(0);
  adherenceHistory.forEach(h => {
    const dow = new Date(h.date+'T00:00:00').getDay();
    Object.values(h.doses).forEach(d => { d.forEach(v => { totalByDay[dow]++; if(!v) missedByDay[dow]++; }); });
  });

  const maxMissed = Math.max(...missedByDay, 1);
  document.getElementById('missed-patterns').innerHTML = dayNames.map((name, i) => `
    <div class="missed-item">
      <span class="missed-item__day">${name}</span>
      <div class="missed-item__bar"><div class="missed-item__fill" style="width:${missedByDay[i]/maxMissed*100}%"></div></div>
      <span class="missed-item__count">${missedByDay[i]} missed</span>
    </div>
  `).join('');
}

// --- Side Effects ---
let seChart = null;
function renderSideEffects() {
  // Chart
  const last14Dates = [];
  const d = new Date(baseDate);
  for (let i = 0; i < 14; i++) { const nd = new Date(d); nd.setDate(d.getDate()+i); last14Dates.push(nd.toISOString().slice(0,10)); }

  const seByDate = {};
  last14Dates.forEach(date => seByDate[date] = []);
  sideEffects.forEach(se => { if (seByDate[se.date]) seByDate[se.date].push(se); });

  const labels = last14Dates.map(date => { const dd = new Date(date+'T00:00:00'); return dd.toLocaleDateString('en-US',{month:'short',day:'numeric'}); });
  const avgSeverity = last14Dates.map(date => {
    const entries = seByDate[date];
    return entries.length > 0 ? entries.reduce((s,e) => s+e.severity, 0) / entries.length : 0;
  });

  if (seChart) seChart.destroy();
  seChart = new Chart(document.getElementById('se-chart').getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Avg Side Effect Severity',
        data: avgSeverity,
        borderColor: '#D4776B',
        backgroundColor: 'rgba(212,119,107,0.1)',
        fill: true, tension: 0.3, pointRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 5, ticks: { color: '#6E6B7B', stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { ticks: { color: '#6E6B7B', font: { size: 10 } }, grid: { display: false } }
      }
    }
  });

  // Log
  const log = document.getElementById('se-log');
  log.innerHTML = sideEffects.slice().reverse().map(se => {
    const med = medications.find(m => m.id === se.medId);
    const date = new Date(se.date+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'});
    return `
    <div class="se-entry">
      <div class="se-entry__severity se-entry__severity--${se.severity}">${se.severity}</div>
      <div class="se-entry__body">
        <div class="se-entry__title">${esc(se.type.replace(/-/g,' '))} -- ${med ? esc(med.name) : 'Unknown'}</div>
        <div class="se-entry__meta">${date}${se.notes ? ' -- '+esc(se.notes) : ''}</div>
      </div>
    </div>`;
  }).join('');
}

// --- Effectiveness ---
let effChart = null;
function renderEffectiveness() {
  const list = document.getElementById('effectiveness-list');
  list.innerHTML = medications.map(m => {
    const rating = currentEffectiveness[m.id] || 3;
    return `
    <div class="eff-item">
      <span class="eff-item__name">${esc(m.name)} ${esc(m.dose)}</span>
      <div class="eff-item__stars">
        ${[1,2,3,4,5].map(v => `<button class="star-btn ${v <= rating ? 'star-btn--active' : ''}" data-med="${m.id}" data-val="${v}" aria-label="${v} stars">&#9733;</button>`).join('')}
      </div>
    </div>`;
  }).join('');

  list.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentEffectiveness[btn.dataset.med] = parseInt(btn.dataset.val);
      renderEffectiveness();
    });
  });

  document.getElementById('save-effectiveness').onclick = () => {
    effectivenessHistory.push({
      week: new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'}),
      ratings: { ...currentEffectiveness }
    });
    showToast();
    renderEffectivenessChart();
  };

  renderEffectivenessChart();
}

function renderEffectivenessChart() {
  const labels = effectivenessHistory.map(h => h.week);
  const datasets = medications.map((m, i) => ({
    label: m.name,
    data: effectivenessHistory.map(h => h.ratings[m.id] || 0),
    borderColor: m.color,
    backgroundColor: m.color + '20',
    tension: 0.3, pointRadius: 5, fill: false
  }));

  if (effChart) effChart.destroy();
  effChart = new Chart(document.getElementById('effectiveness-chart').getContext('2d'), {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#6E6B7B', usePointStyle: true, pointStyle: 'circle' } } },
      scales: {
        y: { min: 0, max: 5, ticks: { color: '#6E6B7B', stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { ticks: { color: '#6E6B7B' }, grid: { display: false } }
      }
    }
  });
}

// --- Helpers ---
function freqLabel(f) {
  const map = { 'once-morning': 'Once daily (morning)', 'once-evening': 'Once daily (evening)', 'twice': 'Twice daily', 'three': 'Three times daily', 'as-needed': 'As needed' };
  return map[f] || f;
}
function formatTime12(t) {
  if (!t) return '--';
  const [h,m] = t.split(':').map(Number);
  return (h%12||12) + ':' + String(m).padStart(2,'0') + (h>=12?' PM':' AM');
}
function esc(s) { const d = document.createElement('div'); d.textContent = s||''; return d.innerHTML; }
function showToast() {
  const t = document.getElementById('save-toast');
  t.hidden = false; t.classList.add('toast--visible');
  setTimeout(() => { t.classList.remove('toast--visible'); setTimeout(() => t.hidden = true, 300); }, 2000);
}

// --- Init ---
renderToday();
updateSummary();
