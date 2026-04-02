/* ==========================================================================
   App 12: Integrated Command Center -- Logic
   ========================================================================== */

// --- Sample week data across all domains ---
const DAYS = ['Mar 27','Mar 28','Mar 29','Mar 30','Mar 31','Apr 01','Apr 02'];

const DATA = {
  mood:      [1, 0, -1, -1, 0, 1, 1],        // -4 to +4 scale
  sleep:     [7.5, 6.5, 5.5, 6.0, 7.0, 7.5, 8.0], // hours
  medAdhere: [100, 100, 75, 100, 100, 100, 100],    // percentage
  rhythmIdx: [4.2, 4.0, 2.8, 3.0, 3.5, 4.0, 4.3],  // 0-5
  warnScore: [3, 5, 12, 10, 7, 4, 3],                // 0-60
  qol:       { physical:3.5, sleep:3.5, mood:3.75, cognition:3.25, leisure:3.75, social:4.0, spirituality:3.5, finance:3.75, household:3.0, 'self-esteem':3.25, independence:3.75, identity:3.25 },
  cbtRecords: 3,
  exercises:  8,
  lightSessions: 5,
  crisisPlanComplete: true
};

const APPS = [
  { num:'01', title:'Mood Spectrum Tracker', desc:'Daily mood charting', path:'../01-mood-tracker/index.html', color:'#3B5998' },
  { num:'02', title:'Circadian Rhythm Analyzer', desc:'Sleep/wake patterns', path:'../02-circadian/index.html', color:'#7C6DAF' },
  { num:'03', title:'Cognitive Patterns Journal', desc:'CBT thought records', path:'../03-cbt-journal/index.html', color:'#E8A838' },
  { num:'04', title:'Early Warning Detector', desc:'Prodromal monitoring', path:'../04-warning-signals/index.html', color:'#D4776B' },
  { num:'05', title:'Social Rhythm Stabilizer', desc:'IPSRT routine tracking', path:'../05-social-rhythm/index.html', color:'#5B8C5A' },
  { num:'06', title:'Medication Tracker', desc:'Adherence and side effects', path:'../06-medication/index.html', color:'#3B5998' },
  { num:'07', title:'Quality of Life Dashboard', desc:'12-domain QoL.BD', path:'../07-qol-dashboard/index.html', color:'#7C6DAF' },
  { num:'08', title:'Psychoeducation Library', desc:'Evidence-based learning', path:'../08-psychoeducation/index.html', color:'#E8A838' },
  { num:'09', title:'Chronotherapy Planner', desc:'Light and wake therapy', path:'../09-chronotherapy/index.html', color:'#D4776B' },
  { num:'10', title:'Crisis & Support Planner', desc:'Safety planning', path:'../10-crisis-planner/index.html', color:'#5B8C5A' },
  { num:'11', title:'Functional Remediation', desc:'Cognitive training', path:'../11-functional-rehab/index.html', color:'#3B5998' },
  { num:'12', title:'Command Center', desc:'This dashboard', path:'#', color:'#7C6DAF' }
];

let moodChart = null, radarChart = null, corrChart = null, rhythmWarnChart = null;

// --- Tab Navigation ---
document.querySelectorAll('.app-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.app-tab').forEach(t => { t.classList.remove('app-tab--active'); t.setAttribute('aria-selected','false'); });
    tab.classList.add('app-tab--active'); tab.setAttribute('aria-selected','true');
    document.querySelectorAll('.tab-panel').forEach(p => p.hidden = true);
    const panel = document.querySelector(`[data-panel="${tab.dataset.tab}"]`);
    if (panel) {
      panel.hidden = false;
      if (tab.dataset.tab === 'overview') renderOverview();
      if (tab.dataset.tab === 'correlations') renderCorrelations();
      if (tab.dataset.tab === 'timeline') renderTimeline();
      if (tab.dataset.tab === 'report') renderReport();
      if (tab.dataset.tab === 'navigate') renderNavGrid();
    }
  });
});

// === OVERVIEW ===
function renderOverview() {
  renderKPIs();
  renderMoodChart();
  renderQoLRadar();
  renderInsights();
}

function renderKPIs() {
  const avgMood = (DATA.mood.reduce((s,v)=>s+v,0)/DATA.mood.length).toFixed(1);
  const avgSleep = (DATA.sleep.reduce((s,v)=>s+v,0)/DATA.sleep.length).toFixed(1);
  const avgMedAdh = Math.round(DATA.medAdhere.reduce((s,v)=>s+v,0)/DATA.medAdhere.length);
  const avgRhythm = (DATA.rhythmIdx.reduce((s,v)=>s+v,0)/DATA.rhythmIdx.length).toFixed(1);
  const latestWarn = DATA.warnScore[DATA.warnScore.length - 1];
  const avgQol = (Object.values(DATA.qol).reduce((s,v)=>s+v,0)/Object.values(DATA.qol).length).toFixed(1);
  const warnLevel = latestWarn <= 8 ? 'Stable' : latestWarn <= 18 ? 'Caution' : 'Alert';
  const warnColor = latestWarn <= 8 ? '#5B8C5A' : latestWarn <= 18 ? '#E8A838' : '#D4776B';

  const kpis = [
    { label:'Avg Mood', value: avgMood > 0 ? '+'+avgMood : avgMood, color:'#3B5998', trend:'up', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
    { label:'Avg Sleep', value: avgSleep+'h', color:'#7C6DAF', trend: parseFloat(avgSleep)>=7?'up':'down', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' },
    { label:'Med Adherence', value: avgMedAdh+'%', color:'#5B8C5A', trend: avgMedAdh>=90?'up':'down', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>' },
    { label:'Rhythm Index', value: avgRhythm+'/5', color:'#E8A838', trend: parseFloat(avgRhythm)>=3.5?'up':'down', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' },
    { label:'Warning Signs', value: warnLevel, color: warnColor, trend: latestWarn<=8?'stable':latestWarn<=18?'down':'down', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' },
    { label:'Quality of Life', value: avgQol+'/5', color:'#7C6DAF', trend:'up', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>' }
  ];

  document.getElementById('kpi-grid').innerHTML = kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-card__icon" style="background:${k.color}15;color:${k.color}">${k.icon}</div>
      <div class="kpi-card__value" style="color:${k.color}">${k.value}</div>
      <div class="kpi-card__label">${k.label}</div>
      <div class="kpi-card__trend kpi-card__trend--${k.trend}">${k.trend==='up'?'Improving':k.trend==='down'?'Declining':'Stable'}</div>
    </div>
  `).join('');
}

function renderMoodChart() {
  if (moodChart) moodChart.destroy();
  moodChart = new Chart(document.getElementById('mood-chart').getContext('2d'), {
    type: 'line',
    data: {
      labels: DAYS,
      datasets: [{
        label: 'Mood', data: DATA.mood,
        borderColor: '#3B5998', backgroundColor: 'rgba(59,89,152,0.1)',
        fill: true, tension: 0.3, pointRadius: 5,
        pointBackgroundColor: DATA.mood.map(m => m >= 1 ? '#E8A838' : m <= -1 ? '#3B5998' : '#5B8C5A')
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: -4, max: 4, ticks: { color: '#6E6B7B', stepSize: 1, callback: v => v > 0 ? '+'+v : v }, grid: { color: 'rgba(0,0,0,0.05)' } },
        x: { ticks: { color: '#6E6B7B' }, grid: { display: false } }
      }
    }
  });
}

function renderQoLRadar() {
  const labels = Object.keys(DATA.qol).map(k => k.charAt(0).toUpperCase() + k.slice(1).replace('-',' '));
  const values = Object.values(DATA.qol);
  if (radarChart) radarChart.destroy();
  radarChart = new Chart(document.getElementById('qol-radar').getContext('2d'), {
    type: 'radar',
    data: {
      labels,
      datasets: [{ label: 'QoL', data: values, borderColor: '#7C6DAF', backgroundColor: 'rgba(124,109,175,0.15)', pointBackgroundColor: '#7C6DAF', pointRadius: 4, borderWidth: 2 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { r: { min: 0, max: 5, ticks: { stepSize: 1, color: '#6E6B7B', backdropColor: 'transparent', font: { size: 9 } }, grid: { color: 'rgba(0,0,0,0.06)' }, pointLabels: { color: '#6E6B7B', font: { size: 10 } } } }
    }
  });
}

function renderInsights() {
  const insights = [
    { type:'positive', title:'Mood is trending upward', text:'Your mood has improved from -1 to +1 over the past 4 days, coinciding with improved sleep consistency.' },
    { type:'warning', title:'Sleep dipped mid-week', text:'On Mar 29, sleep dropped to 5.5 hours. This correlated with a mood dip the following day. Sleep disruption remains your most sensitive trigger.' },
    { type:'positive', title:'Medication adherence is strong', text:'96% adherence this week. The only partial day was Mar 29 (75%). Consistent adherence supports the mood improvement trend.' },
    { type:'info', title:'Social rhythm recovery', text:'Your rhythm index dropped to 2.8 on Mar 29 but has recovered to 4.3. This recovery took 4 days -- faster than your historical average of 6 days.' },
    { type:'positive', title:'Warning signs are decreasing', text:'Warning sign score peaked at 12 on Mar 29 and has returned to 3. Your early intervention appears to have been effective.' },
    { type:'info', title:'CBT and exercise activity', text:'You completed 3 thought records and 8 cognitive exercises this week. Regular use of these tools correlates with better functioning scores.' },
    { type:'alert', title:'Pattern to monitor', text:'The mid-week disruption followed a pattern: reduced sleep -> mood dip -> increased warning signs -> rhythm disruption. Protecting sleep on high-stress days may prevent this cascade.' }
  ];

  document.getElementById('insights-list').innerHTML = insights.map(i => `
    <div class="insight-item">
      <div class="insight-item__icon insight-item__icon--${i.type}">${i.type==='positive'?'+':i.type==='warning'?'!':i.type==='alert'?'!!':'i'}</div>
      <div class="insight-item__body">
        <div class="insight-item__title">${i.title}</div>
        <div class="insight-item__text">${i.text}</div>
      </div>
    </div>
  `).join('');
}

// === CORRELATIONS ===
function renderCorrelations() {
  if (corrChart) corrChart.destroy();
  corrChart = new Chart(document.getElementById('corr-chart').getContext('2d'), {
    type: 'line',
    data: {
      labels: DAYS,
      datasets: [
        { label: 'Mood (-4 to +4)', data: DATA.mood, borderColor: '#3B5998', backgroundColor: 'rgba(59,89,152,0.05)', yAxisID: 'y', tension: 0.3, pointRadius: 4, borderWidth: 2 },
        { label: 'Sleep (hours)', data: DATA.sleep, borderColor: '#7C6DAF', backgroundColor: 'rgba(124,109,175,0.05)', yAxisID: 'y1', tension: 0.3, pointRadius: 4, borderWidth: 2 },
        { label: 'Med Adherence (%)', data: DATA.medAdhere, borderColor: '#5B8C5A', backgroundColor: 'rgba(91,140,90,0.05)', yAxisID: 'y2', tension: 0.3, pointRadius: 4, borderWidth: 2, borderDash: [5, 3] }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { labels: { color: '#6E6B7B', usePointStyle: true, pointStyle: 'circle', font: { size: 11 } } } },
      scales: {
        y:  { type: 'linear', display: true, position: 'left', min: -4, max: 4, ticks: { color: '#3B5998', stepSize: 2 }, grid: { color: 'rgba(0,0,0,0.05)' }, title: { display: true, text: 'Mood', color: '#3B5998', font: { size: 10 } } },
        y1: { type: 'linear', display: true, position: 'right', min: 4, max: 10, ticks: { color: '#7C6DAF' }, grid: { drawOnChartArea: false }, title: { display: true, text: 'Sleep (hrs)', color: '#7C6DAF', font: { size: 10 } } },
        y2: { type: 'linear', display: false, min: 0, max: 100 },
        x: { ticks: { color: '#6E6B7B' }, grid: { display: false } }
      }
    }
  });

  if (rhythmWarnChart) rhythmWarnChart.destroy();
  rhythmWarnChart = new Chart(document.getElementById('rhythm-warn-chart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: DAYS,
      datasets: [
        { label: 'Rhythm Index (0-5)', data: DATA.rhythmIdx, backgroundColor: 'rgba(232,168,56,0.5)', borderColor: '#E8A838', borderWidth: 1, borderRadius: 3, yAxisID: 'y' },
        { label: 'Warning Score', data: DATA.warnScore, type: 'line', borderColor: '#D4776B', backgroundColor: 'rgba(212,119,107,0.1)', fill: true, tension: 0.3, pointRadius: 4, yAxisID: 'y1' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#6E6B7B', usePointStyle: true, pointStyle: 'circle' } } },
      scales: {
        y:  { min: 0, max: 5, ticks: { color: '#E8A838', stepSize: 1 }, grid: { color: 'rgba(0,0,0,0.05)' } },
        y1: { position: 'right', min: 0, max: 20, ticks: { color: '#D4776B' }, grid: { drawOnChartArea: false } },
        x: { ticks: { color: '#6E6B7B' }, grid: { display: false } }
      }
    }
  });
}

// === TIMELINE ===
function renderTimeline() {
  const events = [
    { day:0, time:'07:00', app:'Mood', cls:'mood', text:'Morning mood logged: +1 (baseline)' },
    { day:0, time:'07:30', app:'Light', cls:'exercise', text:'30 min bright light therapy session' },
    { day:0, time:'08:00', app:'Meds', cls:'med', text:'Lithium 300mg, Lamotrigine 200mg taken' },
    { day:0, time:'22:30', app:'Sleep', cls:'sleep', text:'Bedtime logged. Sleep quality: 4/5' },
    { day:1, time:'07:15', app:'Mood', cls:'mood', text:'Mood: 0 (baseline). Slight fatigue.' },
    { day:1, time:'08:00', app:'Meds', cls:'med', text:'All medications taken on time' },
    { day:1, time:'14:00', app:'CBT', cls:'cbt', text:'Thought record: challenged catastrophizing' },
    { day:1, time:'22:00', app:'Sleep', cls:'sleep', text:'Bedtime. Only 6.5 hours sleep.' },
    { day:2, time:'07:00', app:'Mood', cls:'mood', text:'Mood: -1 (mild depression). Low energy.' },
    { day:2, time:'08:00', app:'Meds', cls:'med', text:'Missed evening lithium dose (75% adherence)' },
    { day:2, time:'10:00', app:'Warning', cls:'warning', text:'Warning score: 12 (yellow zone)' },
    { day:2, time:'15:00', app:'CBT', cls:'cbt', text:'Thought record: emotional reasoning pattern' },
    { day:3, time:'07:30', app:'Mood', cls:'mood', text:'Mood: -1. Still low but stable.' },
    { day:3, time:'08:00', app:'Meds', cls:'med', text:'All medications taken. Back on track.' },
    { day:3, time:'12:00', app:'Rhythm', cls:'rhythm', text:'Rhythm index: 3.0 -- recovering from disruption' },
    { day:3, time:'17:00', app:'Exercise', cls:'exercise', text:'Completed 2 cognitive exercises' },
    { day:4, time:'07:00', app:'Mood', cls:'mood', text:'Mood: 0. Improvement noted.' },
    { day:4, time:'07:30', app:'Light', cls:'exercise', text:'Light therapy: 30 min at 10,000 lux' },
    { day:4, time:'09:00', app:'Rhythm', cls:'rhythm', text:'All 5 anchor activities on schedule' },
    { day:4, time:'16:00', app:'QoL', cls:'qol', text:'Weekly QoL assessment completed: 3.4/5' },
    { day:5, time:'07:00', app:'Mood', cls:'mood', text:'Mood: +1. Feeling better.' },
    { day:5, time:'08:00', app:'Meds', cls:'med', text:'Full adherence all day' },
    { day:5, time:'10:00', app:'Warning', cls:'warning', text:'Warning score: 4 (green zone)' },
    { day:5, time:'14:00', app:'CBT', cls:'cbt', text:'Thought record: reframed self-criticism' },
    { day:5, time:'17:00', app:'Exercise', cls:'exercise', text:'3 cognitive exercises completed' },
    { day:6, time:'07:00', app:'Mood', cls:'mood', text:'Mood: +1. Stable and energized.' },
    { day:6, time:'08:00', app:'Meds', cls:'med', text:'All medications taken' },
    { day:6, time:'09:00', app:'Rhythm', cls:'rhythm', text:'Rhythm index: 4.3 -- excellent consistency' },
    { day:6, time:'12:00', app:'Warning', cls:'warning', text:'Warning score: 3 (green zone)' }
  ];

  const grouped = {};
  events.forEach(e => {
    const dayLabel = DAYS[e.day];
    if (!grouped[dayLabel]) grouped[dayLabel] = [];
    grouped[dayLabel].push(e);
  });

  document.getElementById('timeline').innerHTML = Object.entries(grouped).map(([day, evts]) => `
    <div class="timeline-day">
      <h3 class="timeline-day__header">${day}</h3>
      <div class="timeline-events">
        ${evts.map(e => `
          <div class="tl-event tl-event--${e.cls}">
            <span class="tl-event__time">${e.time}</span>
            <span class="tl-event__app">${e.app}</span>
            <span class="tl-event__text">${e.text}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// === WEEKLY REPORT ===
function renderReport() {
  const avgMood = (DATA.mood.reduce((s,v)=>s+v,0)/DATA.mood.length).toFixed(1);
  const avgSleep = (DATA.sleep.reduce((s,v)=>s+v,0)/DATA.sleep.length).toFixed(1);
  const avgMedAdh = Math.round(DATA.medAdhere.reduce((s,v)=>s+v,0)/DATA.medAdhere.length);
  const avgRhythm = (DATA.rhythmIdx.reduce((s,v)=>s+v,0)/DATA.rhythmIdx.length).toFixed(1);
  const avgQol = (Object.values(DATA.qol).reduce((s,v)=>s+v,0)/Object.values(DATA.qol).length).toFixed(1);

  document.getElementById('report-content').innerHTML = `
    <h2 class="report__title">Weekly Wellness Report</h2>
    <p class="report__date">Week of March 27 -- April 2, 2026</p>

    <div class="report__section">
      <h3 class="report__section-title">Key Metrics</h3>
      <div class="report__metric"><span class="report__metric-label">Average Mood</span><span class="report__metric-value">${avgMood > 0 ? '+' : ''}${avgMood} (baseline to mildly positive)</span></div>
      <div class="report__metric"><span class="report__metric-label">Average Sleep</span><span class="report__metric-value">${avgSleep} hours/night</span></div>
      <div class="report__metric"><span class="report__metric-label">Medication Adherence</span><span class="report__metric-value">${avgMedAdh}%</span></div>
      <div class="report__metric"><span class="report__metric-label">Rhythm Regularity</span><span class="report__metric-value">${avgRhythm}/5.0</span></div>
      <div class="report__metric"><span class="report__metric-label">Quality of Life</span><span class="report__metric-value">${avgQol}/5.0</span></div>
      <div class="report__metric"><span class="report__metric-label">Warning Sign Status</span><span class="report__metric-value">Green (score: 3)</span></div>
      <div class="report__metric"><span class="report__metric-label">CBT Thought Records</span><span class="report__metric-value">${DATA.cbtRecords} this week</span></div>
      <div class="report__metric"><span class="report__metric-label">Cognitive Exercises</span><span class="report__metric-value">${DATA.exercises} completed</span></div>
      <div class="report__metric"><span class="report__metric-label">Light Therapy Sessions</span><span class="report__metric-value">${DATA.lightSessions} of 7 days</span></div>
      <div class="report__metric"><span class="report__metric-label">Safety Plan</span><span class="report__metric-value">${DATA.crisisPlanComplete ? 'Complete and current' : 'Needs update'}</span></div>
    </div>

    <div class="report__section">
      <h3 class="report__section-title">Week Summary</h3>
      <p class="report__text">This week showed a mid-week dip in mood and sleep (March 29) that triggered increased warning signs and rhythm disruption. The disruption was identified early through the Warning Signal Detector, and recovery was achieved within 4 days through medication adherence, sleep hygiene, and rhythm restoration.</p>
      <p class="report__text">Medication adherence was nearly perfect (96%), with only one partial day. Social rhythm index recovered from 2.8 to 4.3 by week end. Quality of life assessment showed improvement in most domains, with household and self-esteem as the primary growth areas.</p>
    </div>

    <div class="report__section">
      <h3 class="report__section-title">Patterns Identified</h3>
      <p class="report__text">1. Sleep disruption preceded mood decline by approximately 1 day -- consistent with your historical pattern.</p>
      <p class="report__text">2. Medication adherence drop coincided with sleep disruption, suggesting a compounding effect.</p>
      <p class="report__text">3. CBT thought records during the low period helped limit the depth of the mood dip.</p>
      <p class="report__text">4. Rhythm recovery was faster than your 4-week average (4 days vs 6 days), possibly due to earlier intervention.</p>
    </div>

    <div class="report__section">
      <h3 class="report__section-title">Recommendations for Next Week</h3>
      <p class="report__text">1. Continue protecting sleep -- consider adding a pre-bedtime alert on high-stress days.</p>
      <p class="report__text">2. Maintain current medication schedule. Discuss the March 29 miss with your prescriber.</p>
      <p class="report__text">3. Focus on household management and self-esteem domains (your two lowest QoL areas).</p>
      <p class="report__text">4. Continue daily light therapy. You missed 2 sessions this week.</p>
      <p class="report__text">5. Share this report with your care team at your next appointment.</p>
    </div>
  `;
}

// Export
document.getElementById('export-btn').addEventListener('click', () => {
  const text = document.getElementById('report-content').innerText;
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'weekly-wellness-report.txt';
  a.click();
});

// === NAVIGATION GRID ===
function renderNavGrid() {
  document.getElementById('nav-grid').innerHTML = APPS.map(app => `
    <a href="${app.path}" class="nav-card" ${app.num==='12'?'style="opacity:0.5;pointer-events:none"':''}>
      <div class="nav-card__num" style="background:${app.color}">${app.num}</div>
      <div class="nav-card__body">
        <div class="nav-card__title">${app.title}</div>
        <div class="nav-card__desc">${app.desc}</div>
      </div>
      <svg class="nav-card__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </a>
  `).join('');
}

// === INIT ===
renderOverview();
