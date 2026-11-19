import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AppProvider, useAppContext } from '../context/AppContext'

function TestComponent() {
  const {
    favorites,
    history,
    toggleFavorite,
    addHistory,
    clearHistory,
  } = useAppContext()

  return (
    <div>
      <div data-testid="favorites">{JSON.stringify(favorites)}</div>
      <div data-testid="history">{JSON.stringify(history)}</div>

      <button onClick={() => toggleFavorite('Berlin')}>
        Add favorite
      </button>

      <button onClick={() => toggleFavorite('Berlin')}>
        Remove favorite
      </button>

      <button onClick={() => toggleFavorite('berlin')}>
        Add lowercase favorite
      </button>

      <button onClick={() => addHistory('Berlin')}>
        Add history
      </button>

      <button onClick={() => addHistory('Tokyo')}>
        Add Tokyo
      </button>

      <button onClick={() => clearHistory()}>
        Clear history
      </button>
    </div>
  )
}

function renderContext() {
  return render(
    <AppProvider>
      <TestComponent />
    </AppProvider>
  )
}

describe('AppContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds a city to favorites', () => {
    renderContext()

    fireEvent.click(screen.getByText('Add favorite'))

    expect(screen.getByTestId('favorites')).toHaveTextContent(
      '["Berlin"]'
    )

    expect(localStorage.getItem('weatherFavorites')).toBe(
      '["Berlin"]'
    )
  })

  it('removes a city from favorites', () => {
    localStorage.setItem(
      'weatherFavorites',
      JSON.stringify(['Berlin'])
    )

    renderContext()

    fireEvent.click(screen.getByText('Remove favorite'))

    expect(screen.getByTestId('favorites')).toHaveTextContent('[]')
  })

  it('toggles favorites case-insensitively', () => {
  renderContext()

  fireEvent.click(screen.getByText('Add favorite'))

  expect(screen.getByTestId('favorites')).toHaveTextContent(
    '["Berlin"]'
  )

  fireEvent.click(screen.getByText('Add lowercase favorite'))

  expect(screen.getByTestId('favorites')).toHaveTextContent('[]')
})

  it('adds a city to search history', () => {
    renderContext()

    fireEvent.click(screen.getByText('Add history'))

    expect(screen.getByTestId('history')).toHaveTextContent(
      '["Berlin"]'
    )

    expect(localStorage.getItem('weatherHistory')).toBe(
      '["Berlin"]'
    )
  })

  it('moves repeated searches to the beginning', () => {
    renderContext()

    fireEvent.click(screen.getByText('Add history'))
    fireEvent.click(screen.getByText('Add Tokyo'))
    fireEvent.click(screen.getByText('Add history'))

    expect(screen.getByTestId('history')).toHaveTextContent(
      '["Berlin","Tokyo"]'
    )
  })

  it('limits history to 10 cities', () => {
    const cities = Array.from(
      { length: 10 },
      (_, index) => `City${index}`
    )

    localStorage.setItem(
      'weatherHistory',
      JSON.stringify(cities)
    )

    renderContext()

    fireEvent.click(screen.getByText('Add Tokyo'))

    const history = JSON.parse(
      screen.getByTestId('history').textContent
    )

    expect(history).toHaveLength(10)
    expect(history[0]).toBe('Tokyo')
  })

  it('clears search history', () => {
    localStorage.setItem(
      'weatherHistory',
      JSON.stringify(['Berlin', 'Tokyo'])
    )

    renderContext()

    fireEvent.click(screen.getByText('Clear history'))

    expect(screen.getByTestId('history')).toHaveTextContent('[]')
    expect(localStorage.getItem('weatherHistory')).toBeNull()
  })
})