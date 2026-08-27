import { useEffect, useState } from 'react'
import PageShell from '../../components/PageShell.jsx'
import { getMe, updateMe, updatePassword } from '../../lib/user.js'
import { useAuth } from '../../context/useAuth.js'

function ProfileForm({ profile, onUpdated }) {
  const [name, setName] = useState(profile.name)
  const [error, setError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSavedMessage('')

    if (!name.trim()) {
      setError('O nome não pode ficar vazio.')
      return
    }

    setIsSubmitting(true)
    try {
      const updated = await updateMe({ name: name.trim() })
      onUpdated(updated)
      setSavedMessage('Dados atualizados.')
      setTimeout(() => setSavedMessage(''), 2000)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Não foi possível guardar as alterações.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <h2 className="text-[17px] font-medium text-[var(--text-h)]">Dados pessoais</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-name" className="text-sm font-medium text-[var(--text-h)]">
            Nome
          </label>
          <input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-email" className="text-sm font-medium text-[var(--text-h)]">
            Email
          </label>
          <input
            id="profile-email"
            value={profile.email}
            disabled
            className="rounded-lg border border-[var(--border)] bg-[var(--accent-bg)] px-3.5 py-2.5 text-[15px] text-[var(--text)] outline-none"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-[#a33325]">
          {error}
        </p>
      )}
      {savedMessage && <p className="text-sm font-medium text-[var(--accent)]">{savedMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start rounded-lg bg-[var(--accent)] px-4 py-2.5 text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-[#265d4f] disabled:opacity-60"
      >
        {isSubmitting ? 'A guardar…' : 'Guardar alterações'}
      </button>
    </form>
  )
}

function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSavedMessage('')

    if (newPassword.length < 8) {
      setError('A nova palavra-passe deve ter pelo menos 8 caracteres.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('As palavras-passe não coincidem.')
      return
    }

    setIsSubmitting(true)
    try {
      await updatePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSavedMessage('Palavra-passe alterada.')
      setTimeout(() => setSavedMessage(''), 2000)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Não foi possível alterar a palavra-passe.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <h2 className="text-[17px] font-medium text-[var(--text-h)]">Alterar palavra-passe</h2>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="current-password" className="text-sm font-medium text-[var(--text-h)]">
            Palavra-passe atual
          </label>
          <input
            id="current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="new-password" className="text-sm font-medium text-[var(--text-h)]">
            Nova palavra-passe
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm-new-password" className="text-sm font-medium text-[var(--text-h)]">
            Confirmar nova palavra-passe
          </label>
          <input
            id="confirm-new-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-[#a33325]">
          {error}
        </p>
      )}
      {savedMessage && <p className="text-sm font-medium text-[var(--accent)]">{savedMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start rounded-lg bg-[var(--accent)] px-4 py-2.5 text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-[#265d4f] disabled:opacity-60"
      >
        {isSubmitting ? 'A alterar…' : 'Alterar palavra-passe'}
      </button>
    </form>
  )
}

function Profile() {
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { updateUser } = useAuth()

  useEffect(() => {
    let cancelled = false

    getMe()
      .then((data) => {
        if (!cancelled) setProfile(data)
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível carregar o perfil.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  function handleProfileUpdated(updated) {
    setProfile(updated)
    updateUser({ name: updated.name })
  }

  return (
    <PageShell title="Perfil" description="Edita os teus dados pessoais e altera a palavra-passe.">
      <div className="flex flex-col gap-8">
        {error && (
          <p role="alert" className="text-sm text-[#a33325]">
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="text-sm text-[var(--text)]">A carregar…</p>
        ) : (
          <>
            <ProfileForm profile={profile} onUpdated={handleProfileUpdated} />
            <PasswordForm />
          </>
        )}
      </div>
    </PageShell>
  )
}

export default Profile
