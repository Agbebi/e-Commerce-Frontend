// Theme no-op: theme switching removed. Keep API for compatibility.

export function getStoredTheme() {
  return null
}

export function applyTheme(_theme) {
  // intentionally no-op
}

export function setTheme(_theme) {
  // intentionally no-op
}

export function toggleTheme() {
  return 'light'
}

export function initTheme() {
  return 'light'
}

export function getCurrentTheme() {
  return 'light'
}

export default {
  initTheme,
  setTheme,
  toggleTheme,
  getCurrentTheme
}
