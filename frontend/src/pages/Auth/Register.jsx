import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from './AuthLayout.jsx'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
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
      // TODO: integrate with POST /auth/register once the API is available
      console.log('register', { name, email, password })
    } catch {
      setError('Não foi possível criar a conta. Tenta novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      headline="Começa a organizar as tuas finanças hoje."
      tagline="Cria a tua conta gratuita e tem acesso a dashboards, orçamentos e objetivos de poupança em minutos."
    >
      <div className="mb-10">
        <h2
          className="text-[1.75rem] leading-tight font-medium text-[var(--text-h)]"
          style={{ fontFamily: 'var(--heading)' }}
        >
          Criar conta
        </h2>
        <p className="mt-2 text-[15px] text-[var(--text)]">
          Leva menos de um minuto. Sem cartão de crédito.
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
          <label htmlFor="name" className="text-sm font-medium text-[var(--text-h)]">
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="O teu nome"
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors placeholder:text-[var(--text)]/50 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
          />
        </div>

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
          <label htmlFor="password" className="text-sm font-medium text-[var(--text-h)]">
            Palavra-passe
          </label>
          <input
            id="password"
            name="password"
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
            Confirmar palavra-passe
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
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
          {isSubmitting ? 'A criar conta…' : 'Criar conta'}
        </button>

        <p className="text-center text-xs leading-relaxed text-[var(--text)]">
          Ao criar conta, aceitas os nossos{' '}
          <a href="#" className="font-medium text-[var(--accent)] hover:underline">
            Termos de Serviço
          </a>{' '}
          e a{' '}
          <a href="#" className="font-medium text-[var(--accent)] hover:underline">
            Política de Privacidade
          </a>
          .
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--text)]">
        Já tens conta?{' '}
        <Link to="/login" className="font-medium text-[var(--accent)] hover:underline">
          Entra
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Register
