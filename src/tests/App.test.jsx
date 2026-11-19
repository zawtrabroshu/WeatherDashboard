import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('WeatherFlow application', () => {
  it('renders the application', () => {
    render(<App />)

    expect(
      screen.getByText('Weather Dashboard')
    ).toBeInTheDocument()
  })

  it('renders Dashboard navigation', () => {
    render(<App />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders Favorites navigation', () => {
    render(<App />)

    expect(screen.getByText('Favorites')).toBeInTheDocument()
  })

  it('renders History navigation', () => {
    render(<App />)

    expect(screen.getByText('History')).toBeInTheDocument()
  })

  it('renders Crypto navigation', () => {
    render(<App />)

    expect(screen.getByText('Crypto')).toBeInTheDocument()
  })
})