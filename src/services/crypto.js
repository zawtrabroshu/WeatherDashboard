const API_URL = 'https://api.coinpaprika.com/v1'

export async function getCryptoMarkets() {
  try {
    const response = await fetch(
      `${API_URL}/tickers?quotes=USD`
    )

    if (!response.ok) {
      throw new Error('Failed to load cryptocurrency data')
    }

    const data = await response.json()

    return data
      .filter((coin) => coin.rank && coin.quotes?.USD)
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 10)
      .map((coin) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        rank: coin.rank,
        price: coin.quotes.USD.price,
        change24h: coin.quotes.USD.percent_change_24h,
        marketCap: coin.quotes.USD.market_cap,
        volume24h: coin.quotes.USD.volume_24h,
      }))
  } catch (error) {
    console.error('Crypto API error:', error)
    throw error
  }
}

export async function getCryptoHistory(coinId) {
  try {
    const endDate = new Date()
    const startDate = new Date()

    startDate.setUTCDate(startDate.getUTCDate() - 29)

    const start = startDate.toISOString().slice(0, 10)
    const end = endDate.toISOString().slice(0, 10)

    const params = new URLSearchParams({
      start,
      end,
      interval: '1d',
      quote: 'USD',
    })

    const response = await fetch(
      `${API_URL}/tickers/${coinId}/historical?${params}`
    )

    if (!response.ok) {
      throw new Error('Failed to load price history')
    }

    const data = await response.json()

    return data
      .map((item) => ({
        date: item.timestamp,
        price: item.price,
        volume: item.volume_24h,
        marketCap: item.market_cap,
      }))
      .sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      )
  } catch (error) {
    console.error('Crypto history error:', error)
    throw error
  }
}