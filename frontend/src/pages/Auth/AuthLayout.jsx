const highlights = [
  { value: '3', label: 'contas ligadas em segundos' },
  { value: '0€', label: 'taxas para começar' },
  { value: '24/7', label: 'controlo do teu saldo' },
]

function AuthLayout({ headline, tagline, children }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[var(--ink)] px-14 py-12 text-[#f6f4ee] lg:flex">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
                <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#f6f4ee" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <p
          className="relative text-2xl italic tracking-tight"
          style={{ fontFamily: 'var(--heading)', fontWeight: 500 }}
        >
          WalletWise
        </p>

        <div className="relative flex flex-col gap-10">
          <h1
            className="max-w-md text-[2.75rem] leading-[1.08] font-medium text-balance"
            style={{ fontFamily: 'var(--heading)' }}
          >
            {headline}
          </h1>
          <p className="max-w-sm text-[15px] leading-relaxed text-[#cbd5c4]">{tagline}</p>

          <svg viewBox="0 0 320 90" className="h-20 w-full max-w-sm" aria-hidden="true">
            <polyline
              points="0,64 40,58 80,68 120,40 160,48 200,22 240,30 280,10 320,16"
              fill="none"
              stroke="#b08968"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="320" cy="16" r="4.5" fill="#b08968" />
          </svg>

          <dl className="grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
            {highlights.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <dt
                  className="text-xl font-medium tabular-nums"
                  style={{ fontFamily: 'var(--heading)' }}
                >
                  {item.value}
                </dt>
                <dd className="text-xs leading-snug text-[#a8b3ab]">{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="relative text-xs text-[#8b9690]">
          © {new Date().getFullYear()} WalletWise. Gestão financeira pessoal.
        </p>
      </aside>

      <main className="flex items-center justify-center bg-[var(--bg)] px-6 py-16">
        <div className="w-full max-w-[380px]">
          <p
            className="mb-8 text-xl italic text-[var(--accent)] lg:hidden"
            style={{ fontFamily: 'var(--heading)', fontWeight: 500 }}
          >
            WalletWise
          </p>
          {children}
        </div>
      </main>
    </div>
  )
}

export default AuthLayout
