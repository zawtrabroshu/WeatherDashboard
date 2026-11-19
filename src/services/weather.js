const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'

export async function searchCity(city) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=5&language=en&format=json`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to search city')
  }

  const data = await response.json()

  if (!data.results || data.results.length === 0) {
    throw new Error('City not found')
  }

  return data.results
}

export async function getWeather(latitude, longitude) {
  const url =
    `${WEATHER_URL}?latitude=${latitude}` +
    `&longitude=${longitude}` +
    '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl' +
    '&hourly=temperature_2m,weather_code' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset' +
    '&timezone=auto' +
    '&forecast_days=7'

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to load weather')
  }

  return response.json()
}

export function getWeatherDescription(code) {
  const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Light rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Freezing rain',
    67: 'Heavy freezing rain',
    71: 'Light snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Light rain showers',
    81: 'Moderate rain showers',
    82: 'Heavy rain showers',
    85: 'Light snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Heavy thunderstorm with hail',
  }

  return weatherCodes[code] || 'Unknown weather'
}

export function getWeatherIconType(code) {
  if (code === 0 || code === 1) {
    return 'sun'
  }

  if (code === 2 || code === 3 || code === 45 || code === 48) {
    return 'cloud'
  }

  if (code >= 51 && code <= 67) {
    return 'rain'
  }

  if (code >= 71 && code <= 86) {
    return 'snow'
  }

  if (code >= 95) {
    return 'rain'
  }

  return 'cloud'
}