'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { ADMIN_TAB_SESSION_KEY } from '@/components/admin/AdminTabSessionGuard'
import styles from './AdminLoginForm.module.css'

export function AdminLoginForm({ configured, redirectTo = '/admin' }: { configured: boolean; redirectTo?: string }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(false)
  const logoutStarted = useRef(false)

  useEffect(() => {
    if (logoutStarted.current) return
    logoutStarted.current = true
    sessionStorage.removeItem(ADMIN_TAB_SESSION_KEY)
    void fetch('/api/admin/logout', { method: 'POST', keepalive: true }).finally(() => setReady(true))
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json() as { error?: string }
      if (!response.ok) {
        setError(data.error ?? 'Sign in failed. Please check your details.')
        return
      }
      sessionStorage.setItem(ADMIN_TAB_SESSION_KEY, 'active')
      window.location.assign(redirectTo)
    } catch {
      setError('Could not reach the sign-in service. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.formPanel} aria-labelledby="admin-login-title">
          <a className={styles.brand} href="/" aria-label="Tejas Enterprises home">
            <Image src="/images/tejas/logo.jpeg" alt="Tejas Enterprises" width={72} height={72} priority />
            <span>TEJAS <small>ENTERPRISES</small></span>
          </a>

          <div className={styles.formContent}>
            <span className={styles.eyebrow}><LockKeyhole size={15} aria-hidden="true" /> ADMIN WORKSPACE</span>
            <h1 id="admin-login-title">Welcome back</h1>
            <p className={styles.intro}>Sign in to manage your website content and enquiries.</p>

            {configured ? (
              <form onSubmit={submit} className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="admin-username">Login ID</label>
                  <input
                    id="admin-username"
                    name="username"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={username}
                    onChange={(event) => { setUsername(event.target.value); setError('') }}
                    required
                    placeholder="Enter your login ID"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'admin-login-error' : undefined}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="admin-password">Password</label>
                  <div className={styles.passwordWrap}>
                    <input
                      id="admin-password"
                      name="password"
                      autoComplete="current-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => { setPassword(event.target.value); setError('') }}
                      required
                      placeholder="Enter your password"
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? 'admin-login-error' : undefined}
                    />
                    <button
                      className={styles.passwordToggle}
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                    </button>
                  </div>
                </div>
                {error && <p id="admin-login-error" className={styles.error} role="alert">{error}</p>}
                <button className={styles.submit} type="submit" disabled={busy || !ready}>
                  <span>{busy ? 'Signing in…' : ready ? 'Sign in' : 'Checking session…'}</span>
                  <ArrowRight size={19} aria-hidden="true" />
                </button>
              </form>
            ) : (
              <div className={styles.setupHint} role="status">
                <b><LockKeyhole size={18} aria-hidden="true" /> One-time setup needed</b>
                <p>Admin login isn’t configured yet. Add the three admin values from <code>.env.example</code> to <code>.env.local</code>, then restart the site.</p>
                <p>The initial admin ID and password are intentionally not preset.</p>
              </div>
            )}
          </div>

          <div className={styles.formFooter}>
            <a href="/"><ArrowLeft size={16} aria-hidden="true" /> Back to website</a>
            <span><ShieldCheck size={15} aria-hidden="true" /> Private access</span>
          </div>
        </section>

        <aside className={styles.showcase} aria-label="Tejas Enterprises showroom">
          <div className={styles.photo}>
            <Image
              src="/images/tejas/office-banner.png"
              alt="Tejas Enterprises office banner in Prayagraj"
              fill
              sizes="(max-width: 1050px) 0px, (max-width: 1440px) 50vw, 700px"
              priority
            />
          </div>
          <div className={styles.showcaseCopy}>
            <span className={styles.location}>TEJAS ENTERPRISES · PRAYAGRAJ</span>
            <h2>Your store, always up to date.</h2>
            <p>Keep photos, products and customer information current from one private workspace.</p>
          </div>
        </aside>
      </div>
    </main>
  )
}
