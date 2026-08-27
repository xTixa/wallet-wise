import { useEffect, useState } from 'react'
import PageShell from '../../components/PageShell.jsx'
import { listCategories, createCategory, deleteCategory } from '../../lib/categories.js'

function CategoryForm({ onCreated }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('EXPENSE')
  const [color, setColor] = useState('#2f6f5e')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Dá um nome à categoria.')
      return
    }

    setIsSubmitting(true)
    try {
      const category = await createCategory({ name: name.trim(), type, color })
      onCreated(category)
      setName('')
    } catch (err) {
      setError(err.response?.data?.error ?? 'Não foi possível criar a categoria.')
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
        <label htmlFor="cat-name" className="text-sm font-medium text-[var(--text-h)]">
          Nome
        </label>
        <input
          id="cat-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex: Alimentação"
          className="rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors placeholder:text-[var(--text)]/50 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cat-type" className="text-sm font-medium text-[var(--text-h)]">
          Tipo
        </label>
        <select
          id="cat-type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--text-h)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-bg)]"
        >
          <option value="EXPENSE">Despesa</option>
          <option value="INCOME">Receita</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cat-color" className="text-sm font-medium text-[var(--text-h)]">
          Cor
        </label>
        <input
          id="cat-color"
          type="color"
          value={color}
          onChange={(event) => setColor(event.target.value)}
          className="h-[42px] w-[52px] cursor-pointer rounded-lg border border-[var(--border)] bg-white p-1"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-[#265d4f] disabled:opacity-60"
      >
        {isSubmitting ? 'A adicionar…' : 'Adicionar categoria'}
      </button>

      {error && (
        <p role="alert" className="w-full text-sm text-[#a33325] sm:basis-full">
          {error}
        </p>
      )}
    </form>
  )
}

function CategoryGroup({ title, categories, onDelete }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium tracking-wide text-[var(--text)] uppercase">{title}</h2>
      {categories.length === 0 ? (
        <p className="text-sm text-[var(--text)]">Ainda não tens categorias deste tipo.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: category.color ?? '#999' }}
                />
                <span className="text-[15px] text-[var(--text-h)]">{category.name}</span>
              </div>
              <button
                type="button"
                onClick={() => onDelete(category.id)}
                className="text-sm font-medium text-[#a33325] hover:underline"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Categories() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    listCategories()
      .then((data) => {
        if (!cancelled) setCategories(data)
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível carregar as categorias.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  function handleCreated(category) {
    setCategories((current) => [...current, category])
  }

  async function handleDelete(id) {
    const previous = categories
    setCategories((current) => current.filter((category) => category.id !== id))
    try {
      await deleteCategory(id)
    } catch {
      setCategories(previous)
      setError('Não foi possível remover a categoria.')
    }
  }

  const expenseCategories = categories.filter((category) => category.type === 'EXPENSE')
  const incomeCategories = categories.filter((category) => category.type === 'INCOME')

  return (
    <PageShell
      title="Categorias"
      description="Gere as categorias predefinidas e cria categorias personalizadas."
    >
      <div className="flex flex-col gap-8">
        <CategoryForm onCreated={handleCreated} />

        {error && (
          <p role="alert" className="text-sm text-[#a33325]">
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="text-sm text-[var(--text)]">A carregar categorias…</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2">
            <CategoryGroup title="Despesas" categories={expenseCategories} onDelete={handleDelete} />
            <CategoryGroup title="Receitas" categories={incomeCategories} onDelete={handleDelete} />
          </div>
        )}
      </div>
    </PageShell>
  )
}

export default Categories
