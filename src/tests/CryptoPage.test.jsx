import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CryptoPage from '../pages/CryptoPage'

const { getCryptoMarkets, getCryptoHistory } = vi.hoisted(() => ({
  getCryptoMarkets: vi.fn(),
  getCryptoHistory: vi.fn(),
}))

vi.mock('../services/crypto', () => ({
  getCryptoMarkets,
  getCryptoHistory,
}))

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
}))

const mockCoins = [
  {
    id: 'btc-bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    rank: 1,
    price: 65000,
    change24h: 2.5,
    marketCap: 1200000000,
    volume24h: 50000000,
  },
  {
    id: 'eth-ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    rank: 2,
    price: 3500,
    change24h: -1.25,
    marketCap: 500000000,
    volume24h: 20000000,
  },
]

const mockHistory = [
  { date: '2026-11-01', price: 60000 },
  { date: '2026-11-02', price: 62000 },
]

describe('CryptoPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    getCryptoMarkets.mockResolvedValue(mockCoins)
    getCryptoHistory.mockResolvedValue(mockHistory)
  })

  it('renders cryptocurrency market data', async () => {
    render(<CryptoPage />)

    expect(
      await screen.findByText('Crypto Dashboard')
    ).toBeInTheDocument()

    expect(screen.getAllByText('Bitcoin').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Ethereum').length).toBeGreaterThan(0)

    expect(
      screen.getByText('2 cryptocurrencies available')
    ).toBeInTheDocument()

    expect(screen.getByText('Market Overview')).toBeInTheDocument()
  })

  it('loads Bitcoin price history on initial render', async () => {
  render(<CryptoPage />)

  await waitFor(() => {
    expect(getCryptoHistory).toHaveBeenCalledWith('btc-bitcoin')
  })

  await waitFor(() => {
    expect(
      screen.queryByText('Loading price history...')
    ).not.toBeInTheDocument()
  })
})

  it('changes selected cryptocurrency', async () => {
    render(<CryptoPage />)

    await screen.findAllByText('Bitcoin')

    const select = screen.getByRole('combobox')

    fireEvent.change(select, {
      target: { value: 'eth-ethereum' },
    })

    await waitFor(() => {
      expect(getCryptoHistory).toHaveBeenCalledWith('eth-ethereum')
    })

    expect(screen.getAllByText('Ethereum').length).toBeGreaterThan(0)
  })

  it('shows error when market data fails to load', async () => {
    getCryptoMarkets.mockRejectedValue(
      new Error('Failed to load market data')
    )

    render(<CryptoPage />)

    expect(
      await screen.findByText('Failed to load market data')
    ).toBeInTheDocument()
  })

  it('shows error when cryptocurrency history fails', async () => {
    getCryptoHistory.mockRejectedValue(
      new Error('Failed to load price history')
    )

    render(<CryptoPage />)

    expect(
      await screen.findByText('Failed to load price history')
    ).toBeInTheDocument()
  })

  it('refreshes cryptocurrency market data', async () => {
    render(<CryptoPage />)

    await screen.findAllByText('Bitcoin')

    const refreshButton = screen.getByText('Refresh')

    fireEvent.click(refreshButton)

    await waitFor(() => {
      expect(getCryptoMarkets).toHaveBeenCalledTimes(2)
    })
  })
})