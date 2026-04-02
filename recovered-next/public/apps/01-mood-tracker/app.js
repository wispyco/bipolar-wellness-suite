/**
 * App 1: Mood Spectrum Tracker
 * Based on the Life Chart Method (LCM) — NIMH validated tool
 * All data stored in-memory (no localStorage)
 */
(function () {
  'use strict';

  // ==========================================================================
  // Mood Labels & Colors
  // ==========================================================================
  const MOOD_META = {
    '-4': { label: 'Severe Depression', color: '#1B4F72' },
    '-3': { label: 'Moderate Depression', color: '#2E86C1' },
    '-2': { label: 'Mild Depression', color: '#5DADE2' },
    '-1': { label: 'Slight Depression', color: '#85C1E9' },
     '0': { label: 'Baseline / Euthymia', color: '#5B8C5A' },
     '1': { label: 'Slight Hypomania', color: '#F0B429' },
     '2': { label: 'Mild Hypomania', color: '#E8912D' },
     '3': { label: 'Moderate Mania', color: '#D4776B' },
     '4': { label: 'Severe Mania', color: '#C0392B' },
  };

  function getMoodColor(val) {
    return MOOD_META[String(val)]?.color || '#5B8C5A';
  }
  function getMoodLabel(val) {
    return MOOD_META[String(val)]?.label || 'Baseline';
  }

  // ==========================================================================
  // Sample Data — 14 days showing mild depressive episode recovering
  // ==========================================================================
  function generateSampleData() {
    const data = [];
    const now = new Date();
    // Pattern: starts at mild depression, dips to moderate, gradually recovers to baseline
    const moods    = [-2, -2, -3, -3, -2, -3, -2, -2, -1, -1, -1, 0, 0, 0];
    const sleeps   = [5.5, 5, 4.5, 5, 6, 5.5, 6.5, 7, 7, 7.5, 7, 7.5, 8, 7.5];
    const meds     = ['yes','yes','yes','no','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes'];
    const energies = [2, 2, 1, 1, 2, 1, 2, 2, 3, 3, 3, 3, 4, 3];
    const irrits   = [3, 3, 4, 4, 3, 4, 3, 2, 2, 2, 2, 1, 1, 1];
    const anxs     = [3, 4, 4, 4, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1];
    const notes    = [
      'Feeling low energy, hard to get out of bed. Managed a short walk.',
      'Mood slightly worse. Appetite decreased. Called mom.',
      'Difficult day. Concentration poor. Missed a work deadline.',
      'Forgot medication. Sleep was fragmented, woke up at 3am.',
      'Back on meds. Slight improvement in afternoon.',
      'Still struggling. Therapist session helped identify rumination patterns.',
      'Better day overall. Got some work done. Cooked dinner.',
      'Mood lifting slightly. Sleep improving. Morning felt less heavy.',
      'Noticeable improvement. Went for a 30-minute run.',
      'Good day. Social outing with friends, felt almost normal.',
      'Steady. Maintaining routine, sleep is back to 7+ hours.',
      'Feeling stable. Productive at work. Grateful for the upturn.',
      'Baseline! First day in two weeks that feels genuinely okay.',
      'Another stable day. Keeping up with routine and exercise.'
    ];

    for (let i = 0; i < 14; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (13 - i));
      date.setHours(9 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 60), 0, 0);

      data.push({
        id: crypto.randomUUID ? crypto.randomUUID() : 'sample-' + i,
        date: date.toISOString(),
        mood: moods[i],
        sleepHours: sleeps[i],
        medication: meds[i],
        energy: energies[i],
        irritability: irrits[i],
        anxiety: anxs[i],
        notes: notes[i],
      });
    }
    return data;
  }

  // In-memory data store
  let entries = generateSampleData();

  // ==========================================================================
  // Utility
  // ==========================================================================
  function formatDate(isoStr) {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  function formatDateShort(isoStr) {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  function formatTime(isoStr) {
    const d = new Date(isoStr);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  function getEntriesSorted() {
    return [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  function getLast7DaysEntries() {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return getEntriesSorted().filter(e => new Date(e.date) >= weekAgo);
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
    // Refresh content for the new tab
    if (tabName === 'chart') renderLifeChart();
    if (tabName === 'summary') renderWeeklySummary();
    if (tabName === 'history') renderHistory();
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // ==========================================================================
  // Mood Slider
  // ==========================================================================
  const moodSlider = document.getElementById('moodSlider');
  const moodValueDisplay = document.getElementById('moodValueDisplay');
  const moodLabelDisplay = document.getElementById('moodLabelDisplay');

  function updateMoodDisplay() {
    const val = parseInt(moodSlider.value);
    const prefix = val > 0 ? '+' : '';
    moodValueDisplay.textContent = prefix + val;
    moodLabelDisplay.textContent = getMoodLabel(val);
    moodValueDisplay.style.color = getMoodColor(val);
  }

  moodSlider.addEventListener('input', updateMoodDisplay);
  updateMoodDisplay();

  // ==========================================================================
  // Rating Scales & Toggles
  // ==========================================================================
  function setupRatingScale(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const buttons = container.querySelectorAll('.rating-scale__btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => {
          b.classList.remove('rating-scale__btn--active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('rating-scale__btn--active');
        btn.setAttribute('aria-checked', 'true');
      });
    });
  }

  setupRatingScale('energyScale');
  setupRatingScale('irritabilityScale');
  setupRatingScale('anxietyScale');

  // Medication toggle
  const medToggle = document.getElementById('medToggle');
  if (medToggle) {
    medToggle.querySelectorAll('.toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        medToggle.querySelectorAll('.toggle-btn').forEach(b => {
          b.classList.remove('toggle-btn--active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('toggle-btn--active');
        btn.setAttribute('aria-checked', 'true');
      });
    });
  }

  // ==========================================================================
  // Form Submission
  // ==========================================================================
  function getScaleValue(containerId) {
    const active = document.querySelector(`#${containerId} .rating-scale__btn--active`);
    return active ? parseInt(active.dataset.value) : null;
  }
  function getToggleValue(containerId) {
    const active = document.querySelector(`#${containerId} .toggle-btn--active`);
    return active ? active.dataset.value : null;
  }

  const form = document.getElementById('moodEntryForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'entry-' + Date.now(),
      date: new Date().toISOString(),
      mood: parseInt(moodSlider.value),
      sleepHours: document.getElementById('sleepHours').value ? parseFloat(document.getElementById('sleepHours').value) : null,
      medication: getToggleValue('medToggle'),
      energy: getScaleValue('energyScale'),
      irritability: getScaleValue('irritabilityScale'),
      anxiety: getScaleValue('anxietyScale'),
      notes: document.getElementById('entryNotes').value.trim() || null,
    };

    entries.push(entry);
    showToast('Entry saved successfully');
    resetForm();
  });

  form.addEventListener('reset', (e) => {
    // Slight delay to let native reset happen
    setTimeout(resetForm, 10);
  });

  function resetForm() {
    moodSlider.value = 0;
    updateMoodDisplay();
    document.getElementById('sleepHours').value = '';
    document.getElementById('entryNotes').value = '';
    // Clear rating scales
    document.querySelectorAll('.rating-scale__btn--active').forEach(b => {
      b.classList.remove('rating-scale__btn--active');
      b.setAttribute('aria-checked', 'false');
    });
    document.querySelectorAll('.toggle-btn--active').forEach(b => {
      b.classList.remove('toggle-btn--active');
      b.setAttribute('aria-checked', 'false');
    });
  }

  // Toast
  function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('toast--visible');
    setTimeout(() => toast.classList.remove('toast--visible'), 2500);
  }

  // ==========================================================================
  // Life Chart (Chart.js)
  // ==========================================================================
  let lifechart = null;

  function renderLifeChart() {
    const ctx = document.getElementById('lifechart');
    if (!ctx) return;

    const sorted = getEntriesSorted();
    if (sorted.length === 0) return;

    const labels = sorted.map(e => formatDateShort(e.date));
    const data = sorted.map(e => e.mood);
    const colors = sorted.map(e => getMoodColor(e.mood));

    // Determine current theme
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(232,230,240,0.08)' : 'rgba(45,43,58,0.08)';
    const textColor = isDark ? '#A8A6B8' : '#6B697A';

    if (lifechart) lifechart.destroy();

    lifechart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Mood',
          data: data,
          borderColor: function(context) {
            const chart = context.chart;
            const {ctx: c, chartArea} = chart;
            if (!chartArea) return '#5B8C5A';
            const gradient = c.createLinearGradient(chartArea.left, chartArea.bottom, chartArea.left, chartArea.top);
            gradient.addColorStop(0, '#2E86C1');
            gradient.addColorStop(0.45, '#5B8C5A');
            gradient.addColorStop(1, '#D4776B');
            return gradient;
          },
          backgroundColor: 'transparent',
          borderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 9,
          pointBackgroundColor: colors,
          pointBorderColor: isDark ? '#222240' : '#FFFFFF',
          pointBorderWidth: 2.5,
          pointHoverBorderWidth: 3,
          tension: 0.35,
          fill: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'nearest',
          intersect: false,
          axis: 'x',
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const idx = elements[0].index;
            showDayDetail(sorted[idx]);
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
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
                const val = item.parsed.y;
                const prefix = val > 0 ? '+' : '';
                return `Mood: ${prefix}${val} — ${getMoodLabel(val)}`;
              },
            },
          },
        },
        scales: {
          y: {
            min: -4.5,
            max: 4.5,
            ticks: {
              stepSize: 1,
              color: textColor,
              font: { family: "'Inter', sans-serif", size: 11 },
              callback: function (value) {
                if (value === 0) return '0 ─';
                if (Number.isInteger(value) && value >= -4 && value <= 4) {
                  return (value > 0 ? '+' : '') + value;
                }
                return '';
              },
            },
            grid: {
              color: function (context) {
                if (context.tick.value === 0) return isDark ? 'rgba(91,140,90,0.3)' : 'rgba(91,140,90,0.25)';
                return gridColor;
              },
              lineWidth: function (context) {
                return context.tick.value === 0 ? 2 : 1;
              },
            },
          },
          x: {
            ticks: {
              color: textColor,
              font: { family: "'Inter', sans-serif", size: 11 },
              maxRotation: 45,
            },
            grid: { display: false },
          },
        },
        // Color zones as background
        plugins_custom: true,
      },
      plugins: [{
        id: 'zoneBackground',
        beforeDraw: function (chart) {
          const { ctx: c, chartArea, scales } = chart;
          if (!chartArea) return;

          const yScale = scales.y;
          const depTop = yScale.getPixelForValue(0);
          const depBottom = yScale.getPixelForValue(-4.5);
          const maniaTop = yScale.getPixelForValue(4.5);
          const maniaBottom = yScale.getPixelForValue(0);
          const baseTop = yScale.getPixelForValue(1);
          const baseBottom = yScale.getPixelForValue(-1);

          // Depression zone
          c.save();
          c.fillStyle = isDark ? 'rgba(46,134,193,0.06)' : 'rgba(46,134,193,0.04)';
          c.fillRect(chartArea.left, depTop, chartArea.width, depBottom - depTop);

          // Mania zone
          c.fillStyle = isDark ? 'rgba(212,119,107,0.06)' : 'rgba(212,119,107,0.04)';
          c.fillRect(chartArea.left, maniaTop, chartArea.width, maniaBottom - maniaTop);

          // Euthymia zone (around 0)
          c.fillStyle = isDark ? 'rgba(91,140,90,0.08)' : 'rgba(91,140,90,0.06)';
          c.fillRect(chartArea.left, baseTop, chartArea.width, baseBottom - baseTop);
          c.restore();
        }
      }]
    });
  }

  // Re-render chart when theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-theme') {
        if (document.getElementById('panel-chart').classList.contains('tab-panel--active')) {
          renderLifeChart();
        }
        if (document.getElementById('panel-summary').classList.contains('tab-panel--active')) {
          renderWeeklySummary();
        }
      }
    });
  });
  observer.observe(document.documentElement, { attributes: true });

  // ==========================================================================
  // Day Detail Popup
  // ==========================================================================
  const popup = document.getElementById('dayDetailPopup');
  const overlay = document.getElementById('dayDetailOverlay');
  const closeBtn = document.getElementById('dayDetailClose');

  function showDayDetail(entry) {
    const dateEl = document.getElementById('dayDetailDate');
    const moodEl = document.getElementById('dayDetailMood');
    const statsEl = document.getElementById('dayDetailStats');
    const notesEl = document.getElementById('dayDetailNotes');

    dateEl.textContent = formatDate(entry.date);

    const prefix = entry.mood > 0 ? '+' : '';
    moodEl.innerHTML = `
      <div class="day-detail__mood-indicator" style="background:${getMoodColor(entry.mood)}">
        ${prefix}${entry.mood}
      </div>
      <div>
        <div style="font-weight:600;font-size:var(--text-sm);">${getMoodLabel(entry.mood)}</div>
        <div class="day-detail__mood-text">${formatTime(entry.date)}</div>
      </div>
    `;

    let statsHTML = '';
    if (entry.sleepHours !== null) {
      statsHTML += `<div class="day-detail__stat"><div class="day-detail__stat-label">Sleep</div><div class="day-detail__stat-value">${entry.sleepHours} hrs</div></div>`;
    }
    if (entry.medication) {
      statsHTML += `<div class="day-detail__stat"><div class="day-detail__stat-label">Medication</div><div class="day-detail__stat-value">${entry.medication === 'yes' ? 'Taken ✓' : 'Missed'}</div></div>`;
    }
    if (entry.energy !== null) {
      statsHTML += `<div class="day-detail__stat"><div class="day-detail__stat-label">Energy</div><div class="day-detail__stat-value">${entry.energy} / 5</div></div>`;
    }
    if (entry.irritability !== null) {
      statsHTML += `<div class="day-detail__stat"><div class="day-detail__stat-label">Irritability</div><div class="day-detail__stat-value">${entry.irritability} / 5</div></div>`;
    }
    if (entry.anxiety !== null) {
      statsHTML += `<div class="day-detail__stat"><div class="day-detail__stat-label">Anxiety</div><div class="day-detail__stat-value">${entry.anxiety} / 5</div></div>`;
    }
    statsEl.innerHTML = statsHTML;

    if (entry.notes) {
      notesEl.style.display = 'block';
      notesEl.textContent = entry.notes;
    } else {
      notesEl.style.display = 'none';
    }

    popup.classList.add('day-detail-popup--visible');
    overlay.classList.add('day-detail-overlay--visible');
  }

  function closeDayDetail() {
    popup.classList.remove('day-detail-popup--visible');
    overlay.classList.remove('day-detail-overlay--visible');
  }

  closeBtn.addEventListener('click', closeDayDetail);
  overlay.addEventListener('click', closeDayDetail);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDayDetail();
  });

  // ==========================================================================
  // Weekly Summary
  // ==========================================================================
  let weeklySparklineChart = null;

  function renderWeeklySummary() {
    const container = document.getElementById('weeklySummary');
    const weekEntries = getLast7DaysEntries();

    if (weekEntries.length === 0) {
      container.innerHTML = '<p style="color:var(--color-text-muted);font-size:var(--text-sm);">No entries in the last 7 days.</p>';
      return;
    }

    // Calculate stats
    const moods = weekEntries.map(e => e.mood);
    const avgMood = moods.reduce((a, b) => a + b, 0) / moods.length;
    const avgMoodStr = (avgMood >= 0 ? '+' : '') + avgMood.toFixed(1);

    const sleepEntries = weekEntries.filter(e => e.sleepHours !== null);
    const avgSleep = sleepEntries.length > 0
      ? (sleepEntries.reduce((a, e) => a + e.sleepHours, 0) / sleepEntries.length).toFixed(1)
      : '—';

    const medEntries = weekEntries.filter(e => e.medication !== null);
    const medAdherence = medEntries.length > 0
      ? Math.round((medEntries.filter(e => e.medication === 'yes').length / medEntries.length) * 100)
      : null;

    // Mood stability (std dev)
    const mean = moods.reduce((a, b) => a + b, 0) / moods.length;
    const variance = moods.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / moods.length;
    const stdDev = Math.sqrt(variance);
    let stabilityLabel = 'Very Stable';
    let stabilityColor = 'var(--color-success)';
    if (stdDev > 2) { stabilityLabel = 'High Variability'; stabilityColor = 'var(--color-warning)'; }
    else if (stdDev > 1) { stabilityLabel = 'Moderate'; stabilityColor = 'var(--color-accent)'; }
    else if (stdDev > 0.5) { stabilityLabel = 'Stable'; stabilityColor = 'var(--color-success)'; }

    container.innerHTML = `
      <div class="summary-card">
        <div class="summary-card__label">Average Mood</div>
        <div class="summary-card__value" style="color:${getMoodColor(Math.round(avgMood))}">${avgMoodStr}</div>
        <div class="summary-card__detail">${getMoodLabel(Math.round(avgMood))}</div>
      </div>
      <div class="summary-card">
        <div class="summary-card__label">Avg. Sleep</div>
        <div class="summary-card__value">${avgSleep}<span style="font-family:var(--font-body);font-size:var(--text-sm);color:var(--color-text-muted);"> hrs</span></div>
        <div class="summary-card__detail">${sleepEntries.length} entries logged</div>
      </div>
      <div class="summary-card">
        <div class="summary-card__label">Medication Adherence</div>
        <div class="summary-card__value" style="color:${medAdherence !== null && medAdherence >= 80 ? 'var(--color-success)' : medAdherence !== null ? 'var(--color-warning)' : 'var(--color-text-faint)'}">${medAdherence !== null ? medAdherence + '%' : '—'}</div>
        <div class="summary-card__detail">${medEntries.length > 0 ? medEntries.filter(e => e.medication === 'yes').length + ' of ' + medEntries.length + ' days' : 'Not tracked'}</div>
      </div>
      <div class="summary-card">
        <div class="summary-card__label">Mood Stability</div>
        <div class="summary-card__value" style="color:${stabilityColor}">${stdDev.toFixed(2)}</div>
        <div class="summary-card__detail">${stabilityLabel} (σ = std dev)</div>
      </div>
    `;

    // Sparkline
    renderWeeklySparkline(weekEntries);
  }

  function renderWeeklySparkline(weekEntries) {
    const ctx = document.getElementById('weeklySparkline');
    if (!ctx) return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const labels = weekEntries.map(e => formatDateShort(e.date));
    const data = weekEntries.map(e => e.mood);
    const colors = weekEntries.map(e => getMoodColor(e.mood));

    if (weeklySparklineChart) weeklySparklineChart.destroy();

    weeklySparklineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data,
          borderColor: isDark ? '#6B8CC7' : '#3B5998',
          backgroundColor: isDark ? 'rgba(107,140,199,0.1)' : 'rgba(59,89,152,0.08)',
          borderWidth: 2.5,
          pointRadius: 5,
          pointBackgroundColor: colors,
          pointBorderColor: isDark ? '#222240' : '#FFFFFF',
          pointBorderWidth: 2,
          tension: 0.35,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
          y: {
            min: -4.5, max: 4.5,
            ticks: { display: false },
            grid: {
              color: function(ctx) {
                if (ctx.tick.value === 0) return isDark ? 'rgba(91,140,90,0.3)' : 'rgba(91,140,90,0.2)';
                return 'transparent';
              },
              lineWidth: function(ctx) { return ctx.tick.value === 0 ? 1.5 : 0; }
            },
          },
          x: {
            ticks: {
              color: isDark ? '#6B697A' : '#9B99A8',
              font: { size: 11 }
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  // ==========================================================================
  // Entry History
  // ==========================================================================
  function renderHistory() {
    const container = document.getElementById('historyList');
    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sorted.length === 0) {
      container.innerHTML = '<p style="color:var(--color-text-muted);font-size:var(--text-sm);padding:var(--space-8);text-align:center;">No entries yet. Log your first mood entry to get started.</p>';
      return;
    }

    container.innerHTML = sorted.map((entry, i) => {
      const prefix = entry.mood > 0 ? '+' : '';
      return `
        <div class="history-entry" data-index="${i}">
          <div class="history-entry__main">
            <div class="history-entry__mood-dot" style="background:${getMoodColor(entry.mood)}"></div>
            <div class="history-entry__date">${formatDate(entry.date)}</div>
            <div class="history-entry__mood-label">${getMoodLabel(entry.mood)}</div>
            <div class="history-entry__mood-value" style="color:${getMoodColor(entry.mood)}">${prefix}${entry.mood}</div>
            <svg class="history-entry__expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="history-entry__details">
            <div class="history-entry__detail-grid">
              ${entry.sleepHours !== null ? `<div class="history-detail-item"><div class="history-detail-item__label">Sleep</div><div class="history-detail-item__value">${entry.sleepHours} hours</div></div>` : ''}
              ${entry.medication ? `<div class="history-detail-item"><div class="history-detail-item__label">Medication</div><div class="history-detail-item__value">${entry.medication === 'yes' ? 'Taken' : 'Missed'}</div></div>` : ''}
              ${entry.energy !== null ? `<div class="history-detail-item"><div class="history-detail-item__label">Energy</div><div class="history-detail-item__value">${entry.energy} / 5</div></div>` : ''}
              ${entry.irritability !== null ? `<div class="history-detail-item"><div class="history-detail-item__label">Irritability</div><div class="history-detail-item__value">${entry.irritability} / 5</div></div>` : ''}
              ${entry.anxiety !== null ? `<div class="history-detail-item"><div class="history-detail-item__label">Anxiety</div><div class="history-detail-item__value">${entry.anxiety} / 5</div></div>` : ''}
              <div class="history-detail-item"><div class="history-detail-item__label">Time</div><div class="history-detail-item__value">${formatTime(entry.date)}</div></div>
            </div>
            ${entry.notes ? `<div class="history-entry__notes">"${entry.notes}"</div>` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Expand/collapse
    container.querySelectorAll('.history-entry').forEach(el => {
      el.querySelector('.history-entry__main').addEventListener('click', () => {
        el.classList.toggle('history-entry--expanded');
      });
    });
  }

  // ==========================================================================
  // Initialize
  // ==========================================================================
  // Nothing to init for tab 1 beyond what's already done.
  // Chart and other tabs will init when clicked.

})();
