import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AuthLayout from './AuthLayout.jsx'
import { resetPassword } from '../../lib/passwordReset.js'

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('A palavra-passe deve ter pelo menos 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.')
      return
    }

    setIsSubmitting(true)
    try {
      await resetPassword(token, password)
      setIsDone(true)
      setTimeout(() => navigate('/login', { replace: true }), 2500)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Não foi possível repor a palavra-passe. O link pode ter expirado.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      headline="Define uma nova palavra-passe."
      tagline="Escolhe uma palavra-passe forte para manteres a tua conta protegida."
    >
      {isDone ? (
        <div>
          <h2
            className="text-[1.75rem] leading-tight font-medium text-[var(--text-h)]"
            style={{ fontFamily: 'var(--heading)' }}
          >
            Palavra-passe alterada
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--text)]">
            Vais ser redirecionado para o login…
          </p>
        </div>
      ) : (
        <>
          <div className="mb-10">
            <h2
              className="text-[1.75rem] leading-tight font-medium text-[var(--text-h)]"
              style={{ fontFamily: 'var(--heading)' }}
            >
              Nova palavra-passe
            </h2>
            <p className="mt-2 text-[15px] text-[var(--text)]">
              Escolhe a tua nova palavra-passe.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-[#c0392b]/20 bg-[#c0392b]/5 px-3.5 py-2.5 text-sm text-[#a33325]"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[var(--text-h)]">
                Nova palavra-passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors placeholder:text-[var(--text)]/50 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-[var(--text-h)]">
                Confirmar nova palavra-passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors placeholder:text-[var(--text)]/50 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 rounded-lg bg-[var(--accent)] px-3.5 py-2.5 text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-[#265d4f] disabled:opacity-60"
            >
              {isSubmitting ? 'A alterar…' : 'Alterar palavra-passe'}
            </button>

            <Link
              to="/login"
              className="text-center text-sm font-medium text-[var(--accent)] hover:underline"
            >
              ← Voltar ao login
            </Link>
          </form>
        </>
      )}
    </AuthLayout>
  )
}

export default ResetPassword
