import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  searchCity,
  getWeather,
  getWeatherDescription,
  getWeatherIconType,
} from '../services/weather'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('Weather API', () => {
  it('searches for a city successfully', async () => {
    const cities = [
      { name: 'Lörrach', latitude: 47.615, longitude: 7.664 },
    ]

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: cities }),
    })

    vi.stubGlobal('fetch', fetchMock)

    const result = await searchCity('Lörrach')

    expect(result).toEqual(cities)
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('throws an error when city is not found', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: [] }),
      })
    )

    await expect(searchCity('UnknownCity')).rejects.toThrow(
      'City not found'
    )
  })

  it('throws an error when city search request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
      })
    )

    await expect(searchCity('Berlin')).rejects.toThrow(
      'Failed to search city'
    )
  })

  it('loads weather successfully', async () => {
    const weatherData = {
      current: {
        temperature_2m: 10,
        weather_code: 3,
      },
    }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => weatherData,
      })
    )

    const result = await getWeather(47.615, 7.664)

    expect(result).toEqual(weatherData)
  })

  it('throws an error when weather request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
      })
    )

    await expect(getWeather(47.615, 7.664)).rejects.toThrow(
      'Failed to load weather'
    )
  })

  it('returns correct weather descriptions', () => {
    expect(getWeatherDescription(0)).toBe('Clear sky')
    expect(getWeatherDescription(3)).toBe('Overcast')
    expect(getWeatherDescription(61)).toBe('Light rain')
    expect(getWeatherDescription(71)).toBe('Light snow')
    expect(getWeatherDescription(95)).toBe('Thunderstorm')
  })

  it('returns unknown weather for unsupported codes', () => {
    expect(getWeatherDescription(999)).toBe('Unknown weather')
  })

  it('returns correct weather icon types', () => {
    expect(getWeatherIconType(0)).toBe('sun')
    expect(getWeatherIconType(2)).toBe('cloud')
    expect(getWeatherIconType(61)).toBe('rain')
    expect(getWeatherIconType(71)).toBe('snow')
    expect(getWeatherIconType(95)).toBe('rain')
  })
})