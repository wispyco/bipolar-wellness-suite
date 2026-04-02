import type { Metadata } from 'next'
import { CbtJournalApp } from '@/components/apps/cbt-journal-app'
import { ChronotherapyPlannerApp } from '@/components/apps/chronotherapy-planner-app'
import { CommandCenterApp } from '@/components/apps/command-center-app'
import { CrisisSupportPlannerApp } from '@/components/apps/crisis-support-planner-app'
import { FunctionalRemediationApp } from '@/components/apps/functional-remediation-app'
import { MedicationApp } from '@/components/apps/medication-app'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PsychoeducationLibraryApp } from '@/components/apps/psychoeducation-library-app'
import { QualityOfLifeApp } from '@/components/apps/qol-dashboard-app'
import { CircadianApp } from '@/components/apps/circadian-app'
import { MoodTrackerApp } from '@/components/apps/mood-tracker-app'
import { SocialRhythmApp } from '@/components/apps/social-rhythm-app'
import { WarningSignalsApp } from '@/components/apps/warning-signals-app'
import { PrototypeEmbed } from '@/components/prototype-embed'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getAppBySlug, suiteApps } from '@/lib/apps'

type AppPageProps = {
  params: { slug: string }
}

export async function generateStaticParams() {
  return suiteApps.map((app) => ({ slug: app.slug }))
}

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  const { slug } = params
  const app = getAppBySlug(slug)

  if (!app) {
    return { title: 'Tool not found — Bipolar Wellness Suite' }
  }

  return {
    title: `${app.title} — Bipolar Wellness Suite`,
    description: app.summary,
  }
}

const nativeAppRegistry = {
  '01-mood-tracker': MoodTrackerApp,
  '02-circadian': CircadianApp,
  '03-cbt-journal': CbtJournalApp,
  '04-warning-signals': WarningSignalsApp,
  '05-social-rhythm': SocialRhythmApp,
  '06-medication': MedicationApp,
  '07-quality-of-life': QualityOfLifeApp,
  '08-psychoeducation-library': PsychoeducationLibraryApp,
  '09-chronotherapy-planner': ChronotherapyPlannerApp,
  '10-crisis-support-planner': CrisisSupportPlannerApp,
  '11-functional-remediation': FunctionalRemediationApp,
  '12-command-center': CommandCenterApp,
} as const

export default async function AppPage({ params }: AppPageProps) {
  const { slug } = params
  const app = getAppBySlug(slug)

  if (!app) {
    notFound()
  }

  const NativeApp = nativeAppRegistry[slug as keyof typeof nativeAppRegistry]
  const isBlueprint = app.status === 'Blueprint page'

  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <section className="app-hero">
          <div className="container app-hero__content">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Suite</Link>
              <span>/</span>
              <span>{app.shortTitle}</span>
            </nav>
            <div className="app-hero__heading">
              <div>
                <span className={`badge ${isBlueprint ? 'badge--planned' : 'badge--active'}`}>
                  {app.id} · {app.status}
                </span>
                <h1>{app.title}</h1>
                <p>{app.subtitle}</p>
              </div>
              <div className="app-hero__aside">
                <div className="summary-card">
                  <span className="summary-card__label">Research basis</span>
                  <strong>{app.research}</strong>
                  <p>{app.foundation}</p>
                </div>
                <Link href="/" className="secondary-link">
                  ← Back to all tools
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="container two-column-grid">
            <section className="content-card">
              <div className="section-heading section-heading--compact">
                <span className="eyebrow">Included in this page</span>
                <h2>What the tool is designed to do</h2>
              </div>
              <ul className="feature-list">
                {app.focusAreas.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section className="content-card">
              <div className="section-heading section-heading--compact">
                <span className="eyebrow">Expected outcomes</span>
                <h2>Why this workflow matters</h2>
              </div>
              <ul className="feature-list feature-list--soft">
                {app.outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </section>

        {NativeApp ? (
          <section className="section-block section-block--muted">
            <div className="container">
              <div className="section-heading">
                <span className="eyebrow">Native Next.js implementation</span>
                <h2>Interactive page rebuilt inside the app shell</h2>
                <p>
                  This tool is now rendered as a native React experience within the unified Next.js
                  suite. The original static prototype remains available in a separate tab for parity
                  comparison while the remaining apps continue migrating.
                </p>
              </div>
              <div className="prototype-actions">
                {app.prototypePath ? (
                  <a href={app.prototypePath} className="secondary-link" target="_blank" rel="noreferrer">
                    Open legacy prototype for comparison
                  </a>
                ) : null}
              </div>
              <NativeApp />
            </div>
          </section>
        ) : app.prototypePath ? (
          <section className="section-block section-block--muted">
            <div className="container">
              <div className="section-heading">
                <span className="eyebrow">Interactive prototype</span>
                <h2>Preserved legacy experience, now routed through Next.js</h2>
                <p>
                  This page hosts the original prototype inside the new Next.js app so the suite can
                  move forward with one homepage and one internal navigation model while native React
                  migration continues.
                </p>
              </div>
              <div className="prototype-actions">
                <a href={app.prototypePath} className="primary-link" target="_blank" rel="noreferrer">
                  Open the prototype in a new tab
                </a>
                <span className="prototype-note">Legacy prototype source remains available for parity checks.</span>
              </div>
              <PrototypeEmbed src={app.prototypePath} title={`${app.title} prototype`} />
            </div>
          </section>
        ) : (
          <section className="section-block section-block--muted">
            <div className="container two-column-grid">
              <section className="content-card content-card--tall">
                <div className="section-heading section-heading--compact">
                  <span className="eyebrow">Blueprint</span>
                  <h2>Planned next-phase buildout</h2>
                </div>
                <ul className="feature-list">
                  {app.nextPhase.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section className="content-card content-card--tall">
                <div className="section-heading section-heading--compact">
                  <span className="eyebrow">Current page goal</span>
                  <h2>MVP route now, deeper interactions next</h2>
                </div>
                <p className="content-card__body">
                  This route establishes the information architecture, product framing, and research
                  foundation for the tool inside the unified Next.js app. It is ready for native
                  implementation in the next delivery pass.
                </p>
                <div className="chip-row">
                  {app.focusAreas.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
