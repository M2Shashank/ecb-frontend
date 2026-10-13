import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { loginUser, registerUser, setAuthenticatedUser } from '../utils/auth'
import './AuthPage.css'

function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isSignup = mode === 'signup'

  const handleChange = (event) => {
    setForm((currentForm) => ({ ...currentForm, [event.target.name]: event.target.value }))
    setMessage('')
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isSignup && !form.username.trim()) {
      setError('Enter either your username or email to log in.')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      const identifier = form.username.trim()
      const credentials = isSignup
        ? {
            username: identifier,
            email: form.email.trim(),
            password: form.password,
          }
        : {
            username: identifier.includes('@') ? undefined : identifier,
            email: identifier.includes('@') ? identifier : undefined,
            password: form.password,
          }
      const response = isSignup
        ? await registerUser(credentials)
        : await loginUser(credentials)
      setAuthenticatedUser(response.user)
      const destination = location.state?.from || '/'
      navigate(destination, { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <Header cartQuantity={0} />
      <main className="auth-main">
        <section className="auth-card" aria-labelledby="auth-title">
          <div className="auth-tabs" role="tablist" aria-label="Account actions">
            <button
              className={mode === 'login' ? 'active' : ''}
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              onClick={() => { setMode('login'); setMessage('') }}
            >
              LOGIN
            </button>
            <button
              className={mode === 'signup' ? 'active' : ''}
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              onClick={() => { setMode('signup'); setMessage('') }}
            >
              SIGN UP
            </button>
          </div>

          <h1 id="auth-title">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
          <p className="auth-intro">
            {isSignup ? 'Join the Bonkers Corner community.' : 'Log in to continue shopping.'}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              {isSignup ? 'Username' : 'Username or email'}
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                required
                autoComplete={isSignup ? 'username' : 'username'}
                placeholder={isSignup ? '' : 'Enter username or email'}
              />
            </label>
            {isSignup && (
              <label>
                Email
                <input name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />
              </label>
            )}
            <label>
              Password
              <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} autoComplete={isSignup ? 'new-password' : 'current-password'} />
            </label>
            <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? 'PLEASE WAIT...' : isSignup ? 'CREATE ACCOUNT' : 'LOG IN'}</button>
          </form>

          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-message" role="status">{message}</p>}
          <Link className="auth-home-link" to="/">Continue shopping</Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default AuthPage
