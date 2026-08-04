import { NavLink, Outlet } from 'react-router-dom'

const navGroups = [
  {
    label: 'Visão geral',
    items: [{ to: '/dashboard', label: 'Dashboard' }],
  },
  {
    label: 'Movimentos',
    items: [
      { to: '/receitas', label: 'Receitas' },
      { to: '/despesas', label: 'Despesas' },
      { to: '/despesas-recorrentes', label: 'Despesas recorrentes' },
      { to: '/pesquisa', label: 'Pesquisa' },
    ],
  },
  {
    label: 'Planeamento',
    items: [
      { to: '/categorias', label: 'Categorias' },
      { to: '/orcamento', label: 'Orçamento' },
      { to: '/objetivos', label: 'Objetivos financeiros' },
    ],
  },
  {
    label: 'Análise',
    items: [{ to: '/estatisticas', label: 'Estatísticas' }],
  },
]

function AppLayout() {
  return (
    <div className="flex min-h-svh bg-[var(--bg)]">
      <aside className="hidden w-64 shrink-0 flex-col justify-between bg-[var(--ink)] px-5 py-8 text-[#f6f4ee] lg:flex">
        <div className="flex flex-col gap-10">
          <p
            className="px-2 text-xl italic tracking-tight"
            style={{ fontFamily: 'var(--heading)', fontWeight: 500 }}
          >
            WalletWise
          </p>

          <nav className="flex flex-col gap-6">
            {navGroups.map((group) => (
              <div key={group.label} className="flex flex-col gap-1.5">
                <p className="px-2 text-[11px] font-medium tracking-wide text-[#8b9690] uppercase">
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-[#cbd5c4] hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            `rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-white/10 text-white'
                : 'text-[#cbd5c4] hover:bg-white/5 hover:text-white'
            }`
          }
        >
          Perfil
        </NavLink>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4 lg:px-10">
          <p
            className="text-lg italic text-[var(--accent)] lg:hidden"
            style={{ fontFamily: 'var(--heading)', fontWeight: 500 }}
          >
            WalletWise
          </p>
          <div className="hidden lg:block" />
          <NavLink
            to="/perfil"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-bg)] text-sm font-medium text-[var(--accent)]"
          >
            P
          </NavLink>
        </header>

        <main className="flex-1 px-6 py-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
