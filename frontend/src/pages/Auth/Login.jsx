import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout.jsx'
import { useAuth } from '../../context/useAuth.js'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error ?? 'Não foi possível iniciar sessão. Verifica as tuas credenciais.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      headline="O teu dinheiro, finalmente com sentido."
      tagline="Receitas, despesas e objetivos num só lugar — com estatísticas claras para decidires com confiança."
    >
      <div className="mb-10">
        <h2
          className="text-[1.75rem] leading-tight font-medium text-[var(--text-h)]"
          style={{ fontFamily: 'var(--heading)' }}
        >
          Entrar na tua conta
        </h2>
        <p className="mt-2 text-[15px] text-[var(--text)]">
          Bem-vinda de volta. Introduz os teus dados para continuar.
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

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-[var(--text-h)]">
              Palavra-passe
            </label>
            <Link
              to="/recuperar-password"
              className="text-xs font-medium text-[var(--accent)] hover:underline"
            >
              Esqueceste-te?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors placeholder:text-[var(--text)]/50 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-lg bg-[var(--accent)] px-3.5 py-2.5 text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-[#265d4f] disabled:opacity-60"
        >
          {isSubmitting ? 'A entrar…' : 'Entrar'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--text)]">
        Ainda não tens conta?{' '}
        <Link to="/registar" className="font-medium text-[var(--accent)] hover:underline">
          Regista-te
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Login
