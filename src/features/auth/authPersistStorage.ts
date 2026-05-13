import type { StateStorage } from 'zustand/middleware'

/**
 * ТЗ B.2: при «Запомнить меня» — localStorage, иначе sessionStorage (сессия до закрытия вкладки).
 * Флаг выставляется перед записью состояния при логине/регистрации.
 */
let useSessionScope = false

export function setAuthPersistScope(sessionOnly: boolean) {
  useSessionScope = sessionOnly
}

export const authPersistStorage: StateStorage = {
  getItem: (name) => sessionStorage.getItem(name) ?? localStorage.getItem(name),
  setItem: (name, value) => {
    if (useSessionScope) {
      sessionStorage.setItem(name, value)
      localStorage.removeItem(name)
    } else {
      localStorage.setItem(name, value)
      sessionStorage.removeItem(name)
    }
  },
  removeItem: (name) => {
    sessionStorage.removeItem(name)
    localStorage.removeItem(name)
  },
}
