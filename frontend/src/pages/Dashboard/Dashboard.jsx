import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../../components/PageShell.jsx'
import { listTransactions } from '../../lib/transactions.js'
import { listAccounts } from '../../lib/accounts.js'
import { listGoals } from '../../lib/goals.js'
import { listRecurringExpenses } from '../../lib/recurringExpenses.js'

function formatAmount(amount) {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(amount)
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short' }).format(new Date(dateString))
}

function startOfMonth() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
}

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [goals, setGoals] = useState([])
  const [upcomingPayments, setUpcomingPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    Promise.all([
      listAccounts(),
      listTransactions(),
      listTransactions({ from: startOfMonth() }),
      listGoals(),
      listRecurringExpenses(),
    ])
      .then(([accounts, allTransactions, monthTransactions, goalsData, recurringData]) => {
        if (cancelled) return

        const accountsBalance = accounts.reduce((sum, account) => sum + Number(account.initial_balance), 0)
        const signedTotal = (list) =>
          list.reduce((sum, t) => sum + (t.type === 'INCOME' ? Number(t.amount) : -Number(t.amount)), 0)

        const monthIncome = monthTransactions
          .filter((t) => t.type === 'INCOME')
          .reduce((sum, t) => sum + Number(t.amount), 0)
        const monthExpense = monthTransactions
          .filter((t) => t.type === 'EXPENSE')
          .reduce((sum, t) => sum + Number(t.amount), 0)

        setSummary({
          balance: accountsBalance + signedTotal(allTransactions),
          monthIncome,
          monthExpense,
          monthSavings: monthIncome - monthExpense,
        })
        setGoals(goalsData.filter((goal) => goal.status !== 'COMPLETED').slice(0, 3))
        setUpcomingPayments(
          recurringData
            .filter((item) => item.is_active)
            .sort((a, b) => new Date(a.next_due_date) - new Date(b.next_due_date))
            .slice(0, 4),
        )
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível carregar o resumo financeiro.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const indicators = [
    { label: 'Saldo atual', value: summary ? formatAmount(summary.balance) : '—' },
    { label: 'Receitas do mês', value: summary ? formatAmount(summary.monthIncome) : '—' },
    { label: 'Despesas do mês', value: summary ? formatAmount(summary.monthExpense) : '—' },
    { label: 'Poupança mensal', value: summary ? formatAmount(summary.monthSavings) : '—' },
  ]

  return (
    <PageShell
      title="Dashboard"
      description="Resumo da tua situação financeira este mês."
    >
      {error && (
        <p role="alert" className="mb-4 text-sm text-[#a33325]">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {indicators.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4"
          >
            <p className="text-xs font-medium tracking-wide text-[var(--text)] uppercase">
              {item.label}
            </p>
            <p
              className="mt-2 text-2xl font-medium tabular-nums text-[var(--text-h)]"
              style={{ fontFamily: 'var(--heading)' }}
            >
              {isLoading ? '—' : item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-sm font-medium text-[var(--text-h)]">Próximos pagamentos</p>
          {isLoading ? (
            <p className="text-sm text-[var(--text)]">A carregar…</p>
          ) : upcomingPayments.length === 0 ? (
            <p className="text-sm text-[var(--text)]">
              Ainda não tens despesas recorrentes.{' '}
              <Link to="/despesas-recorrentes" className="font-medium text-[var(--accent)] hover:underline">
                Cria uma
              </Link>
              .
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {upcomingPayments.map((item) => (
                <li key={item.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--text-h)]">{item.title}</span>
                  <span className="text-[var(--text)]">
                    {formatAmount(item.amount)} · {formatDate(item.next_due_date)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-sm font-medium text-[var(--text-h)]">Objetivos financeiros</p>
          {isLoading ? (
            <p className="text-sm text-[var(--text)]">A carregar…</p>
          ) : goals.length === 0 ? (
            <p className="text-sm text-[var(--text)]">
              Ainda não tens objetivos ativos.{' '}
              <Link to="/objetivos" className="font-medium text-[var(--accent)] hover:underline">
                Cria um
              </Link>
              .
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {goals.map((goal) => {
                const progress = Math.min(
                  100,
                  (Number(goal.current_amount) / Number(goal.target_amount)) * 100,
                )
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[var(--text-h)]">{goal.title}</span>
                      <span className="text-[var(--text)]">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--accent-bg)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}

export default Dashboard
