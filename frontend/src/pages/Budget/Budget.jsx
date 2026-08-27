import { useEffect, useState } from 'react'
import PageShell from '../../components/PageShell.jsx'
import { listBudgets, createBudget, deleteBudget } from '../../lib/budgets.js'
import { listCategories } from '../../lib/categories.js'

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function formatAmount(amount) {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(Number(amount))
}

function BudgetForm({ categories, hasExpenseCategories, month, year, onCreated }) {
  const [categoryId, setCategoryId] = useState('')
  const [limitAmount, setLimitAmount] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!categoryId || !limitAmount) {
      setError('Escolhe uma categoria e define um limite.')
      return
    }

    setIsSubmitting(true)
    try {
      const budget = await createBudget({
        category_id: categoryId,
        month,
        year,
        limit_amount: Number(limitAmount),
      })
      onCreated({ ...budget, spent: 0 })
      setCategoryId('')
      setLimitAmount('')
    } catch (err) {
      setError(err.response?.data?.error ?? 'Não foi possível criar o orçamento.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!hasExpenseCategories) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-6 text-sm text-[var(--text)]">
        Precisas de criar categorias de despesa antes de definires um orçamento. Vai a{' '}
        <span className="font-medium text-[var(--accent)]">Categorias</span> para criar uma.
      </p>
    )
  }

  if (categories.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-6 text-sm text-[var(--text)]">
        Já definiste um orçamento para todas as tuas categorias de despesa este mês.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:flex-row sm:items-end sm:gap-3"
    >
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor="budget-category" className="text-sm font-medium text-[var(--text-h)]">
          Categoria
        </label>
        <select
          id="budget-category"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
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
        <label htmlFor="budget-limit" className="text-sm font-medium text-[var(--text-h)]">
          Limite mensal (€)
        </label>
        <input
          id="budget-limit"
          type="number"
          step="0.01"
          min="0"
          value={limitAmount}
          onChange={(event) => setLimitAmount(event.target.value)}
          placeholder="300.00"
          className="rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors placeholder:text-[var(--text)]/50 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-[#265d4f] disabled:opacity-60"
      >
        {isSubmitting ? 'A criar…' : 'Definir orçamento'}
      </button>

      {error && (
        <p role="alert" className="w-full text-sm text-[#a33325] sm:basis-full">
          {error}
        </p>
      )}
    </form>
  )
}

function BudgetCard({ budget, onDelete }) {
  const spent = Number(budget.spent)
  const limit = Number(budget.limit_amount)
  const progress = Math.min(100, (spent / limit) * 100)
  const isOverBudget = spent > limit

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: budget.categories?.color ?? '#999' }}
          />
          <h3 className="text-[15px] font-medium text-[var(--text-h)]">{budget.categories?.name}</h3>
        </div>
        <button
          type="button"
          onClick={() => onDelete(budget.id)}
          className="text-sm font-medium text-[#a33325] hover:underline"
        >
          Remover
        </button>
      </div>

      <div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--accent-bg)]">
          <div
            className={`h-full rounded-full transition-all ${isOverBudget ? 'bg-[#a33325]' : 'bg-[var(--accent)]'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className={`font-medium ${isOverBudget ? 'text-[#a33325]' : 'text-[var(--text-h)]'}`}>
            {formatAmount(spent)} / {formatAmount(limit)}
          </span>
          <span className="text-[var(--text)]">{progress.toFixed(0)}%</span>
        </div>
      </div>

      {isOverBudget && (
        <p className="text-sm font-medium text-[#a33325]">Orçamento ultrapassado</p>
      )}
    </div>
  )
}

function Budget() {
  const now = new Date()
  const [month] = useState(now.getMonth() + 1)
  const [year] = useState(now.getFullYear())
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [hasExpenseCategories, setHasExpenseCategories] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    Promise.all([listBudgets({ month, year }), listCategories()])
      .then(([budgetsData, categoriesData]) => {
        if (cancelled) return
        setBudgets(budgetsData)
        const expenseCategories = categoriesData.filter((category) => category.type === 'EXPENSE')
        setHasExpenseCategories(expenseCategories.length > 0)
        const usedCategoryIds = new Set(budgetsData.map((budget) => budget.category_id))
        setCategories(expenseCategories.filter((category) => !usedCategoryIds.has(category.id)))
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível carregar os orçamentos.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [month, year])

  function handleCreated(budget) {
    setBudgets((current) => [...current, budget])
    setCategories((current) => current.filter((category) => category.id !== budget.category_id))
  }

  async function handleDelete(id) {
    const previous = budgets
    const removed = budgets.find((budget) => budget.id === id)
    setBudgets((current) => current.filter((budget) => budget.id !== id))
    try {
      await deleteBudget(id)
      if (removed) {
        setCategories((current) => [...current, removed.categories])
      }
    } catch {
      setBudgets(previous)
      setError('Não foi possível remover o orçamento.')
    }
  }

  return (
    <PageShell
      title="Orçamento"
      description={`Define o orçamento de ${MONTH_NAMES[month - 1]} de ${year} por categoria, com alertas de consumo.`}
    >
      <div className="flex flex-col gap-8">
        {isLoading ? (
          <p className="text-sm text-[var(--text)]">A carregar…</p>
        ) : (
          <>
            <BudgetForm
              categories={categories}
              hasExpenseCategories={hasExpenseCategories}
              month={month}
              year={year}
              onCreated={handleCreated}
            />

            {error && (
              <p role="alert" className="text-sm text-[#a33325]">
                {error}
              </p>
            )}

            {budgets.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
                <p className="text-sm font-medium text-[var(--text-h)]">Ainda não definiste orçamentos</p>
                <p className="max-w-sm text-sm text-[var(--text)]">
                  Usa o formulário acima para definir o primeiro.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {budgets.map((budget) => (
                  <BudgetCard key={budget.id} budget={budget} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  )
}

export default Budget
