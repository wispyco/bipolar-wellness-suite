import Link from 'next/link'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { interactiveAppCount, suiteApps, suiteFoundations } from '@/lib/apps'

export default function HomePage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <section className="hero-section">
          <div className="hero-section__glow hero-section__glow--one" />
          <div className="hero-section__glow hero-section__glow--two" />
          <div className="container hero-section__content">
            <span className="eyebrow">Research-backed digital therapeutics</span>
            <h1>One Next.js home for all 12 bipolar wellness tools.</h1>
            <p className="hero-section__lede">
              The suite now lives behind a unified internal routing layer: six interactive legacy
              prototypes are available inside the app today, and six additional blueprint pages are
              ready for deeper implementation.
            </p>
            <div className="hero-metrics">
              <div className="metric-card">
                <strong>12</strong>
                <span>Next.js routes live</span>
              </div>
              <div className="metric-card">
                <strong>{interactiveAppCount}</strong>
                <span>interactive prototype embeds</span>
              </div>
              <div className="metric-card">
                <strong>1</strong>
                <span>canonical suite homepage</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Mini apps</span>
              <h2>Browse the full suite</h2>
              <p>
                Every tool now has an internal route. Interactive tools open preserved prototype
                experiences, while blueprint pages outline the next native Next.js buildout.
              </p>
            </div>
            <div className="app-grid">
              {suiteApps.map((app) => (
                <Link key={app.slug} href={`/apps/${app.slug}`} className="app-card">
                  <div className="app-card__topline">
                    <span className={`badge ${app.status === 'Blueprint page' ? 'badge--planned' : 'badge--active'}`}>
                      {app.id} · {app.status}
                    </span>
                    <span className="tag">{app.tag}</span>
                  </div>
                  <h3>{app.title}</h3>
                  <p>{app.summary}</p>
                  <div className="app-card__footer">
                    <span>
                      {app.status === 'Native page'
                        ? 'Open native tool page'
                        : app.prototypePath
                          ? 'Open tool page + embedded prototype'
                          : 'Open tool blueprint'}
                    </span>
                    <span aria-hidden="true">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-block section-block--muted">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Research foundation</span>
              <h2>Built from validated bipolar self-management approaches</h2>
            </div>
            <div className="foundation-grid">
              {suiteFoundations.map((item) => (
                <article key={item.title} className="foundation-card">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
