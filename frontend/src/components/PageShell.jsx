function PageShell({ title, description, children }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1
          className="text-[1.75rem] leading-tight font-medium text-[var(--text-h)]"
          style={{ fontFamily: 'var(--heading)' }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-[15px] text-[var(--text)]">{description}</p>
        )}
      </div>

      {children ?? (
        <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
          <p className="text-sm font-medium text-[var(--text-h)]">Ainda por construir</p>
          <p className="max-w-sm text-sm text-[var(--text)]">
            Esta secção vai ganhar vida numa próxima iteração.
          </p>
        </div>
      )}
    </div>
  )
}

export default PageShell
