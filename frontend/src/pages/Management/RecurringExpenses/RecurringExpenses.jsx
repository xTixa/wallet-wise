import { useEffect, useState } from 'react'
import PageShell from '../../../components/PageShell.jsx'
import {
  listRecurringExpenses,
  createRecurringExpense,
  confirmRecurringExpensePayment,
  deleteRecurringExpense,
} from '../../../lib/recurringExpenses.js'
import { listCategories } from '../../../lib/categories.js'
import { listAccounts } from '../../../lib/accounts.js'

const FREQUENCIES = [
  { value: 'WEEKLY', label: 'Semanal' },
  { value: 'MONTHLY', label: 'Mensal' },
  { value: 'YEARLY', label: 'Anual' },
]

const PAYMENT_METHODS = [
  { value: 'CARD', label: 'Cartão' },
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'TRANSFER', label: 'Transferência' },
  { value: 'OTHER', label: 'Outro' },
]

function formatAmount(amount) {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(Number(amount))
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(dateString),
  )
}

function RecurringForm({ categories, accounts, onCreated }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [frequency, setFrequency] = useState('MONTHLY')
  const [nextDueDate, setNextDueDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [paymentMethod, setPaymentMethod] = useState('CARD')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const accountId = accounts[0]?.id

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!title.trim() || !amount || !categoryId || !accountId) {
      setError('Preenche título, valor e categoria.')
      return
    }

    setIsSubmitting(true)
    try {
      const recurring = await createRecurringExpense({
        title: title.trim(),
        amount: Number(amount),
        category_id: categoryId,
        account_id: accountId,
        frequency,
        next_due_date: nextDueDate,
        payment_method: paymentMethod,
      })
      onCreated(recurring)
      setTitle('')
      setAmount('')
    } catch (err) {
      setError(err.response?.data?.error ?? 'Não foi possível criar a despesa recorrente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (categories.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-6 text-sm text-[var(--text)]">
        Precisas de criar pelo menos uma categoria de despesa antes de criares uma recorrência. Vai a{' '}
        <span className="font-medium text-[var(--accent)]">Categorias</span> para criar uma.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rec-title" className="text-sm font-medium text-[var(--text-h)]">
            Título
          </label>
          <input
            id="rec-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex: Renda"
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors placeholder:text-[var(--text)]/50 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="rec-amount" className="text-sm font-medium text-[var(--text-h)]">
            Valor (€)
          </label>
          <input
            id="rec-amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors placeholder:text-[var(--text)]/50 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="rec-category" className="text-sm font-medium text-[var(--text-h)]">
            Categoria
          </label>
          <select
            id="rec-category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
          >
            <option value="">Escolhe…</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="rec-frequency" className="text-sm font-medium text-[var(--text-h)]">
            Frequência
          </label>
          <select
            id="rec-frequency"
            value={frequency}
            onChange={(event) => setFrequency(event.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
          >
            {FREQUENCIES.map((freq) => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="rec-date" className="text-sm font-medium text-[var(--text-h)]">
            Próxima cobrança
          </label>
          <input
            id="rec-date"
            type="date"
            value={nextDueDate}
            onChange={(event) => setNextDueDate(event.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="rec-payment" className="text-sm font-medium text-[var(--text-h)]">
            Método de pagamento
          </label>
          <select
            id="rec-payment"
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-[#a33325]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start rounded-lg bg-[var(--accent)] px-4 py-2.5 text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-[#265d4f] disabled:opacity-60"
      >
        {isSubmitting ? 'A guardar…' : 'Criar recorrência'}
      </button>
    </form>
  )
}

function RecurringList({ items, onConfirm, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
        <p className="text-sm font-medium text-[var(--text-h)]">Ainda não tens despesas recorrentes</p>
        <p className="max-w-sm text-sm text-[var(--text)]">
          Usa o formulário acima para adicionar a primeira.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
        >
          <div className="flex items-center gap-3">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.categories?.color ?? '#999' }}
            />
            <div>
              <p className="text-[15px] font-medium text-[var(--text-h)]">{item.title}</p>
              <p className="text-sm text-[var(--text)]">
                {formatAmount(item.amount)} · {FREQUENCIES.find((f) => f.value === item.frequency)?.label} ·
                próxima cobrança {formatDate(item.next_due_date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onConfirm(item.id)}
              className="rounded-lg bg-[var(--accent)] px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#265d4f]"
            >
              Confirmar pagamento
            </button>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="text-sm font-medium text-[#a33325] hover:underline"
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function RecurringExpenses() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [accounts, setAccounts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    Promise.all([listRecurringExpenses(), listCategories(), listAccounts()])
      .then(([recurringData, categoryData, accountData]) => {
        if (cancelled) return
        setItems(recurringData)
        setCategories(categoryData.filter((category) => category.type === 'EXPENSE'))
        setAccounts(accountData)
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível carregar as despesas recorrentes.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  function handleCreated(recurring) {
    setItems((current) =>
      [...current, recurring].sort((a, b) => new Date(a.next_due_date) - new Date(b.next_due_date)),
    )
  }

  async function handleConfirm(id) {
    try {
      const { recurring } = await confirmRecurringExpensePayment(id)
      setItems((current) =>
        current
          .map((item) => (item.id === id ? recurring : item))
          .sort((a, b) => new Date(a.next_due_date) - new Date(b.next_due_date)),
      )
    } catch {
      setError('Não foi possível confirmar o pagamento.')
    }
  }

  async function handleDelete(id) {
    const previous = items
    setItems((current) => current.filter((item) => item.id !== id))
    try {
      await deleteRecurringExpense(id)
    } catch {
      setItems(previous)
      setError('Não foi possível remover a despesa recorrente.')
    }
  }

  return (
    <PageShell
      title="Despesas recorrentes"
      description="Renda, subscrições e outras despesas que se repetem automaticamente."
    >
      <div className="flex flex-col gap-8">
        {isLoading ? (
          <p className="text-sm text-[var(--text)]">A carregar…</p>
        ) : (
          <>
            <RecurringForm categories={categories} accounts={accounts} onCreated={handleCreated} />

            {error && (
              <p role="alert" className="text-sm text-[#a33325]">
                {error}
              </p>
            )}

            <RecurringList items={items} onConfirm={handleConfirm} onDelete={handleDelete} />
          </>
        )}
      </div>
    </PageShell>
  )
}

export default RecurringExpenses
