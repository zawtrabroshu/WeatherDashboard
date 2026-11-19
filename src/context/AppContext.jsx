import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

function loadFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState(() =>
    loadFromStorage('weatherFavorites')
  )

  const [history, setHistory] = useState(() =>
    loadFromStorage('weatherHistory')
  )

  function toggleFavorite(city) {
    setFavorites((previous) => {
      const exists = previous.some(
        (item) => item.toLowerCase() === city.toLowerCase()
      )

      const updated = exists
        ? previous.filter(
            (item) => item.toLowerCase() !== city.toLowerCase()
          )
        : [...previous, city]

      localStorage.setItem('weatherFavorites', JSON.stringify(updated))

      return updated
    })
  }

  function addHistory(city) {
    setHistory((previous) => {
      const updated = [
        city,
        ...previous.filter(
          (item) => item.toLowerCase() !== city.toLowerCase()
        ),
      ].slice(0, 10)

      localStorage.setItem('weatherHistory', JSON.stringify(updated))

      return updated
    })
  }

  function clearHistory() {
    setHistory([])
    localStorage.removeItem('weatherHistory')
  }

  return (
    <AppContext.Provider
      value={{
        favorites,
        history,
        toggleFavorite,
        addHistory,
        clearHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}