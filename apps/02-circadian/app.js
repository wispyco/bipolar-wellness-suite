/**
 * App 2: Circadian Rhythm Analyzer
 * Based on Social Rhythm Therapy and Chronobiology research
 * All data stored in-memory (no localStorage)
 */
(function () {
  'use strict';

  // ==========================================================================
  // Sample Data — 14 days: irregular → stabilizing → consistent
  // ==========================================================================
  function generateSleepData() {
    const data = [];
    const now = new Date();

    // Days 1-5: Irregular (hypomania — late nights, inconsistent, poor quality)
    const beds =    ['01:30','02:45','00:30','03:00','01:00', '00:15','23:45','23:30','23:00','22:45', '22:30','22:30','22:15','22:30'];
    const wakes =   ['09:00','10:30','07:00','11:00','08:30', '07:45','07:15','07:00','07:00','06:45', '07:00','06:45','07:00','07:00'];
    const quals =   [2,      1,      2,      1,      2,       3,      3,      3,      4,      4,       4,      5,      5,      5];
    const naps =    [true,   false,  true,   true,   true,    true,   false,  false,  false,  false,   false,  false,  false,  false];
    const napMins = [60,     0,      45,     90,     30,      20,     0,      0,      0,      0,       0,      0,      0,      0];
    const ints =    [3,      4,      2,      5,      3,       2,      2,      1,      1,      1,       0,      0,      0,      0];
    const notes =   [
      'Racing thoughts kept me up. Hypomania building — couldn\'t shut my mind off.',
      'Didn\'t feel tired until 3am. Lots of creative ideas flowing. Only 4hrs sleep but felt wired.',
      'Tried to get to bed earlier but woke up multiple times. Restless.',
      'Worst night — stayed up working on a project. Crashed eventually but poor quality.',
      'Still erratic. Took a long nap which probably made night sleep worse.',
      'Starting to stabilize. Took melatonin at 11pm. Slightly better.',
      'Set an alarm and stuck to it. No nap today — felt tired but powered through.',
      'Therapist suggested strict 10pm wind-down. Felt better this morning.',
      'Good routine forming. Read for 30 min before bed instead of screens.',
      'Sleep improving noticeably. Woke feeling refreshed for first time in a week.',
      'Consistent pattern now. 10:30 bed, 7am wake. Mood is more stable.',
      'Excellent sleep. Deep and restorative. Morning routine feels automatic.',
      'Second great night in a row. The consistency is really helping my mood.',
      'Feeling well-rested and stable. Circadian rhythm feels back on track.'
    ];

    for (let i = 0; i < 14; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (13 - i));
      const dateStr = date.toISOString().split('T')[0];

      data.push({
        id: 'sleep-' + i,
        date: dateStr,
        bedtime: beds[i],
        waketime: wakes[i],
        quality: quals[i],
        nap: naps[i],
        napDuration: napMins[i],
        interruptions: ints[i],
        notes: notes[i]
      });
    }
    return data;
  }

  function generateSRMData() {
    const data = [];
    const now = new Date();

    // 7 days of SRM data — showing stabilization
    const anchors = [
      // day -6 (irregular)
      { bed: '09:30', contact: '10:00', work: '10:30', dinner: '20:00', sleep: '01:30',
        bedWho: 'alone', contactWho: 'others', workWho: 'alone', dinnerWho: 'alone', sleepWho: 'alone' },
      // day -5
      { bed: '10:45', contact: '11:30', work: '12:00', dinner: '21:30', sleep: '02:45',
        bedWho: 'alone', contactWho: 'others', workWho: 'others', dinnerWho: 'alone', sleepWho: 'alone' },
      // day -4
      { bed: '07:15', contact: '08:00', work: '09:00', dinner: '18:00', sleep: '00:30',
        bedWho: 'alone', contactWho: 'others', workWho: 'others', dinnerWho: 'others', sleepWho: 'alone' },
      // day -3 (stabilizing)
      { bed: '07:30', contact: '08:30', work: '09:00', dinner: '18:30', sleep: '23:00',
        bedWho: 'alone', contactWho: 'others', workWho: 'others', dinnerWho: 'others', sleepWho: 'alone' },
      // day -2
      { bed: '07:00', contact: '08:15', work: '09:00', dinner: '18:30', sleep: '22:45',
        bedWho: 'alone', contactWho: 'others', workWho: 'others', dinnerWho: 'alone', sleepWho: 'alone' },
      // day -1 (consistent)
      { bed: '07:00', contact: '08:00', work: '09:00', dinner: '18:15', sleep: '22:30',
        bedWho: 'alone', contactWho: 'others', workWho: 'others', dinnerWho: 'others', sleepWho: 'alone' },
      // today
      { bed: '07:00', contact: '08:30', work: '09:00', dinner: '18:30', sleep: '22:30',
        bedWho: 'alone', contactWho: 'others', workWho: 'others', dinnerWho: 'others', sleepWho: 'alone' },
    ];

    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      data.push({ id: 'srm-' + i, date: dateStr, ...anchors[i] });
    }
    return data;
  }

  // In-memory data stores
  let sleepEntries = generateSleepData();
  let srmEntries = generateSRMData();

  // ==========================================================================
  // Utility
  // ==========================================================================
  function timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  function minutesToTime(mins) {
    const h = Math.floor(((mins % 1440) + 1440) % 1440 / 60);
    const m = ((mins % 1440) + 1440) % 1440 % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function formatTimeDisplay(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
  }

  function getSleepDuration(bedtime, waketime) {
    let bedMin = timeToMinutes(bedtime);
    let wakeMin = timeToMinutes(waketime);
    if (wakeMin <= bedMin) wakeMin += 1440; // next day
    return (wakeMin - bedMin) / 60;
  }

  function formatDateShort(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function formatWeekday(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  }

  function qualityColor(q) {
    const colors = {
      1: '#C0392B',
      2: '#D4776B',
      3: '#E8A838',
      4: '#7CB87A',
      5: '#5B8C5A'
    };
    return colors[q] || '#E8A838';
  }

  function qualityLabel(q) {
    return ['', 'Very Poor', 'Poor', 'Fair', 'Good', 'Excellent'][q] || 'Unknown';
  }

  // ==========================================================================
  // Tab Management
  // ==========================================================================
  const tabs = document.querySelectorAll('.app-tab');
  const panels = document.querySelectorAll('.tab-panel');

  function switchTab(tabName) {
    tabs.forEach(t => {
      const active = t.dataset.tab === tabName;
      t.classList.toggle('app-tab--active', active);
      t.setAttribute('aria-selected', active);
    });
    panels.forEach(p => {
      const active = p.id === 'panel-' + tabName;
      p.classList.toggle('tab-panel--active', active);
    });
    if (tabName === 'chart') renderSleepChart();
    if (tabName === 'score') renderCircadianScore();
    if (tabName === 'srm') renderSRM();
    if (tabName === 'tips') renderTips();
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // ==========================================================================
  // Star Rating
  // ==========================================================================
  const starContainer = document.getElementById('qualityStars');
  if (starContainer) {
    const starBtns = starContainer.querySelectorAll('.star-btn');
    starBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.value);
        starBtns.forEach((b, i) => {
          const active = (i + 1) <= val;
          b.classList.toggle('star-btn--active', active);
          b.setAttribute('aria-checked', i + 1 === val ? 'true' : 'false');
        });
      });
    });
  }

  // ==========================================================================
  // Nap Toggle
  // ==========================================================================
  const napToggle = document.getElementById('napToggle');
  const napDurationGroup = document.getElementById('napDurationGroup');
  if (napToggle) {
    napToggle.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        napToggle.querySelectorAll('.toggle-btn').forEach(b => {
          b.classList.remove('toggle-btn--active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('toggle-btn--active');
        btn.setAttribute('aria-checked', 'true');
        napDurationGroup.style.display = btn.dataset.value === 'yes' ? 'flex' : 'none';
      });
    });
  }

  // ==========================================================================
  // Sleep Log Form Submission
  // ==========================================================================
  const form = document.getElementById('sleepEntryForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const activeStars = starContainer.querySelectorAll('.star-btn--active');
    const quality = activeStars.length;
    const napActive = napToggle.querySelector('.toggle-btn--active');
    const hasNap = napActive ? napActive.dataset.value === 'yes' : false;

    const entry = {
      id: 'sleep-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      bedtime: document.getElementById('bedtime').value,
      waketime: document.getElementById('waketime').value,
      quality: quality || 3,
      nap: hasNap,
      napDuration: hasNap ? parseInt(document.getElementById('napDuration').value) || 0 : 0,
      interruptions: parseInt(document.getElementById('interruptions').value) || 0,
      notes: document.getElementById('sleepNotes').value.trim() || null
    };

    sleepEntries.push(entry);
    showToast('Sleep log saved successfully');
  });

  // Toast
  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('toast--visible');
    setTimeout(() => toast.classList.remove('toast--visible'), 2500);
  }

  // ==========================================================================
  // Sleep Architecture Chart (Chart.js — Horizontal floating bars)
  // ==========================================================================
  let sleepChart = null;

  function renderSleepChart() {
    const ctx = document.getElementById('sleepArchChart');
    if (!ctx) return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(232,230,240,0.08)' : 'rgba(45,43,58,0.08)';
    const textColor = isDark ? '#A8A6B8' : '#6B697A';

    const sorted = [...sleepEntries].sort((a, b) => a.date.localeCompare(b.date));
    const last14 = sorted.slice(-14);

    const labels = last14.map(e => formatDateShort(e.date));

    // Convert times to decimal hours (bedtime as negative offset from midnight)
    // We'll use a scale from 18 (6 PM) to 36 (12 PM next day)
    // So 10PM = 22, midnight = 24, 6AM = 30, 12PM = 36
    function timeToDecimal(timeStr) {
      const [h, m] = timeStr.split(':').map(Number);
      let dec = h + m / 60;
      if (dec < 18) dec += 24; // wrap to next day for morning times
      return dec;
    }

    const bedDecimals = last14.map(e => timeToDecimal(e.bedtime));
    const wakeDecimals = last14.map(e => timeToDecimal(e.waketime));

    // Build floating bar data: each bar = [bedtime, waketime]
    const barData = last14.map((e, i) => [bedDecimals[i], wakeDecimals[i]]);
    const bgColors = last14.map(e => {
      const c = qualityColor(e.quality);
      return isDark ? c + 'CC' : c + 'AA';
    });
    const borderColors = last14.map(e => qualityColor(e.quality));

    if (sleepChart) sleepChart.destroy();

    sleepChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Sleep Window',
          data: barData,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#2A2A4A' : '#FFFFFF',
            titleColor: isDark ? '#E8E6F0' : '#2D2B3A',
            bodyColor: isDark ? '#A8A6B8' : '#6B697A',
            borderColor: isDark ? 'rgba(232,230,240,0.12)' : 'rgba(45,43,58,0.12)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            titleFont: { family: "'DM Serif Display', Georgia, serif", size: 14 },
            bodyFont: { family: "'Inter', sans-serif", size: 13 },
            callbacks: {
              title: function (items) {
                return items[0].label;
              },
              label: function (item) {
                const entry = last14[item.dataIndex];
                const dur = getSleepDuration(entry.bedtime, entry.waketime);
                return [
                  `Bed: ${formatTimeDisplay(entry.bedtime)}`,
                  `Wake: ${formatTimeDisplay(entry.waketime)}`,
                  `Duration: ${dur.toFixed(1)} hrs`,
                  `Quality: ${qualityLabel(entry.quality)} (${entry.quality}/5)`
                ];
              },
            },
          },
        },
        scales: {
          x: {
            min: 20,
            max: 36,
            ticks: {
              stepSize: 2,
              color: textColor,
              font: { family: "'Inter', sans-serif", size: 11 },
              callback: function (value) {
                const hour = value % 24;
                if (hour === 0) return '12 AM';
                if (hour === 12) return '12 PM';
                if (hour < 12) return hour + ' AM';
                return (hour - 12) + ' PM';
              }
            },
            grid: {
              color: function (context) {
                const val = context.tick.value;
                // Highlight target window (22 = 10PM, 30 = 6AM)
                if (val === 22 || val === 30) {
                  return isDark ? 'rgba(107,140,199,0.3)' : 'rgba(59,89,152,0.25)';
                }
                return gridColor;
              },
              lineWidth: function (context) {
                const val = context.tick.value;
                return (val === 22 || val === 30) ? 2 : 1;
              },
              drawOnChartArea: true,
            },
          },
          y: {
            ticks: {
              color: textColor,
              font: { family: "'Inter', sans-serif", size: 11 },
            },
            grid: { display: false },
          }
        }
      },
      plugins: [{
        id: 'targetWindow',
        beforeDraw: function (chart) {
          const { ctx: c, chartArea, scales } = chart;
          if (!chartArea) return;
          const xScale = scales.x;
          const left = xScale.getPixelForValue(22);
          const right = xScale.getPixelForValue(30);

          c.save();
          c.fillStyle = isDark ? 'rgba(107,140,199,0.06)' : 'rgba(59,89,152,0.04)';
          c.fillRect(left, chartArea.top, right - left, chartArea.height);
          c.restore();
        }
      }]
    });
  }

  // ==========================================================================
  // Circadian Score
  // ==========================================================================
  function renderCircadianScore() {
    const sorted = [...sleepEntries].sort((a, b) => a.date.localeCompare(b.date));
    const last14 = sorted.slice(-14);
    if (last14.length < 3) return;

    // Calculate standard deviations for bed/wake/duration
    function stdDev(arr) {
      const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
      const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
      return Math.sqrt(variance);
    }

    // Convert bedtimes to minutes (handling midnight crossover)
    const bedMinutes = last14.map(e => {
      let m = timeToMinutes(e.bedtime);
      if (m < 720) m += 1440; // if before noon, treat as past midnight
      return m;
    });

    const wakeMinutes = last14.map(e => timeToMinutes(e.waketime));
    const durations = last14.map(e => getSleepDuration(e.bedtime, e.waketime));

    const bedStd = stdDev(bedMinutes);
    const wakeStd = stdDev(wakeMinutes);
    const durStd = stdDev(durations);

    // Score each component: lower std dev = higher score
    // A perfectly consistent person would have 0 std dev = 100
    // Max reasonable std dev ~180min (3hrs) = 0
    function componentScore(std, maxStd) {
      return Math.max(0, Math.min(100, Math.round((1 - std / maxStd) * 100)));
    }

    const bedScore = componentScore(bedStd, 180);
    const wakeScore = componentScore(wakeStd, 180);
    const durScore = componentScore(durStd, 3);

    const overallScore = Math.round((bedScore + wakeScore + durScore) / 3);

    // Animate circular progress
    const scoreCircle = document.getElementById('scoreCircle');
    const scoreValue = document.getElementById('scoreValue');
    const interpretation = document.getElementById('scoreInterpretation');

    const circumference = 2 * Math.PI * 85; // r=85
    const offset = circumference - (overallScore / 100) * circumference;

    // Set color based on score
    let scoreColor;
    if (overallScore >= 80) scoreColor = 'var(--color-success)';
    else if (overallScore >= 60) scoreColor = 'var(--color-primary)';
    else if (overallScore >= 40) scoreColor = 'var(--color-accent)';
    else scoreColor = 'var(--color-warning)';

    scoreCircle.style.strokeDashoffset = offset;
    scoreCircle.style.stroke = scoreColor;
    scoreValue.textContent = overallScore;
    scoreValue.style.color = scoreColor;

    let interpText;
    if (overallScore >= 80) interpText = 'Excellent circadian consistency. Your sleep-wake rhythm is well-regulated, supporting mood stability.';
    else if (overallScore >= 60) interpText = 'Good consistency. Your rhythm is mostly regular with minor variations. Keep maintaining your schedule.';
    else if (overallScore >= 40) interpText = 'Moderate variability in your sleep-wake pattern. Consider tightening your schedule to support mood stability.';
    else interpText = 'High irregularity detected. Inconsistent sleep patterns can trigger mood episodes. Work with your care team on a sleep schedule.';
    interpretation.textContent = interpText;

    // Breakdown items
    const breakdown = document.getElementById('breakdownItems');
    const avgBed = bedMinutes.reduce((a, b) => a + b, 0) / bedMinutes.length;
    const avgWake = wakeMinutes.reduce((a, b) => a + b, 0) / wakeMinutes.length;
    const avgDur = durations.reduce((a, b) => a + b, 0) / durations.length;

    breakdown.innerHTML = `
      <div class="breakdown-item">
        <div class="breakdown-item__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </div>
        <div class="breakdown-item__info">
          <div class="breakdown-item__label">Bedtime Consistency</div>
          <div class="breakdown-item__bar">
            <div class="breakdown-item__bar-fill" style="width:${bedScore}%;background:${bedScore >= 70 ? 'var(--color-success)' : bedScore >= 40 ? 'var(--color-accent)' : 'var(--color-warning)'}"></div>
          </div>
          <div class="breakdown-item__detail">Avg: ${formatTimeDisplay(minutesToTime(Math.round(avgBed % 1440)))} &middot; Std Dev: ${Math.round(bedStd)} min</div>
        </div>
        <div class="breakdown-item__score">${bedScore}</div>
      </div>
      <div class="breakdown-item">
        <div class="breakdown-item__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
        </div>
        <div class="breakdown-item__info">
          <div class="breakdown-item__label">Wake Time Consistency</div>
          <div class="breakdown-item__bar">
            <div class="breakdown-item__bar-fill" style="width:${wakeScore}%;background:${wakeScore >= 70 ? 'var(--color-success)' : wakeScore >= 40 ? 'var(--color-accent)' : 'var(--color-warning)'}"></div>
          </div>
          <div class="breakdown-item__detail">Avg: ${formatTimeDisplay(minutesToTime(Math.round(avgWake)))} &middot; Std Dev: ${Math.round(wakeStd)} min</div>
        </div>
        <div class="breakdown-item__score">${wakeScore}</div>
      </div>
      <div class="breakdown-item">
        <div class="breakdown-item__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="breakdown-item__info">
          <div class="breakdown-item__label">Duration Consistency</div>
          <div class="breakdown-item__bar">
            <div class="breakdown-item__bar-fill" style="width:${durScore}%;background:${durScore >= 70 ? 'var(--color-success)' : durScore >= 40 ? 'var(--color-accent)' : 'var(--color-warning)'}"></div>
          </div>
          <div class="breakdown-item__detail">Avg: ${avgDur.toFixed(1)} hrs &middot; Std Dev: ${(durStd * 60).toFixed(0)} min</div>
        </div>
        <div class="breakdown-item__score">${durScore}</div>
      </div>
    `;
  }

  // ==========================================================================
  // Social Rhythm Metric (SRM-5)
  // ==========================================================================
  function renderSRM() {
    renderSRMRegularity();
    renderSRMTimeline();
  }

  // Save SRM entry
  const saveSrmBtn = document.getElementById('saveSrmBtn');
  if (saveSrmBtn) {
    saveSrmBtn.addEventListener('click', () => {
      const entry = {
        id: 'srm-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
      };
      const anchors = ['bed', 'contact', 'work', 'dinner', 'sleep'];
      anchors.forEach(a => {
        const timeEl = document.querySelector(`.srm-time[data-anchor="${a}"]`);
        const whoEl = document.querySelector(`.srm-who[data-anchor="${a}"]`);
        entry[a] = timeEl ? timeEl.value : '00:00';
        entry[a + 'Who'] = whoEl ? whoEl.value : 'alone';
      });
      srmEntries.push(entry);
      showToast('Rhythm entry saved');
      renderSRM();
    });
  }

  function renderSRMRegularity() {
    const scoreEl = document.getElementById('srmRegularityScore');
    const descEl = document.getElementById('srmRegularityDesc');

    if (srmEntries.length < 3) {
      scoreEl.textContent = '—';
      descEl.textContent = 'Log at least 3 days to see your regularity index.';
      return;
    }

    // Calculate regularity: mean of std devs for each anchor (lower = more regular)
    const anchors = ['bed', 'contact', 'work', 'dinner', 'sleep'];
    const last7 = srmEntries.slice(-7);

    let totalStd = 0;
    anchors.forEach(a => {
      const times = last7.map(e => {
        let m = timeToMinutes(e[a]);
        if (a === 'sleep' && m < 720) m += 1440;
        return m;
      });
      const mean = times.reduce((s, v) => s + v, 0) / times.length;
      const variance = times.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / times.length;
      totalStd += Math.sqrt(variance);
    });

    const avgStd = totalStd / anchors.length;
    // Convert to a 0-10 scale (0 std = 10, 180min std = 0)
    const regularity = Math.max(0, Math.min(10, (1 - avgStd / 180) * 10)).toFixed(1);

    scoreEl.textContent = regularity;

    if (regularity >= 7) {
      scoreEl.style.color = 'var(--color-success)';
      descEl.textContent = 'Highly regular daily rhythms. Excellent for mood stability.';
    } else if (regularity >= 5) {
      scoreEl.style.color = 'var(--color-primary)';
      descEl.textContent = 'Moderately regular rhythms. Aim for more consistency in anchor activities.';
    } else {
      scoreEl.style.color = 'var(--color-warning)';
      descEl.textContent = 'Irregular daily rhythms detected. Social rhythm disruption can trigger bipolar episodes.';
    }
  }

  function renderSRMTimeline() {
    const container = document.getElementById('srmTimelineChart');
    const last7 = srmEntries.slice(-7);

    if (last7.length === 0) {
      container.innerHTML = '<p style="color:var(--color-text-muted);font-size:var(--text-sm);">No rhythm data yet.</p>';
      return;
    }

    const anchorLabels = {
      bed: 'Got out of bed',
      contact: 'First contact',
      work: 'Started work',
      dinner: 'Had dinner',
      sleep: 'Went to bed'
    };

    const dayHeaders = last7.map(e => `<div class="timeline-grid__header">${formatWeekday(e.date)}</div>`).join('');

    let rows = '';
    Object.entries(anchorLabels).forEach(([key, label]) => {
      rows += `<div class="timeline-grid__label">${label}</div>`;
      last7.forEach(e => {
        const time = e[key];
        rows += `<div class="timeline-grid__cell timeline-grid__cell--highlight">${formatTimeDisplay(time)}</div>`;
      });
    });

    container.innerHTML = `
      <div class="timeline-grid">
        <div class="timeline-grid__header" style="text-align:left;">Activity</div>
        ${dayHeaders}
        ${rows}
      </div>
    `;
  }

  // ==========================================================================
  // Sleep Tips
  // ==========================================================================
  function renderTips() {
    const container = document.getElementById('tipsContainer');
    if (container.querySelector('.tips-category')) return; // only render once

    const categories = [
      {
        title: 'Before Bed',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
        color: 'var(--color-secondary)',
        bgColor: 'var(--color-secondary-faded)',
        tips: [
          {
            title: 'Maintain a strict wind-down routine',
            desc: 'Begin dimming lights and reducing stimulation 60-90 minutes before bed. This is especially critical during hypomania when the urge to stay active is strong.',
            evidence: 'CANMAT Guidelines'
          },
          {
            title: 'Avoid blue light exposure after 9 PM',
            desc: 'Blue light suppresses melatonin production. Use night mode on devices, blue-light blocking glasses, or switch to amber-tinted lighting in the evening.',
            evidence: 'Chronobiology Research'
          },
          {
            title: 'Practice relaxation techniques',
            desc: 'Progressive muscle relaxation or guided meditation can help quiet racing thoughts that are common in bipolar disorder, particularly during mixed or manic states.',
            evidence: 'CBT-I Protocol'
          }
        ]
      },
      {
        title: 'Sleep Environment',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
        color: 'var(--color-primary)',
        bgColor: 'var(--color-primary-faded)',
        tips: [
          {
            title: 'Keep the bedroom cool and dark',
            desc: 'Ideal sleep temperature is 65-68°F (18-20°C). Use blackout curtains. A cool, dark environment supports natural melatonin production.',
            evidence: 'Sleep Hygiene'
          },
          {
            title: 'Reserve the bed for sleep only',
            desc: 'Don\'t work, watch TV, or use devices in bed. This strengthens the mental association between bed and sleep — a key principle of stimulus control therapy.',
            evidence: 'CBT-I Protocol'
          },
          {
            title: 'Remove clocks from view',
            desc: 'Clock-watching increases anxiety about sleep and worsens insomnia. If you need an alarm, turn the display away from your bed.',
            evidence: 'CBT-I Protocol'
          }
        ]
      },
      {
        title: 'During the Day',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>',
        color: 'var(--color-accent)',
        bgColor: 'rgba(232, 168, 56, 0.1)',
        tips: [
          {
            title: 'Get morning bright light exposure',
            desc: 'Spend 15-30 minutes in bright light within an hour of waking. This resets your circadian clock and improves both sleep quality and mood regulation.',
            evidence: 'ISBD Chronotherapy'
          },
          {
            title: 'Keep a consistent wake time 7 days a week',
            desc: 'Even more important than bedtime, a fixed wake time anchors your circadian rhythm. Avoid sleeping in on weekends — the "social jet lag" destabilizes bipolar disorder.',
            evidence: 'Social Rhythm Therapy'
          },
          {
            title: 'Limit caffeine after noon',
            desc: 'Caffeine has a half-life of 5-6 hours. Afternoon caffeine can delay sleep onset and reduce deep sleep, which is particularly harmful during depressive episodes.',
            evidence: 'Sleep Hygiene'
          },
          {
            title: 'Avoid long or late naps',
            desc: 'If you must nap, keep it under 20 minutes and before 2 PM. Long naps reduce sleep drive and can fragment nighttime sleep.',
            evidence: 'Sleep Research'
          }
        ]
      },
      {
        title: 'Managing Episodes',
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        color: 'var(--color-warning)',
        bgColor: 'var(--color-warning-faded)',
        tips: [
          {
            title: 'During mania: prioritize dark therapy',
            desc: 'Extended darkness (14 hours, 6 PM–8 AM) can help reduce manic symptoms. At minimum, avoid all light exposure after 10 PM during emerging mania.',
            evidence: 'Dark Therapy Research'
          },
          {
            title: 'During depression: maintain wake time despite fatigue',
            desc: 'The urge to sleep longer during depression actually worsens circadian disruption. Keep your wake time fixed even if you feel exhausted — it aids recovery.',
            evidence: 'Chronotherapy'
          },
          {
            title: 'Track sleep changes as early warning signs',
            desc: 'Decreased need for sleep often precedes mania by days. Increased sleep need can precede depression. A 1.5+ hour change in sleep duration is a significant warning sign.',
            evidence: 'Prodromal Research'
          },
          {
            title: 'Communicate sleep changes to your care team',
            desc: 'Sleep disruption is one of the most reliable predictors of episode onset. Report any significant pattern changes to your psychiatrist or therapist promptly.',
            evidence: 'Clinical Guidelines'
          }
        ]
      }
    ];

    container.innerHTML = categories.map(cat => `
      <div class="tips-category">
        <div class="tips-category__header">
          <div class="tips-category__icon" style="background:${cat.bgColor};color:${cat.color};">
            ${cat.icon}
          </div>
          <h3 class="tips-category__title">${cat.title}</h3>
        </div>
        <div class="tips-list">
          ${cat.tips.map(tip => `
            <div class="tip-card">
              <div class="tip-card__header">
                <h4 class="tip-card__title">${tip.title}</h4>
                <span class="tip-card__evidence">${tip.evidence}</span>
              </div>
              <p class="tip-card__desc">${tip.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  // ==========================================================================
  // Theme Change Observer — re-render charts
  // ==========================================================================
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-theme') {
        if (document.getElementById('panel-chart').classList.contains('tab-panel--active')) {
          renderSleepChart();
        }
      }
    });
  });
  observer.observe(document.documentElement, { attributes: true });

})();
