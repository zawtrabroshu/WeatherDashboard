import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import History from '../pages/HistoryPage'

const clearHistory = vi.fn()
const onSelectCity = vi.fn()

vi.mock('../context/AppContext', () => ({
  useAppContext: vi.fn(),
}))

import { useAppContext } from '../context/AppContext'

describe('History page', () => {
  it('renders recent searched cities', () => {
    useAppContext.mockReturnValue({
      history: ['Berlin', 'Tokyo'],
      clearHistory,
    })

    render(<History onSelectCity={onSelectCity} />)

    expect(screen.getByText('Berlin')).toBeInTheDocument()
    expect(screen.getByText('Tokyo')).toBeInTheDocument()
    expect(screen.getByText('2 recent cities')).toBeInTheDocument()
  })

  it('shows empty state when history is empty', () => {
    useAppContext.mockReturnValue({
      history: [],
      clearHistory,
    })

    render(<History onSelectCity={onSelectCity} />)

    expect(screen.getByText('Your history is empty')).toBeInTheDocument()
    expect(
      screen.getByText('Search for cities to see them here.')
    ).toBeInTheDocument()
  })

  it('calls onSelectCity when View weather is clicked', () => {
    useAppContext.mockReturnValue({
      history: ['Berlin'],
      clearHistory,
    })

    render(<History onSelectCity={onSelectCity} />)

    fireEvent.click(screen.getByText('View weather'))

    expect(onSelectCity).toHaveBeenCalledWith('Berlin')
  })

  it('clears history when Clear history is clicked', () => {
    useAppContext.mockReturnValue({
      history: ['Berlin', 'Tokyo'],
      clearHistory,
    })

    render(<History onSelectCity={onSelectCity} />)

    fireEvent.click(screen.getByText('Clear history'))

    expect(clearHistory).toHaveBeenCalledOnce()
  })
})