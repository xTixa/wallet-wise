import { useEffect, useState } from 'react'
import PageShell from '../../components/PageShell.jsx'
import { getMe, updateMe } from '../../lib/user.js'

const THEMES = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
]

const LANGUAGES = [
  { value: 'pt-PT', label: 'Português' },
  { value: 'en-US', label: 'English' },
]

const CURRENCIES = [
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'USD', label: 'Dólar americano ($)' },
  { value: 'GBP', label: 'Libra esterlina (£)' },
  { value: 'BRL', label: 'Real brasileiro (R$)' },
]

const NOTIFICATION_TOGGLES = [
  {
    key: 'notify_budget_alerts',
    label: 'Alertas de orçamento',
    description: 'Avisa-me quando uma categoria se aproximar ou ultrapassar o limite definido.',
  },
  {
    key: 'notify_recurring_reminders',
    label: 'Lembretes de despesas recorrentes',
    description: 'Avisa-me quando uma despesa recorrente estiver perto da data de cobrança.',
  },
  {
    key: 'notify_goal_progress',
    label: 'Progresso de objetivos',
    description: 'Avisa-me sobre marcos importantes nos meus objetivos de poupança.',
  },
]

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

function Settings() {
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    getMe()
      .then((data) => {
        if (!cancelled) setSettings(data)
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível carregar as definições.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function persist(patch) {
    const previous = settings
    const next = { ...settings, ...patch }
    setSettings(next)
    setError('')
    setSavedMessage('')
    try {
      const updated = await updateMe(patch)
      setSettings(updated)
      setSavedMessage('Definições guardadas.')
      setTimeout(() => setSavedMessage(''), 2000)
    } catch {
      setSettings(previous)
      setError('Não foi possível guardar a alteração.')
    }
  }

  if (isLoading) {
    return (
      <PageShell title="Definições" description="Personaliza a plataforma às tuas preferências.">
        <p className="text-sm text-[var(--text)]">A carregar…</p>
      </PageShell>
    )
  }

  return (
    <PageShell title="Definições" description="Personaliza a plataforma às tuas preferências.">
      <div className="flex flex-col gap-8">
        {error && (
          <p role="alert" className="text-sm text-[#a33325]">
            {error}
          </p>
        )}
        {savedMessage && <p className="text-sm font-medium text-[var(--accent)]">{savedMessage}</p>}

        <section className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-[17px] font-medium text-[var(--text-h)]">Aparência</h2>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="settings-theme" className="text-sm font-medium text-[var(--text-h)]">
              Tema
            </label>
            <select
              id="settings-theme"
              value={settings.theme}
              onChange={(event) => persist({ theme: event.target.value })}
              className="w-full max-w-xs rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
            >
              {THEMES.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-[17px] font-medium text-[var(--text-h)]">Idioma e moeda</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="settings-language" className="text-sm font-medium text-[var(--text-h)]">
                Idioma
              </label>
              <select
                id="settings-language"
                value={settings.language}
                onChange={(event) => persist({ language: event.target.value })}
                className="rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="settings-currency" className="text-sm font-medium text-[var(--text-h)]">
                Moeda
              </label>
              <select
                id="settings-currency"
                value={settings.currency}
                onChange={(event) => persist({ currency: event.target.value })}
                className="rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-[17px] font-medium text-[var(--text-h)]">Notificações</h2>

          {NOTIFICATION_TOGGLES.map((toggle) => (
            <div key={toggle.key} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[15px] font-medium text-[var(--text-h)]">{toggle.label}</p>
                <p className="mt-0.5 text-sm text-[var(--text)]">{toggle.description}</p>
              </div>
              <Toggle
                checked={settings[toggle.key]}
                onChange={(value) => persist({ [toggle.key]: value })}
              />
            </div>
          ))}
        </section>
      </div>
    </PageShell>
  )
}

export default Settings
