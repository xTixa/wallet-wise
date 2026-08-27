const STORAGE_KEY = 'ww_theme'

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme ?? 'system')
  try {
    localStorage.setItem(STORAGE_KEY, theme ?? 'system')
  } catch {
    // localStorage indisponível (ex: modo privado) - a preferência só não fica em cache local
  }
}

export function applyCachedTheme() {
  let cached = 'system'
  try {
    cached = localStorage.getItem(STORAGE_KEY) ?? 'system'
  } catch {
    // sem cache disponível, usa o valor por omissão
  }
  document.documentElement.setAttribute('data-theme', cached)
}
