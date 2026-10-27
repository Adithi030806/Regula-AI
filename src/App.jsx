import { useState } from 'react'
import './App.css'

const categories = [
  'Electronics',
  'Electrical appliances',
  'Toys',
  'Cement and construction',
  'Packaged drinking water',
  'Food and consumer goods',
  'Other',
]

function Brand({ onClick }) {
  return (
    <button className="brand" onClick={onClick} aria-label="Regula-AI home" type="button">
      <span className="brand-mark">R</span>
      <span>Regula<span className="brand-blue">AI</span></span>
    </button>
  )
}

function App() {
  const [page, setPage] = useState('home')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [product, setProduct] = useState('')
  const [category, setCategory] = useState('Electrical appliances')
  const [country, setCountry] = useState('India')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [report, setReport] = useState(null)
  const [showWorkflow, setShowWorkflow] = useState(false)

  const goTo = (nextPage) => {
    setPage(nextPage)
    setMobileMenu(false)
    setAuthMessage('')
    setShowWorkflow(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startAnalysis = () => goTo('analysis')

  const submitAuth = (event) => {
    event.preventDefault()
    setAuthMessage(
      'This is a demonstration form. Connect an authentication service to create accounts and sign in securely.'
    )
  }

  
const submitAnalysis = async (event) => {
  event.preventDefault()

  try {
    const response = await fetch('http://localhost:5000/api/assess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product,
        category,
        country,
        company,
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Assessment request failed.')
    }

    setReport({
      ...data.assessment,
      message: data.message,
    })

    goTo('results')
  } catch (error) {
    alert(
      'Could not connect to the Regula-AI backend. Make sure the server is running on port 5000.'
    )
    console.error('Assessment error:', error)
  }
}

  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="nav-inner">
          <Brand onClick={() => goTo('home')} />

          <button
            className="mobile-menu"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenu}
            type="button"
          >
            {mobileMenu ? '✕' : '☰'}
          </button>

          <nav className={`nav-links ${mobileMenu ? 'open' : ''}`}>
            <button className="nav-link" onClick={() => goTo('home')} type="button">Home</button>
            <button
              className="nav-link"
              onClick={() => {
                goTo('home')
                setTimeout(() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' }), 100)
              }}
              type="button"
            >
              Solutions
            </button>
            <button
              className="nav-link"
              onClick={() => {
                goTo('home')
                setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 100)
              }}
              type="button"
            >
              How it works
            </button>
            <button className="nav-link mobile-only" onClick={() => goTo('login')} type="button">Sign in</button>
            <button className="button button-primary nav-cta" onClick={startAnalysis} type="button">
              Start assessment <span aria-hidden="true">↗</span>
            </button>
          </nav>
          <button className="nav-signin" onClick={() => goTo('login')} type="button">Sign in</button>
        </div>
      </header>

      {page === 'home' && (
        <main>
          <section className="hero section-wrap" id="home">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-line" /> BUILT FOR INDIAN BUSINESSES</div>
              <h1>Make compliance clearer. <span className="gradient-text">Make business decisions smarter.</span></h1>
              <p className="hero-description">
                Explore product standards, assess market opportunities and understand
                the business implications of certification — in one practical workspace.
              </p>
              <div className="hero-actions">
                <button className="button button-primary button-large" onClick={startAnalysis} type="button">
                  Assess your product <span aria-hidden="true">↗</span>
                </button>
                <button
                  className="button button-secondary button-large"
                  onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
                  type="button"
                >
                  Explore the platform
                </button>
              </div>
              <div className="trust-line">
                <span className="trust-check">✓</span> Designed for manufacturers, importers and MSMEs
              </div>
            </div>

            <div className="hero-visual">
              <div className="dashboard-preview">
                <div className="preview-top">
                  <div>
                    <span className="preview-kicker">PRODUCT INTELLIGENCE WORKSPACE</span>
                    <h3>Assessment overview</h3>
                  </div>
                  <span className="preview-badge">DEMO</span>
                </div>

                <div className="preview-product">
                  <div className="product-symbol" aria-hidden="true">▤</div>
                  <div>
                    <strong>Electric kettle</strong>
                    <p>Illustrative product assessment</p>
                  </div>
                  <span className="product-arrow" aria-hidden="true">↗</span>
                </div>

                <div className="preview-grid">
                  <div className="metric-card">
                    <span>Compliance research</span>
                    <strong>01</strong>
                    <small>Standards to investigate</small>
                  </div>
                  <div className="metric-card">
                    <span>Market intelligence</span>
                    <strong>02</strong>
                    <small>Demand and competitors</small>
                  </div>
                  <div className="metric-card">
                    <span>Financial planning</span>
                    <strong>03</strong>
                    <small>Costs and scenarios</small>
                  </div>
                  <div className="metric-card">
                    <span>Growth planning</span>
                    <strong>04</strong>
                    <small>Routes to market</small>
                  </div>
                </div>

                <div className="preview-bottom">
                  <span className="preview-bottom-icon">i</span>
                  <div>
                    <strong>Evidence before decisions</strong>
                    <p>Separate verified sources from estimates and assumptions.</p>
                  </div>
                </div>
              </div>

              <div className="workflow-popup-wrapper">
                <button
                  className="workflow-trigger"
                  type="button"
                  onClick={() => setShowWorkflow((open) => !open)}
                  aria-expanded={showWorkflow}
                  aria-controls="workflow-details"
                >
                  <span className="workflow-trigger-icon" aria-hidden="true">i</span>
                  <span>How it connects</span>
                  <span className="workflow-trigger-arrow" aria-hidden="true">{showWorkflow ? '−' : '+'}</span>
                </button>

                {showWorkflow && (
                  <div className="workflow-popup" id="workflow-details" role="region" aria-label="Connected workflow details">
                    <button
                      className="workflow-close"
                      type="button"
                      onClick={() => setShowWorkflow(false)}
                      aria-label="Close workflow details"
                    >
                      ×
                    </button>
                    <span className="workflow-popup-label">ONE CONNECTED WORKFLOW</span>
                    <h3>From compliance to growth</h3>
                    <p>
                      Explore requirements, investigate market demand, estimate
                      financial implications and identify potential growth opportunities.
                    </p>
                    <div className="workflow-popup-steps">
                      <span>01 Compliance</span>
                      <span>02 Market</span>
                      <span>03 Financials</span>
                      <span>04 Growth</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="proof-strip">
            <div><strong>01</strong><span>Understand compliance pathways</span></div>
            <div><strong>02</strong><span>Evaluate market opportunities</span></div>
            <div><strong>03</strong><span>Plan with business context</span></div>
          </section>

          <section className="features-section section-wrap" id="solutions">
            <div className="section-heading">
              <span className="eyebrow">A CONNECTED BUSINESS WORKFLOW</span>
              <h2>From product requirements to <span className="muted-heading">commercial decisions.</span></h2>
              <p>Bring regulatory research and business planning together without confusing estimates with official requirements.</p>
            </div>

            <div className="feature-grid">
              <article className="feature-card">
                <div className="feature-icon blue">01</div>
                <span className="feature-number">COMPLIANCE INTELLIGENCE</span>
                <h3>BIS requirements research</h3>
                <p>Investigate potentially applicable Indian Standards, certification routes, official references and document-readiness needs.</p>
                <button className="text-link" onClick={startAnalysis} type="button">Assess a product <span>→</span></button>
              </article>
              <article className="feature-card">
                <div className="feature-icon teal">02</div>
                <span className="feature-number">MARKET INTELLIGENCE</span>
                <h3>Demand and competition</h3>
                <p>Structure research around customer segments, competitor products, price positioning and available demand signals.</p>
                <button className="text-link" onClick={startAnalysis} type="button">Explore market factors <span>→</span></button>
              </article>
              <article className="feature-card">
                <div className="feature-icon amber">03</div>
                <span className="feature-number">FINANCIAL PLANNING</span>
                <h3>Certification impact</h3>
                <p>Evaluate possible testing, compliance and launch costs alongside pricing, margins and different sales scenarios.</p>
                <button className="text-link" onClick={startAnalysis} type="button">Plan business impact <span>→</span></button>
              </article>
              <article className="feature-card">
                <div className="feature-icon violet">04</div>
                <span className="feature-number">GROWTH STRATEGY</span>
                <h3>Market expansion</h3>
                <p>Identify customer groups, distribution options and potential opportunities to investigate before expanding.</p>
                <button className="text-link" onClick={startAnalysis} type="button">Explore opportunities <span>→</span></button>
              </article>
            </div>
          </section>

          <section className="how-section" id="how-it-works">
            <div className="section-wrap">
              <div className="section-heading">
                <span className="eyebrow">HOW IT WORKS</span>
                <h2>A practical starting point for your next decision.</h2>
                <p>Use a structured workflow to understand what needs checking and what information is still missing.</p>
              </div>
              <div className="steps">
                <div className="step-card"><span>01</span><h3>Describe</h3><p>Enter your product, category, company context and intended market.</p></div>
                <div className="step-card"><span>02</span><h3>Investigate</h3><p>Review relevant official requirements and gather market evidence.</p></div>
                <div className="step-card"><span>03</span><h3>Decide</h3><p>Compare costs, risks and opportunities before choosing your next action.</p></div>
              </div>
            </div>
          </section>

          <section className="cta-section section-wrap">
            <div className="cta-panel">
              <div>
                <span className="eyebrow">START WITH YOUR PRODUCT</span>
                <h2>Get a clearer view of your next business move.</h2>
                <p>Start an initial assessment and organise the questions that matter to your product.</p>
              </div>
              <button className="button button-primary button-large" onClick={startAnalysis} type="button">Start assessment <span>↗</span></button>
            </div>
          </section>
        </main>
      )}

      {(page === 'login' || page === 'register') && (
        <main className="auth-page">
          <section className="auth-decoration">
            <button className="back-link" onClick={() => goTo('home')} type="button">← Back to home</button>
            <div className="eyebrow"><span className="eyebrow-line" /> REGULA-AI WORKSPACE</div>
            <h1>{page === 'login' ? 'Welcome back to better-informed decisions.' : 'Build your business with greater clarity.'}</h1>
            <p>Organise product compliance research and business planning in one place.</p>
            <div className="auth-benefits">
              <div><span>✓</span> Product compliance research</div>
              <div><span>✓</span> Market and competitor assessment</div>
              <div><span>✓</span> Cost and growth planning</div>
            </div>
            <div className="auth-note">
              <strong>Designed for business teams</strong>
              <p>For manufacturers, importers and growing MSMEs.</p>
            </div>
          </section>

          <section className="auth-card">
            <div className="auth-mobile-brand"><Brand onClick={() => goTo('home')} /></div>
            <span className="eyebrow">{page === 'login' ? 'ACCOUNT ACCESS' : 'GET STARTED'}</span>
            <h2>{page === 'login' ? 'Sign in' : 'Create your account'}</h2>
            <p className="auth-subtitle">{page === 'login' ? 'Enter your details to continue to the workspace.' : 'Set up your details to explore the platform.'}</p>

            <form className="auth-form" onSubmit={submitAuth}>
              {page === 'register' && (
                <label>
                  Company or business name
                  <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Enter your company name" required />
                </label>
              )}
              <label>
                Work email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" minLength={6} required />
              </label>
              <button className="button button-primary auth-submit" type="submit">
                {page === 'login' ? 'Sign in to workspace' : 'Create demo account'} <span>→</span>
              </button>
              {authMessage && <p className="form-message" role="status">{authMessage}</p>}
            </form>

            <p className="auth-switch">
              {page === 'login' ? 'New to Regula-AI?' : 'Already have an account?'}
              <button className="text-link" onClick={() => goTo(page === 'login' ? 'register' : 'login')} type="button">
                {page === 'login' ? 'Create an account' : 'Sign in'}
              </button>
            </p>
            <p className="auth-disclaimer">Prototype only. No account is created and no credentials are stored or authenticated.</p>
          </section>
        </main>
      )}

      {page === 'analysis' && (
        <main className="workspace section-wrap">
          <button className="back-link" onClick={() => goTo('home')} type="button">← Back to home</button>
          <div className="workspace-heading">
            <span className="eyebrow">PRODUCT INTELLIGENCE</span>
            <h1>Start a product assessment.</h1>
            <p>Tell us about your product to create an initial assessment workspace. The current prototype does not query live BIS databases or market feeds.</p>
          </div>

          <form className="analysis-form" onSubmit={submitAnalysis}>
            <div className="form-section-title">
              <span>01</span>
              <div><h3>Product information</h3><p>Describe the product you want to evaluate.</p></div>
            </div>
            <label htmlFor="product">Product name *</label>
            <input id="product" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. Electric kettle, LED lamp, toy" required />
            <label htmlFor="category">Product category *</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
            <div className="form-divider" />
            <div className="form-section-title">
              <span>02</span>
              <div><h3>Business context</h3><p>Add context to help organise your research.</p></div>
            </div>
            <label htmlFor="company">Company name (optional)</label>
            <input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Enter your business name" />
            <label htmlFor="country">Target market *</label>
            <select id="country" value={country} onChange={(e) => setCountry(e.target.value)}>
              <option>India</option>
              <option>International markets</option>
            </select>
            <button className="button button-primary analysis-submit" type="submit">Prepare assessment workspace <span>↗</span></button>
            <p className="form-note">This creates a prototype report structure, not a verified certification decision or live market analysis.</p>
          </form>
        </main>
      )}

      {page === 'results' && report && (
        <main className="workspace section-wrap">
          <button className="back-link" onClick={() => goTo('analysis')} type="button">← Edit product details</button>
          <div className="workspace-heading">
            <span className="eyebrow">ASSESSMENT WORKSPACE</span>
            <h1>{report.product}</h1>
            <p>{report.category} · Target market: {report.country}{report.company ? ` · ${report.company}` : ''}</p>
          </div>

          <div className="report-banner">
            <span className="report-banner-icon">i</span>
            <div><strong>Prototype assessment — research required</strong><p>The sections below organise your investigation. They are not verified findings, official BIS advice or live market results.</p></div>
          </div>

          <div className="report-grid">
            <article className="report-card">
              <span className="report-index">01 / COMPLIANCE</span>
              <h3>BIS requirements</h3>
              <p>Identify the product's exact specification and intended use, then check whether a relevant Indian Standard and mandatory certification requirement apply.</p>
              <div className="report-next"><strong>Next action</strong><span>Search official BIS sources and confirm the applicable standard and current order.</span></div>
              <a href="https://www.bis.gov.in/" target="_blank" rel="noreferrer" className="text-link">Visit official BIS website ↗</a>
            </article>
            <article className="report-card">
              <span className="report-index">02 / MARKET</span>
              <h3>Demand and competition</h3>
              <p>Research target customers, competing products, comparable prices, distribution channels and evidence of demand in your chosen market.</p>
              <div className="report-next"><strong>Next action</strong><span>Collect dated competitor and pricing evidence from relevant sources.</span></div>
            </article>
            <article className="report-card">
              <span className="report-index">03 / FINANCIALS</span>
              <h3>Certification cost and sales</h3>
              <p>Build a cost model covering testing, certification, product changes, production, distribution and launch expenses.</p>
              <div className="report-next"><strong>Next action</strong><span>Use supplier quotations and your own sales assumptions to model scenarios.</span></div>
            </article>
            <article className="report-card">
              <span className="report-index">04 / GROWTH</span>
              <h3>Business opportunities</h3>
              <p>Investigate whether meeting applicable requirements could help you access particular buyers, channels or markets. Certification alone does not guarantee sales growth.</p>
              <div className="report-next"><strong>Next action</strong><span>Validate buyer requirements and compare the potential return with the total cost.</span></div>
            </article>
          </div>

          <div className="report-footer">
            <div><strong>Recommended next step</strong><p>Collect official compliance references and product-specific market evidence before making an investment decision.</p></div>
            <button className="button button-primary" onClick={() => goTo('analysis')} type="button">Assess another product ↗</button>
          </div>
        </main>
      )}

      <footer className="footer">
        <div className="footer-main">
          <div>
            <Brand onClick={() => goTo('home')} />
            <p>Compliance intelligence and business planning for product-led businesses.</p>
          </div>
          <div className="footer-links">
            <button onClick={() => goTo('home')} type="button">Home</button>
            <button onClick={startAnalysis} type="button">Product assessment</button>
            <button onClick={() => goTo('login')} type="button">Sign in</button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Regula-AI · Student project prototype</span>
          <span>Not affiliated with BIS. Verify requirements through official sources.</span>
        </div>
      </footer>
    </div>
  )
}

export default App
