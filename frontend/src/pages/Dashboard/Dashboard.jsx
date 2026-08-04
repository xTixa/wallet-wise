import PageShell from '../../components/PageShell.jsx'

const indicators = [
  { label: 'Saldo atual', value: '—' },
  { label: 'Receitas do mês', value: '—' },
  { label: 'Despesas do mês', value: '—' },
  { label: 'Poupança mensal', value: '—' },
]

function Dashboard() {
  return (
    <PageShell
      title="Dashboard"
      description="Resumo da tua situação financeira este mês."
    >
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
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex min-h-56 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center">
          <p className="text-sm font-medium text-[var(--text-h)]">Próximos pagamentos</p>
          <p className="max-w-xs text-sm text-[var(--text)]">
            Vais ver aqui as despesas recorrentes e previstas mais próximas.
          </p>
        </div>
        <div className="flex min-h-56 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center">
          <p className="text-sm font-medium text-[var(--text-h)]">Objetivos financeiros</p>
          <p className="max-w-xs text-sm text-[var(--text)]">
            O progresso dos teus objetivos de poupança vai aparecer aqui.
          </p>
        </div>
      </div>
    </PageShell>
  )
}

export default Dashboard
