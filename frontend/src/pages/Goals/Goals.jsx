import { useEffect, useState } from 'react'
import PageShell from '../../components/PageShell.jsx'
import { listGoals, createGoal, contributeToGoal, deleteGoal } from '../../lib/goals.js'

function formatAmount(amount) {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(Number(amount))
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(dateString),
  )
}

function GoalForm({ onCreated }) {
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!title.trim() || !targetAmount) {
      setError('Dá um título e uma meta ao objetivo.')
      return
    }

    setIsSubmitting(true)
    try {
      const goal = await createGoal({
        title: title.trim(),
        target_amount: Number(targetAmount),
        deadline: deadline || undefined,
      })
      onCreated(goal)
      setTitle('')
      setTargetAmount('')
      setDeadline('')
    } catch (err) {
      setError(err.response?.data?.error ?? 'Não foi possível criar o objetivo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:flex-row sm:items-end sm:gap-3"
    >
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor="goal-title" className="text-sm font-medium text-[var(--text-h)]">
          Título
        </label>
        <input
          id="goal-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ex: Fundo de emergência"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors placeholder:text-[var(--text)]/50 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="goal-target" className="text-sm font-medium text-[var(--text-h)]">
          Meta (€)
        </label>
        <input
          id="goal-target"
          type="number"
          step="0.01"
          min="0"
          value={targetAmount}
          onChange={(event) => setTargetAmount(event.target.value)}
          placeholder="1000.00"
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors placeholder:text-[var(--text)]/50 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="goal-deadline" className="text-sm font-medium text-[var(--text-h)]">
          Prazo (opcional)
        </label>
        <input
          id="goal-deadline"
          type="date"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-[#265d4f] disabled:opacity-60"
      >
        {isSubmitting ? 'A criar…' : 'Criar objetivo'}
      </button>

      {error && (
        <p role="alert" className="w-full text-sm text-[#a33325] sm:basis-full">
          {error}
        </p>
      )}
    </form>
  )
}

function GoalCard({ goal, onContribute, onDelete }) {
  const [amount, setAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const progress = Math.min(100, (Number(goal.current_amount) / Number(goal.target_amount)) * 100)
  const isCompleted = goal.status === 'COMPLETED'

  async function handleContribute(event) {
    event.preventDefault()
    if (!amount || Number(amount) <= 0) return

    setIsSubmitting(true)
    try {
      await onContribute(goal.id, Number(amount))
      setAmount('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[17px] font-medium text-[var(--text-h)]">{goal.title}</h3>
          {goal.deadline && (
            <p className="mt-0.5 text-sm text-[var(--text)]">Até {formatDate(goal.deadline)}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDelete(goal.id)}
          className="text-sm font-medium text-[#a33325] hover:underline"
        >
          Remover
        </button>
      </div>

      <div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--accent-bg)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="font-medium text-[var(--text-h)]">
            {formatAmount(goal.current_amount)} / {formatAmount(goal.target_amount)}
          </span>
          <span className="text-[var(--text)]">{progress.toFixed(0)}%</span>
        </div>
      </div>

      {isCompleted ? (
        <p className="rounded-lg bg-[var(--accent-bg)] px-3.5 py-2.5 text-sm font-medium text-[var(--accent)]">
          Objetivo concluído 🎉
        </p>
      ) : (
        <form onSubmit={handleContribute} className="flex gap-2">
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Valor a adicionar"
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-[15px] text-[var(--text-h)] outline-none transition-colors placeholder:text-[var(--text)]/50 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#265d4f] disabled:opacity-60"
          >
            Adicionar
          </button>
        </form>
      )}
    </div>
  )
}

function Goals() {
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    listGoals()
      .then((data) => {
        if (!cancelled) setGoals(data)
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível carregar os objetivos.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  function handleCreated(goal) {
    setGoals((current) => [...current, goal])
  }

  async function handleContribute(id, amount) {
    try {
      const updated = await contributeToGoal(id, amount)
      setGoals((current) => current.map((goal) => (goal.id === id ? updated : goal)))
    } catch {
      setError('Não foi possível registar a contribuição.')
    }
  }

  async function handleDelete(id) {
    const previous = goals
    setGoals((current) => current.filter((goal) => goal.id !== id))
    try {
      await deleteGoal(id)
    } catch {
      setGoals(previous)
      setError('Não foi possível remover o objetivo.')
    }
  }

  return (
    <PageShell
      title="Objetivos financeiros"
      description="Cria objetivos de poupança e acompanha o progresso até à meta."
    >
      <div className="flex flex-col gap-8">
        <GoalForm onCreated={handleCreated} />

        {error && (
          <p role="alert" className="text-sm text-[#a33325]">
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="text-sm text-[var(--text)]">A carregar objetivos…</p>
        ) : goals.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
            <p className="text-sm font-medium text-[var(--text-h)]">Ainda não tens objetivos</p>
            <p className="max-w-sm text-sm text-[var(--text)]">
              Usa o formulário acima para criar o primeiro.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onContribute={handleContribute}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}

export default Goals
