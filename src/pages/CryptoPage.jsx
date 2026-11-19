import { useCallback, useEffect, useState } from 'react'
import {
  Coins,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ChartLine,
} from 'lucide-react'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

import {
  getCryptoMarkets,
  getCryptoHistory,
} from '../services/crypto'

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumSignificantDigits: 7,
  }).format(price)
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function CryptoPage() {
  const [coins, setCoins] = useState([])
  const [history, setHistory] = useState([])
  const [selectedCoinId, setSelectedCoinId] = useState('btc-bitcoin')

  const [loading, setLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [error, setError] = useState('')
  const [historyError, setHistoryError] = useState('')

  const loadCrypto = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getCryptoMarkets()
      setCoins(data)
    } catch (err) {
      setError(err.message || 'Failed to load cryptocurrency data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCrypto()
  }, [loadCrypto])

  useEffect(() => {
    let cancelled = false

    async function loadHistory() {
      setHistoryLoading(true)
      setHistoryError('')
      setHistory([])

      try {
        const data = await getCryptoHistory(selectedCoinId)

        if (!cancelled) {
          setHistory(data)
        }
      } catch (err) {
        if (!cancelled) {
          setHistoryError(
            err.message || 'Failed to load price history'
          )
        }
      } finally {
        if (!cancelled) {
          setHistoryLoading(false)
        }
      }
    }

    loadHistory()

    return () => {
      cancelled = true
    }
  }, [selectedCoinId])

  const selectedCoin = coins.find(
    (coin) => coin.id === selectedCoinId
  )

  return (
    <main className="main-content">
      <header className="topbar">
        <div>
          <p className="greeting">Cryptocurrency market</p>
          <h1>Crypto Dashboard</h1>
        </div>

        <button
          className="crypto-refresh"
          onClick={loadCrypto}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? 'spin' : ''}
          />
          Refresh
        </button>
      </header>

      <section className="crypto-overview">
        <div className="crypto-overview-icon">
          <Coins size={28} />
        </div>

        <div>
          <h2>Top 10 Cryptocurrencies</h2>
          <p>Market prices and performance in USD</p>
        </div>
      </section>

      {error && (
        <div className="crypto-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Price Chart */}

      <section className="forecast-section">
        <div className="section-heading">
          <div>
            <h2>Price History</h2>
            <p>Cryptocurrency price over the last 30 days</p>
          </div>

          <select
            className="crypto-select"
            value={selectedCoinId}
            onChange={(event) =>
              setSelectedCoinId(event.target.value)
            }
          >
            {coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol})
              </option>
            ))}
          </select>
        </div>

        {selectedCoin && (
          <div className="chart-summary">
            <div>
              <span>{selectedCoin.name}</span>
              <strong>{formatPrice(selectedCoin.price)}</strong>
            </div>

            <span
              className={`crypto-change ${
                selectedCoin.change24h >= 0
                  ? 'positive'
                  : 'negative'
              }`}
            >
              {selectedCoin.change24h >= 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}

              {selectedCoin.change24h >= 0 ? '+' : ''}
              {selectedCoin.change24h.toFixed(2)}%
            </span>
          </div>
        )}

        <div className="crypto-chart">
          {historyLoading ? (
            <div className="crypto-loading">
              <RefreshCw size={30} className="spin" />
              <p>Loading price history...</p>
            </div>
          ) : historyError ? (
            <div className="crypto-loading">
              <AlertCircle size={30} />
              <p>{historyError}</p>
            </div>
          ) : history.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={history}
                margin={{
                  top: 15,
                  right: 25,
                  left: 15,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  stroke="#263449"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  minTickGap={35}
                />

                <YAxis
                  domain={['auto', 'auto']}
                  tickFormatter={(value) =>
                    formatMoney(value)
                  }
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  width={80}
                />

                <Tooltip
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    color: '#f1f5f9',
                  }}
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )
                  }
                  formatter={(value) => [
                    formatPrice(value),
                    'Price',
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: '#60a5fa',
                    stroke: '#ffffff',
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="crypto-loading">
              <ChartLine size={35} />
              <p>No historical data available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Cryptocurrency Table */}

      <section className="forecast-section">
        <div className="section-heading">
          <div>
            <h2>Market Overview</h2>
            <p>
              {coins.length} cryptocurrencies available
            </p>
          </div>
        </div>

        {loading && coins.length === 0 ? (
          <div className="crypto-loading">
            <RefreshCw size={30} className="spin" />
            <p>Loading market data...</p>
          </div>
        ) : coins.length > 0 ? (
          <div className="crypto-table-wrapper">
            <table className="crypto-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Asset</th>
                  <th>Price</th>
                  <th>24h Change</th>
                  <th>Market Cap</th>
                  <th>Volume (24h)</th>
                </tr>
              </thead>

              <tbody>
                {coins.map((coin) => {
                  const positive = coin.change24h >= 0

                  return (
                    <tr key={coin.id}>
                      <td className="crypto-rank">
                        {coin.rank}
                      </td>

                      <td>
                        <div className="crypto-asset">
                          <div className="crypto-coin-icon">
                            {coin.symbol.slice(0, 1)}
                          </div>

                          <div>
                            <strong>{coin.name}</strong>
                            <span>{coin.symbol}</span>
                          </div>
                        </div>
                      </td>

                      <td className="crypto-price">
                        {formatPrice(coin.price)}
                      </td>

                      <td>
                        <span
                          className={`crypto-change ${
                            positive ? 'positive' : 'negative'
                          }`}
                        >
                          {positive ? (
                            <TrendingUp size={15} />
                          ) : (
                            <TrendingDown size={15} />
                          )}

                          {positive ? '+' : ''}
                          {coin.change24h.toFixed(2)}%
                        </span>
                      </td>

                      <td>{formatMoney(coin.marketCap)}</td>

                      <td>{formatMoney(coin.volume24h)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <footer className="footer">
        Crypto data powered by CoinPaprika API
      </footer>
    </main>
  )
}

export default CryptoPage