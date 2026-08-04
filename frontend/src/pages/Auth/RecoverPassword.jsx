import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from './AuthLayout.jsx'

function RecoverPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // TODO: integrate with POST /auth/recover-password once the API is available
      console.log('recover password', { email })
      setIsSubmitted(true)
    } catch {
      setError('Não foi possível enviar o email de recuperação. Tenta novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      headline="Recuperar o acesso é rápido e seguro."
      tagline="Enviamos-te um link de confirmação para o teu email — a tua conta e os teus dados ficam sempre protegidos."
    >
      {isSubmitted ? (
        <div>
          <h2
            className="text-[1.75rem] leading-tight font-medium text-[var(--text-h)]"
            style={{ fontFamily: 'var(--heading)' }}
          >
            Verifica o teu email
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--text)]">
            Se existir uma conta associada a{' '}
            <strong className="font-medium text-[var(--text-h)]">{email}</strong>, vais
            receber um email com instruções para repor a tua palavra-passe.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
          >
            ← Voltar ao login
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-10">
            <h2
              className="text-[1.75rem] leading-tight font-medium text-[var(--text-h)]"
              style={{ fontFamily: 'var(--heading)' }}
            >
              Recuperar palavra-passe
            </h2>
            <p className="mt-2 text-[15px] text-[var(--text)]">
              Indica o teu email e enviamos-te um link para repor a palavra-passe.
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
              <label htmlFor="email" className="text-sm font-medium text-[var(--text-h)]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@exemplo.com"
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors placeholder:text-[var(--text)]/50 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 rounded-lg bg-[var(--accent)] px-3.5 py-2.5 text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-[#265d4f] disabled:opacity-60"
            >
              {isSubmitting ? 'A enviar…' : 'Enviar link de recuperação'}
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

export default RecoverPassword
