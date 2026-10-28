
import { useState } from 'react'
import './App.css'

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
).replace(/\/$/, '')

const domains = [
  {
    id: 'compliance',
    number: '01',
    name: 'Compliance research',
    title: 'Standards to investigate',
    description: 'Explore potential BIS requirements, product standards and the steps needed to verify compliance.',
    endpoint: '/api/compliance-checklist',
  },
  {
    id: 'market',
    number: '02',
    name: 'Market intelligence',gg
    title: 'Demand and competitors',
    description: 'Investigate customer needs, competing products, pricing and potential sales opportunities.',
    endpoint: '/api/analyze-product',
  },
  {
    id: 'financial',
    number: '03',
    name: 'Financial planning',
    title: 'Costs and scenarios',
    description: 'Estimate revenue, expenses, operating profit and break-even sales using your own assumptions.',
    endpoint: '/api/financial-scenario',
  },
  {
    id: 'growth',
    number: '04',
    name: 'Growth planning',
    title: 'Routes to market',
    description: 'Explore potential customers, distribution channels and opportunities to expand your business.',
    endpoint: '/api/analyze-product',
  },
]

const initialForm = {
  product: '',
  description: '',
  company: '',
  country: 'India',
  category: 'Electrical appliances',
  price: '500',
  unitCost: '300',
  monthlyUnits: '100',
  fixedCosts: '10000',
  complianceCost: '0',
}

async function apiRequest(endpoint, body) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error(
      `Cannot reach the backend at ${API_BASE_URL}. Check that FastAPI is running and that the URL is correct.`
    )
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const detail = data.detail || data.message
    throw new Error(
      typeof detail === 'string'
        ? detail
        : `The server returned HTTP ${response.status}.`
    )
  }

  return data
}

function Brand({ onClick }) {
  return (
    <button
      className="brand"
      onClick={onClick}
      aria-label="Regula-AI home"
      type="button"
    >
      <span className="brand-mark">R</span>
      <span>Regula<span className="brand-blue">AI</span></span>
    </button>
  )
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}

function DataPanel({ title, children }) {
  return (
    <article className="report-card">
      <h3>{title}</h3>
      {children}
    </article>
  )
}

function App() {
  const [page, setPage] = useState('home')
  const [domain, setDomain] = useState('compliance')
  const [form, setForm] = useState(initialForm)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showWorkflow, setShowWorkflow] = useState(false)
  const [authMessage, setAuthMessage] = useState('')
  const [authMode, setAuthMode] = useState('login')

  const activeDomain = domains.find((item) => item.id === domain) || domains[0]

  function goTo(nextPage) {
    setPage(nextPage)
    setError('')
    setAuthMessage('')
    setMobileMenu(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

function startAssessment(domainId) {
    setDomain(domainId)
    setReport(null)
    setError('')
    goTo('assessment')
}

  async function submitAssessment(event) {
    event.preventDefault()
    setError('')
    setReport(null)
    setLoading(true)

    try {
      let data

      if (domain === 'financial') {
        data = await apiRequest('/api/financial-scenario', {
          product_name: form.product.trim(),
          selling_price_per_unit: Number(form.price),
          manufacturing_cost_per_unit: Number(form.unitCost),
          expected_monthly_units: Number(form.monthlyUnits),
          monthly_fixed_costs: Number(form.fixedCosts),
          one_time_compliance_cost: Number(form.complianceCost),
        })
      } else if (domain === 'compliance') {
        data = await apiRequest('/api/compliance-checklist', {
          product_name: form.product.trim(),
          description: form.description.trim(),
          target_market: form.country,
        })
      } else {
        data = await apiRequest('/api/analyze-product', {
          product_name: form.product.trim(),
          description: form.description.trim(),
          target_market: form.country,
        })
      }

      setReport({ domain, data })
      setPage('results')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message || 'The assessment could not be completed.')
    } finally {
      setLoading(false)
    }
  }

  function submitDemoAuth(event) {
    event.preventDefault()
    setAuthMessage(
      'This is a frontend demo. Sign-in and account creation are not connected to a real authentication service yet. No account was created.'
    )
  }

  function openAuth(mode) {
    setAuthMode(mode)
    goTo('auth')
  }

  function renderList(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return <p>No structured information was returned. Review the available report and verify important details.</p>
    }

    return (
      <ul className="result-list">
        {items.map((item, index) => (
          <li key={index}>
            {typeof item === 'string' ? item : (
              <>
                <strong>{item.task || item.title || item.action || 'Next step'}</strong>
                {item.status && <p>Status: {item.status}</p>}
                {item.next_action && <p>{item.next_action}</p>}
                {item.description && <p>{item.description}</p>}
                {item.source && (
                  <p>
                    <a href={item.source} target="_blank" rel="noreferrer">
                      View reference ↗
                    </a>
                  </p>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    )
  }

  function renderText(value) {
    return typeof value === 'string' && value.trim()
      ? <p className="report-copy">{value}</p>
      : <p>No information was returned for this section. Further research may be required.</p>
  }

  function renderResults() {
    if (!report) return null

    const data = report.data

    if (report.domain === 'compliance') {
      return (
        <>
          <DataPanel title="Standards to investigate">
            <p>These are research tasks, not confirmation that certification is mandatory.</p>
            {renderList(data.checklist)}
          </DataPanel>
          <DataPanel title="Product information still needed">
            {renderList(data.information_needed)}
          </DataPanel>
          {data.verification && (
            <DataPanel title="Verification status">
              {renderList(
                Object.entries(data.verification).map(([key, value]) => ({
                  task: key.replaceAll('_', ' '),
                  status: value,
                }))
              )}
            </DataPanel>
          )}
          <DataPanel title="Recommended next steps">
            <p>Check the current standard scope, applicable Quality Control Orders, amendments, exemptions and effective dates.</p>
            <a className="text-link" href="https://www.bis.gov.in/" target="_blank" rel="noreferrer">
              Visit official BIS website ↗
            </a>
          </DataPanel>
          <p className="form-note">{data.disclaimer}</p>
        </>
      )
    }

    if (report.domain === 'financial') {
      const result = data.results || {}
      const money = (value) => value == null
        ? 'Not available'
        : new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: data.currency || 'INR',
            maximumFractionDigits: 2,
          }).format(value)

      return (
        <>
          <div className="report-grid">
            <DataPanel title="Estimated monthly revenue">
              <strong className="financial-value">{money(result.estimated_monthly_revenue)}</strong>
            </DataPanel>
            <DataPanel title="Estimated monthly operating profit">
              <strong className="financial-value">{money(result.estimated_monthly_operating_profit_before_one_time_cost)}</strong>
            </DataPanel>
            <DataPanel title="Monthly break-even sales">
              <strong className="financial-value">
                {result.estimated_monthly_break_even_units == null
                  ? 'Not reachable with current inputs'
                  : `${result.estimated_monthly_break_even_units} units`}
              </strong>
            </DataPanel>
            <DataPanel title="First-month profit after one-time costs">
              <strong className="financial-value">{money(result.estimated_first_month_profit_after_one_time_cost)}</strong>
            </DataPanel>
          </div>
          <DataPanel title="Your assumptions">
            {renderList(Object.entries(data.input_assumptions || {}).map(([key, value]) => ({
              task: key.replaceAll('_', ' '),
              description: String(value),
            })))}
          </DataPanel>
          <DataPanel title="What this means">
            {renderText(data.interpretation)}
          </DataPanel>
          <p className="form-note">{data.disclaimer}</p>
        </>
      )
    }

    const intelligence = data.market_intelligence || {}

    if (report.domain === 'market') {
      return (
        <>
          <DataPanel title="Demand and customer needs">
            {renderText(intelligence.market_demand)}
          </DataPanel>
          <DataPanel title="Competitors and business impact">
            {renderText(intelligence.business_impact)}
          </DataPanel>
          <DataPanel title="Recommended actions">
            {renderList(intelligence.recommended_actions)}
          </DataPanel>
          <DataPanel title="AI product analysis">
            {renderText(data.analysis)}
          </DataPanel>
          <p className="form-note">{data.disclaimer || 'Market conclusions require independent evidence and verification.'}</p>
        </>
      )
    }

    return (
      <>
        <DataPanel title="Routes to market">
          {renderText(intelligence.growth_opportunities)}
        </DataPanel>
        <DataPanel title="Demand and customer context">
          {renderText(intelligence.market_demand)}
        </DataPanel>
        <DataPanel title="Recommended growth actions">
          {renderList(intelligence.recommended_actions)}
        </DataPanel>
        <DataPanel title="Product analysis">
          {renderText(data.analysis)}
        </DataPanel>
        <p className="form-note">{data.disclaimer || 'Validate business opportunities before making investment decisions.'}</p>
      </>
    )
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="nav-inner">
          <Brand onClick={() => goTo('home')} />
          <button
            className="mobile-menu"
            onClick={() => setMobileMenu((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenu}
            type="button"
          >
            {mobileMenu ? '✕' : '☰'}
          </button>
          <nav className={`nav-links ${mobileMenu ? 'open' : ''}`}>
            <button className="nav-link" onClick={() => goTo('home')} type="button">Home</button>
            <button className="nav-link" onClick={() => {
              goTo('home')
              setTimeout(() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' }), 100)
            }} type="button">Solutions</button>
            <button className="nav-link" onClick={() => {
              goTo('home')
              setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 100)
            }} type="button">How it works</button>
            <button className="nav-link mobile-only" onClick={() => openAuth('login')} type="button">Sign in</button>
            <button className="button button-primary nav-cta" onClick={() => startAssessment('compliance')} type="button">
              Start assessment <span>↗</span>
            </button>
          </nav>
          <button className="nav-signin" onClick={() => openAuth('login')} type="button">Sign in</button>
        </div>
      </header>

      {page === 'home' && (
        <main>
          <section className="hero section-wrap" id="home">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-line" /> BUILT FOR INDIAN BUSINESSES</div>
              <h1>Make compliance clearer. <span className="gradient-text">Make business decisions smarter.</span></h1>
              <p className="hero-description">
                Explore product standards, assess market opportunities and understand business costs and growth routes in one practical workspace.
              </p>
              <div className="hero-actions">
                <button className="button button-primary button-large" onClick={() => startAssessment('compliance')} type="button">
                  Assess your product ↗
                </button>
                <button className="button button-secondary button-large" onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })} type="button">
                  Explore the platform
                </button>
              </div>
              <div className="trust-line"><span className="trust-check">✓</span> Designed for manufacturers, importers and MSMEs</div>
            </div>

            <div className="hero-visual">
              <div className="dashboard-preview">
                <div className="preview-top">
                  <div>
                    <span className="preview-kicker">PRODUCT INTELLIGENCE WORKSPACE</span>
                    <h3>Four connected workflows</h3>
                  </div>
                  <span className="preview-badge">REGULA-AI</span>
                </div>
                <div className="preview-grid">
                  {domains.map((item) => (
                    <button className="metric-card domain-preview-card" key={item.id} onClick={() => startAssessment(item.id)} type="button">
                      <span>{item.name}</span>
                      <strong>{item.number}</strong>
                      <small>{item.title}</small>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="workflow-section section-wrap">
            <button className="workflow-trigger" type="button" onClick={() => setShowWorkflow((open) => !open)} aria-expanded={showWorkflow}>
              <span className="workflow-trigger-icon">i</span>
              <span>How it connects</span>
              <span className="workflow-trigger-arrow">{showWorkflow ? '−' : '+'}</span>
            </button>
            {showWorkflow && (
              <div className="workflow-popup workflow-popup-static">
                <span className="workflow-popup-label">ONE CONNECTED WORKFLOW</span>
                <h3>From compliance to growth</h3>
                <p>Research requirements, understand the market, estimate financial scenarios and explore routes to market. Each workflow has its own form and results.</p>
                <div className="workflow-popup-steps">
                  {domains.map((item) => <span key={item.id}>{item.number} {item.name}</span>)}
                </div>
              </div>
            )}S
          </section>

          <section className="proof-strip">
            <div><strong>01</strong><span>Standards to investigate</span></div>
            <div><strong>02</strong><span>Demand and competitors</span></div>
            <div><strong>03</strong><span>Costs, scenarios and growth</span></div>
          </section>

          <section className="features-section section-wrap" id="solutions">
            <SectionHeading
              eyebrow="FOUR SPECIALISED WORKFLOWS"
              title={<>One platform. <span className="muted-heading">Four different decisions.</span></>}
              description="Choose a domain to open a dedicated assessment and see information relevant to that business question."
            />
            <div className="feature-grid">
              {domains.map((item) => (
                <article className="feature-card" key={item.id}>
                  <div className="feature-icon">{item.number}</div>
                  <span className="feature-number">{item.name.toUpperCase()}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <button className="text-link" onClick={() => startAssessment(item.id)} type="button">
                    Open {item.name.toLowerCase()} <span>→</span>
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="how-section" id="how-it-works">
            <div className="section-wrap">
              <SectionHeading
                eyebrow="HOW IT WORKS"
                title="From product information to a clearer next step."
                description="Enter relevant details, review the resulting analysis and independently verify important decisions."
              />
              <div className="steps">
                <div className="step-card"><span>01</span><h3>Describe</h3><p>Provide product details and the business context for your chosen workflow.</p></div>
                <div className="step-card"><span>02</span><h3>Analyse</h3><p>Use the relevant compliance checklist, AI research or financial calculations.</p></div>
                <div className="step-card"><span>03</span><h3>Plan</h3><p>Review findings, assumptions and practical next steps before acting.</p></div>
              </div>
            </div>
          </section>

          <section className="cta-section section-wrap">
            <div className="cta-panel">
              <div>
                <span className="eyebrow">START WITH YOUR PRODUCT</span>
                <h2>Choose the business question you need to answer.</h2>
                <p>Start with compliance, market demand, financial planning or growth.</p>
              </div>
              <button className="button button-primary button-large" onClick={() => startAssessment('compliance')} type="button">Start assessment ↗</button>
            </div>
          </section>
        </main>
      )}

      {page === 'assessment' && (
        <main className="workspace section-wrap">
          <button className="back-link" onClick={() => goTo('home')} type="button">← Back to home</button>
          <div className="workspace-heading">
            <span className="eyebrow">{activeDomain.name.toUpperCase()}</span>
            <h1>{activeDomain.title}</h1>
            <p>{activeDomain.description}</p>
          </div>

          <div className="domain-switcher" aria-label="Choose assessment domain">
            {domains.map((item) => (
              <button key={item.id} className={`domain-tab ${domain === item.id ? 'active' : ''}`} onClick={() => startAssessment(item.id)} type="button">
                {item.number} {item.name}
              </button>
            ))}
          </div>

          <form className="analysis-form" onSubmit={submitAssessment}>
            <div className="form-section-title">
              <span>01</span>
              <div><h3>Product information</h3><p>Enter enough detail to make the assessment useful.</p></div>
            </div>
            <label htmlFor="product">Product name *</label>
            <input id="product" value={form.product} onChange={(e) => updateForm('product', e.target.value)} placeholder="e.g. Electric kettle, LED lamp or toy" minLength={2} maxLength={150} required />

            {domain !== 'financial' && (
              <>
                <label htmlFor="description">Product description and intended use *</label>
                <textarea id="description" value={form.description} onChange={(e) => updateForm('description', e.target.value)} placeholder="Describe materials, specifications, intended use and product model if known." minLength={5} maxLength={2000} rows={4} required />
                <label htmlFor="country">Target market *</label>
                <select id="country" value={form.country} onChange={(e) => updateForm('country', e.target.value)}>
                  <option>India</option>
                  <option>International markets</option>
                </select>
              </>
            )}

            {domain === 'financial' && (
              <>
                <div className="form-divider" />
                <div className="form-section-title">
                  <span>02</span>
                  <div><h3>Financial assumptions</h3><p>Use your own estimates. These are not official certification fees.</p></div>
                </div>
                <label htmlFor="price">Selling price per unit (₹) *</label>
                <input id="price" type="number" min="0.01" step="0.01" value={form.price} onChange={(e) => updateForm('price', e.target.value)} required />
                <label htmlFor="unitCost">Manufacturing cost per unit (₹) *</label>
                <input id="unitCost" type="number" min="0" step="0.01" value={form.unitCost} onChange={(e) => updateForm('unitCost', e.target.value)} required />
                <label htmlFor="monthlyUnits">Expected monthly units sold *</label>
                <input id="monthlyUnits" type="number" min="1" step="1" value={form.monthlyUnits} onChange={(e) => updateForm('monthlyUnits', e.target.value)} required />
                <label htmlFor="fixedCosts">Monthly fixed costs (₹) *</label>
                <input id="fixedCosts" type="number" min="0" step="0.01" value={form.fixedCosts} onChange={(e) => updateForm('fixedCosts', e.target.value)} required />
                <label htmlFor="complianceCost">One-time compliance or setup estimate (₹)</label>
                <input id="complianceCost" type="number" min="0" step="0.01" value={form.complianceCost} onChange={(e) => updateForm('complianceCost', e.target.value)} />
              </>
            )}

            {domain !== 'financial' && (
              <>
                <div className="form-divider" />
                <label htmlFor="company">Company name (optional)</label>
                <input id="company" value={form.company} onChange={(e) => updateForm('company', e.target.value)} placeholder="Enter your business name" maxLength={150} />
              </>
            )}

            {error && <div className="error-message" role="alert">{error}</div>}
            <button className="button button-primary analysis-submit" type="submit" disabled={loading}>
              {loading ? 'Preparing your assessment…' : `Generate ${activeDomain.name.toLowerCase()} report ↗`}
            </button>
            <p className="form-note">
              {domain === 'financial'
                ? 'Results are calculations based on your assumptions, not guaranteed business outcomes.'
                : 'AI output is preliminary. Verify legal requirements and market claims using reliable sources.'}
            </p>
          </form>
        </main>
      )}

      {page === 'results' && report && (
        <main className="workspace section-wrap">
          <button className="back-link" onClick={() => {
            setDomain(report.domain)
            goTo('assessment')
          }} type="button">← Edit assessment</button>
          <div className="workspace-heading">
            <span className="eyebrow">{domains.find((item) => item.id === report.domain)?.name.toUpperCase()}</span>
            <h1>{report.data.product_name || report.data.product || form.product}</h1>
            <p>{form.category} · Target market: {form.country}{form.company ? ` · ${form.company}` : ''}</p>
          </div>
          <div className="report-banner">
            <span className="report-banner-icon">i</span>
            <div>
              <strong>Assessment results</strong>
              <p>Review the information below. AI-generated conclusions and assumptions are not official certification decisions or independently verified market data.</p>
            </div>
          </div>
          <div className="report-grid">{renderResults()}</div>
          <div className="report-footer">
            <div><strong>What next?</strong><p>Verify key facts, record missing information and use the results as a starting point for further research.</p></div>
            <button className="button button-primary" onClick={() => startAssessment(report.domain)} type="button">Assess another product ↗</button>
          </div>
        </main>
      )}

      {page === 'auth' && (
        <main className="auth-page">
          <section className="auth-decoration">
            <button className="back-link" onClick={() => goTo('home')} type="button">← Back to home</button>
            <div className="eyebrow"><span className="eyebrow-line" /> REGULA-AI WORKSPACE</div>
            <h1>{authMode === 'login' ? 'Welcome back to better-informed decisions.' : 'Start planning your business with clarity.'}</h1>
            <p>Explore compliance research, market intelligence, financial scenarios and growth opportunities.</p>
            <div className="auth-benefits">
              <div><span>✓</span> Product compliance research</div>
              <div><span>✓</span> Market and competitor assessment</div>
              <div><span>✓</span> Cost and growth planning</div>
            </div>
          </section>
          <section className="auth-card">
            <div className="auth-mobile-brand"><Brand onClick={() => goTo('home')} /></div>
            <span className="eyebrow">{authMode === 'login' ? 'ACCOUNT ACCESS' : 'GET STARTED'}</span>
            <h2>{authMode === 'login' ? 'Sign in' : 'Create your account'}</h2>
            <p className="auth-subtitle">Use the demo interface to preview the account experience.</p>
            <form className="auth-form" onSubmit={submitDemoAuth}>
              {authMode === 'register' && (
                <label>Company or business name
                  <input name="company" placeholder="Enter your company name" required />
                </label>
              )}
              <label>Work email
                <input type="email" name="email" placeholder="you@company.com" autoComplete="email" required />
              </label>
              <label>Password
                <input type="password" name="password" placeholder="Enter your password" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} minLength={6} required />
              </label>
              <button className="button button-primary auth-submit" type="submit">
                {authMode === 'login' ? 'Sign in' : 'Create demo account'} →
              </button>
              {authMessage && <p className="form-message" role="status">{authMessage}</p>}
            </form>
            <p className="auth-switch">
              {authMode === 'login' ? 'New to Regula-AI?' : 'Already have an account?'}
              <button className="text-link" onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login')
                setAuthMessage('')
              }} type="button">
                {authMode === 'login' ? 'Create an account' : 'Sign in'}
              </button>
            </p>
            <p className="auth-disclaimer">Demo only: authentication is not connected. No account is created and no credentials are stored or authenticated.</p>
          </section>
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
            <button onClick={() => startAssessment('compliance')} type="button">Product assessment</button>
            <button onClick={() => openAuth('login')} type="button">Sign in</button>
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
