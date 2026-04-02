/**
 * Bipolar Wellness Suite — Shared Navigation & Theme Toggle
 */
(function() {
  'use strict';

  // --------------------------------------------------------------------------
  // Theme Management
  // --------------------------------------------------------------------------
  const html = document.documentElement;
  let currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  html.setAttribute('data-theme', currentTheme);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!userHasToggled) {
      currentTheme = e.matches ? 'dark' : 'light';
      html.setAttribute('data-theme', currentTheme);
      updateToggleButton();
    }
  });

  let userHasToggled = false;

  function updateToggleButton() {
    const btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;
    
    const sunIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    const moonIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    
    btn.innerHTML = currentTheme === 'dark' ? sunIcon : moonIcon;
    btn.setAttribute('aria-label', `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`);
  }

  function toggleTheme() {
    userHasToggled = true;
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', currentTheme);
    updateToggleButton();
  }

  // --------------------------------------------------------------------------
  // Initialize when DOM is ready
  // --------------------------------------------------------------------------
  function init() {
    // Set up theme toggle
    const toggleBtn = document.querySelector('[data-theme-toggle]');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
      updateToggleButton();
    }

    // Set up back-to-hub links
    document.querySelectorAll('[data-nav-hub]').forEach(el => {
      el.addEventListener('click', (e) => {
        // Let normal links work
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use
  window.BWS = window.BWS || {};
  window.BWS.toggleTheme = toggleTheme;
  window.BWS.getTheme = () => currentTheme;
})();
