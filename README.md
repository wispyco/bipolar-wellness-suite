# Bipolar Wellness Suite

A progressive collection of 12 research-backed mini web apps for bipolar disorder self-management and research exploration. Built one app per hour over 12 hours, grounded in evidence-based psychotherapies including CBT, IPSRT, chronotherapy, psychoeducation, and functional remediation.

**[View the Live App](https://bipolar-suite-next.vercel.app)**

---

## What This Is

Each app in the suite targets a specific, evidence-based approach to bipolar disorder management. Together they form a comprehensive self-management toolkit that covers mood tracking, sleep analysis, cognitive restructuring, medication adherence, crisis planning, and more.

All apps run entirely in the browser -- no backend, no accounts, no data collection. Built with vanilla HTML/CSS/JS and Chart.js for visualizations.

---

## Apps

| # | App | Description | Research Basis | Status |
|---|-----|-------------|---------------|--------|
| 1 | **[Mood Spectrum Tracker](site/apps/01-mood-tracker/)** | Daily mood charting on a 9-point scale (-4 depression to +4 mania) with sleep, medication, energy, irritability, and anxiety tracking. Life Chart visualization with color-coded zones. | [Life Chart Method (NIMH)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6999214/) | Live |
| 2 | **[Circadian Rhythm Analyzer](site/apps/02-circadian/)** | Sleep log with bedtime/wake/quality tracking, sleep architecture chart, circadian consistency score, Social Rhythm Metric (SRM-5) for 5 daily anchor activities, and BD-specific sleep hygiene tips. | [Social Rhythm Therapy](https://pmc.ncbi.nlm.nih.gov/articles/PMC6999214/) | Live |
| 3 | **[Cognitive Patterns Journal](site/apps/03-cbt-journal/)** | CBT thought records with 15 cognitive distortion types, emotion intensity tracking (before/after reframing), pattern analysis charts, guided Reframe Helper with challenge questions and prompts, and a full distortion reference guide. | [CBT for BD (Lam et al., Scott et al.)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6999214/) | Live |
| 4 | **[Early Warning Detector](site/apps/04-warning-signals/)** | Personalized prodromal symptom monitoring with color-coded alerts (green/yellow/orange/red), trend visualization, and action plan recommendations. | Prodromal Monitoring | Live |
| 5 | **[Social Rhythm Stabilizer](site/apps/05-social-rhythm/)** | IPSRT-based daily routine scheduling with rhythm regularity index, disruption logging, and weekly stability scores. | [IPSRT (Frank et al.)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6999214/) | Live |
| 6 | **[Medication Tracker](site/apps/06-medication/)** | Medication list manager with daily check-off, side effect logging (severity 1-5), adherence percentage visualization, and missed dose pattern identification. | Adherence Research | Live |
| 7 | **[Quality of Life Dashboard](site/apps/07-qol-dashboard/)** | 12-domain QoL self-assessment (Physical, Sleep, Mood, Cognition, Leisure, Social, Spirituality, Finance, Household, Self-esteem, Independence, Identity) with radar chart and action suggestions. | [QoL.BD Framework](https://pmc.ncbi.nlm.nih.gov/articles/PMC9389375/) | Live |
| 8 | **[Psychoeducation Library](site/apps/08-psychoeducation/)** | Interactive learning modules on BD types, medications, therapy options, triggers, sleep, stress management, and support systems. Each with quizzes and progress tracking. | [CANMAT/ISBD Guidelines](https://pmc.ncbi.nlm.nih.gov/articles/PMC6999214/) | Live |
| 9 | **[Chronotherapy Planner](site/apps/09-chronotherapy/)** | Bright light therapy scheduler, dark therapy/blue light management, wake therapy protocols with safety guidelines, and light exposure logging. | [ISBD Chronotherapy Recommendations](https://www.psychiatrictimes.com/view/thinking-beyond-the-guidelines-evidence-based-novel-therapies-for-bipolar-depression) | Live |
| 10 | **[Crisis & Support Planner](site/apps/10-crisis-planner/)** | Stanley & Brown safety plan builder (6 steps), emergency resources (988 hotline), support network visualization, wellness plans for depression/mania, and communication templates. | [Safety Planning (Stanley & Brown)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6999214/) | Live |
| 11 | **[Functional Remediation](site/apps/11-functional-rehab/)** | Cognitive training exercises (attention, memory, executive function), occupational goal tracking, daily functioning self-assessment, and accommodation planning. | [Functional Remediation (Torrent et al.)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6999214/) | Live |
| 12 | **Integrated Command Center** | Unified dashboard pulling metrics from all 11 apps, cross-correlation insights (mood vs sleep vs medication vs rhythms), weekly wellness report, and data export. | Integration | Live |

---

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no framework dependencies)
- **Charts**: [Chart.js v4](https://www.chartjs.org/) via CDN
- **Fonts**: Inter (body) + DM Serif Display (headings) via Google Fonts
- **Hosting**: [Next.js dashboard](https://bipolar-suite-next.vercel.app) on Vercel
- **Data**: All in-memory (no localStorage, no server) -- each app ships with realistic sample data
- **Accessibility**: Dark mode, keyboard navigation, semantic HTML, ARIA labels

## Design System

| Token | Value |
|-------|-------|
| Primary | `#3B5998` (deep calm blue) |
| Secondary | `#7C6DAF` (soft violet) |
| Accent | `#E8A838` (warm amber) |
| Success | `#5B8C5A` (sage green) |
| Warning | `#D4776B` (soft coral) |
| Light background | `#FAFAF7` |
| Dark background | `#1A1A2E` |

---

## Project Structure

```
bipolar-wellness-suite/
  site/                          # Static site root
    index.html                   # Hub homepage (Spyro hero + toolkit)
    logo.png                     # Spyro logo
    shared/
      styles.css                 # Design tokens, base styles, components
      hub.css                    # Homepage-specific styles
      nav.js                     # Dark mode toggle, navigation
    apps/
      01-mood-tracker/           # App 1: Life Chart Method mood tracking
        index.html
        app.css
        app.js
      02-circadian/              # App 2: Sleep/wake pattern analysis
        index.html
        app.css
        app.js
      03-cbt-journal/            # App 3: CBT thought records
        index.html
        app.css
        app.js
      04-warning-signals/        # App 4: Prodromal symptom monitoring (building)
      ...                        # Apps 5-12 (building hourly)
  app-specs.md                   # Full specifications for all 12 apps
  README.md
```

---

## Research Foundation

This suite is grounded in peer-reviewed clinical research:

- **Life Chart Method** -- Developed by the NIMH, a validated prospective daily mood monitoring tool used in bipolar disorder research since the 1990s.
- **Cognitive Behavioral Therapy** -- 13+ RCTs demonstrate CBT reduces relapse rates, improves depressive symptoms, and enhances psychosocial functioning in bipolar disorder (Chiang et al. meta-analysis).
- **Interpersonal and Social Rhythm Therapy (IPSRT)** -- Stabilizing daily routines and resolving interpersonal problems reduces circadian rhythm disruption and mood episodes (Frank et al.).
- **Chronotherapy** -- ISBD recommends bright light therapy for bipolar depression and dark therapy for mania, supported by multiple meta-analyses.
- **[Functional Remediation](site/apps/11-functional-rehab/)** -- Targets neurocognitive deficits that persist between episodes, improving occupational and social functioning (Torrent et al.).
- **QoL.BD** -- A bipolar-specific quality of life instrument measuring 12 life domains, validated across international clinical trials.
- **Safety Planning** -- Stanley & Brown's safety planning intervention is an evidence-based brief intervention for suicide prevention.

### Key References

- [Evidence-Based Psychotherapies for Bipolar Disorder (NIH PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6999214/)
- [Mood Monitoring and Ambulatory Assessment in BD (JMIR 2026)](https://mental.jmir.org/2026/1/e84020)
- [PolarUs: QoL Self-Management App for BD (JMIR Research Protocols)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9389375/)
- [Digital Interventions for Psychosis and BD (Lancet Psychiatry)](https://www.nationalelfservice.net/treatment/digital-health/digital-interventions-psychosis-bipolar-disorder/)
- [Novel Therapies for Bipolar Depression (Psychiatric Times)](https://www.psychiatrictimes.com/view/thinking-beyond-the-guidelines-evidence-based-novel-therapies-for-bipolar-depression)
- [Online Mood Monitoring in BD (Int J Bipolar Disorders)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8636552/)

---

## Disclaimer

This suite is for **educational and self-management purposes only**. It is not a substitute for professional medical care, diagnosis, or treatment. Always consult a qualified healthcare provider for medical advice.

If you are in crisis, please contact:
- **988 Suicide & Crisis Lifeline**: Call or text 988 (US)
- **Crisis Text Line**: Text HOME to 741741
- **Emergency Services**: Call 911

---

## License

MIT
