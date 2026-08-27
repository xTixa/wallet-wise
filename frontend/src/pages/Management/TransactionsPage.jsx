import { useEffect, useState } from 'react'
import PageShell from '../../components/PageShell.jsx'
import { listTransactions, createTransaction, deleteTransaction } from '../../lib/transactions.js'
import { listCategories } from '../../lib/categories.js'
import { listAccounts } from '../../lib/accounts.js'

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

function TransactionForm({ type, categories, accounts, onCreated }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
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
      const transaction = await createTransaction({
        title: title.trim(),
        amount: Number(amount),
        type,
        category_id: categoryId,
        account_id: accountId,
        transaction_date: date,
        payment_method: paymentMethod,
      })
      onCreated(transaction)
      setTitle('')
      setAmount('')
    } catch (err) {
      setError(err.response?.data?.error ?? 'Não foi possível guardar o movimento.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (categories.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-6 text-sm text-[var(--text)]">
        Precisas de criar pelo menos uma categoria deste tipo antes de registares um movimento. Vai a{' '}
        <span className="font-medium text-[var(--accent)]">Categorias</span> para criar uma.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tx-title" className="text-sm font-medium text-[var(--text-h)]">
            Título
          </label>
          <input
            id="tx-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex: Supermercado"
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors placeholder:text-[var(--text)]/50 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="tx-amount" className="text-sm font-medium text-[var(--text-h)]">
            Valor (€)
          </label>
          <input
            id="tx-amount"
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
          <label htmlFor="tx-category" className="text-sm font-medium text-[var(--text-h)]">
            Categoria
          </label>
          <select
            id="tx-category"
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
          <label htmlFor="tx-date" className="text-sm font-medium text-[var(--text-h)]">
            Data
          </label>
          <input
            id="tx-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="tx-payment" className="text-sm font-medium text-[var(--text-h)]">
            Método de pagamento
          </label>
          <select
            id="tx-payment"
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
        {isSubmitting ? 'A guardar…' : 'Adicionar movimento'}
      </button>
    </form>
  )
}

function TransactionsTable({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
        <p className="text-sm font-medium text-[var(--text-h)]">Ainda não há movimentos</p>
        <p className="max-w-sm text-sm text-[var(--text)]">
          Usa o formulário acima para adicionar o primeiro.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
      <table className="w-full min-w-[560px] text-left text-[15px]">
        <thead>
          <tr className="border-b border-[var(--border)] text-xs font-medium tracking-wide text-[var(--text)] uppercase">
            <th className="px-4 py-3">Título</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Data</th>
            <th className="px-4 py-3 text-right">Valor</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-[var(--border)] last:border-0">
              <td className="px-4 py-3 text-[var(--text-h)]">{transaction.title}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: transaction.categories?.color ?? '#999' }}
                  />
                  {transaction.categories?.name}
                </span>
              </td>
              <td className="px-4 py-3">{formatDate(transaction.transaction_date)}</td>
              <td className="px-4 py-3 text-right font-medium text-[var(--text-h)]">
                {formatAmount(transaction.amount)}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onDelete(transaction.id)}
                  className="text-sm font-medium text-[#a33325] hover:underline"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TransactionsPage({ type, title, description }) {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [accounts, setAccounts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    Promise.all([listTransactions({ type }), listCategories(), listAccounts()])
      .then(([txData, categoryData, accountData]) => {
        if (cancelled) return
        setTransactions(txData)
        setCategories(categoryData.filter((category) => category.type === type))
        setAccounts(accountData)
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível carregar os dados.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [type])

  function handleCreated(transaction) {
    setTransactions((current) => [transaction, ...current])
  }

  async function handleDelete(id) {
    const previous = transactions
    setTransactions((current) => current.filter((transaction) => transaction.id !== id))
    try {
      await deleteTransaction(id)
    } catch {
      setTransactions(previous)
      setError('Não foi possível remover o movimento.')
    }
  }

  return (
    <PageShell title={title} description={description}>
      <div className="flex flex-col gap-8">
        {isLoading ? (
          <p className="text-sm text-[var(--text)]">A carregar…</p>
        ) : (
          <>
            <TransactionForm
              type={type}
              categories={categories}
              accounts={accounts}
              onCreated={handleCreated}
            />

            {error && (
              <p role="alert" className="text-sm text-[#a33325]">
                {error}
              </p>
            )}

            <TransactionsTable transactions={transactions} onDelete={handleDelete} />
          </>
        )}
      </div>
    </PageShell>
  )
}

export default TransactionsPage
