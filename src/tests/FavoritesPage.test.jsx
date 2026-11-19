import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Favorites from '../pages/FavoritesPage'

const toggleFavorite = vi.fn()
const onSelectCity = vi.fn()

vi.mock('../context/AppContext', () => ({
  useAppContext: vi.fn(),
}))

import { useAppContext } from '../context/AppContext'

describe('Favorites page', () => {
  it('renders saved cities', () => {
    useAppContext.mockReturnValue({
      favorites: ['Berlin', 'Tokyo'],
      toggleFavorite,
    })

    render(<Favorites onSelectCity={onSelectCity} />)

    expect(screen.getByText('Berlin')).toBeInTheDocument()
    expect(screen.getByText('Tokyo')).toBeInTheDocument()
    expect(screen.getByText('2 saved cities')).toBeInTheDocument()
  })

  it('shows empty state when there are no favorites', () => {
    useAppContext.mockReturnValue({
      favorites: [],
      toggleFavorite,
    })

    render(<Favorites onSelectCity={onSelectCity} />)

    expect(screen.getByText('No favorite cities yet')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Search for a city on Dashboard and add it to your favorites.'
      )
    ).toBeInTheDocument()
  })

  it('removes a city from favorites', () => {
    useAppContext.mockReturnValue({
      favorites: ['Berlin'],
      toggleFavorite,
    })

    render(<Favorites onSelectCity={onSelectCity} />)

    fireEvent.click(screen.getByTitle('Remove from favorites'))

    expect(toggleFavorite).toHaveBeenCalledWith('Berlin')
  })

  it('calls onSelectCity when View weather is clicked', () => {
    useAppContext.mockReturnValue({
      favorites: ['Berlin'],
      toggleFavorite,
    })

    render(<Favorites onSelectCity={onSelectCity} />)

    fireEvent.click(screen.getByText('View weather'))

    expect(onSelectCity).toHaveBeenCalledWith('Berlin')
  })
})