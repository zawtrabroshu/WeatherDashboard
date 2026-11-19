import { useEffect, useState } from 'react'
import './App.css'
import { AppProvider, useAppContext } from './context/AppContext'
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Search,
  MapPin,
  Star,
  LayoutDashboard,
  Heart,
  History,
  Coins,
  Settings,
  Menu,
  CloudSnow,
  LoaderCircle,
} from 'lucide-react'

import {
  searchCity,
  getWeather,
  getWeatherDescription,
  getWeatherIconType,
} from './services/weather'

import FavoritesPage from './pages/FavoritesPage'
import HistoryPage from './pages/HistoryPage'
import CryptoPage from './pages/CryptoPage'

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Cloud />
        </div>

        <span>
          Weather<span className="brand-accent">Flow</span>
        </span>
      </div>

      <div className="sidebar-label">MENU</div>

      <nav className="nav-menu">
        <div
          className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </div>

        <div
          className={`nav-item ${activePage === 'favorites' ? 'active' : ''}`}
          onClick={() => onNavigate('favorites')}
        >
          <Heart size={19} />
          <span>Favorites</span>
        </div>

        <div
          className={`nav-item ${activePage === 'history' ? 'active' : ''}`}
          onClick={() => onNavigate('history')}
        >
          <History size={19} />
          <span>History</span>
        </div>

        <div
          className={`nav-item ${activePage === 'crypto' ? 'active' : ''}`}
          onClick={() => onNavigate('crypto')}
        >
          <Coins size={19} />
          <span>Crypto</span>
        </div>
      </nav>

      <div className="sidebar-bottom">
        <div className="nav-item">
          <Settings size={19} />
          <span>Settings</span>
        </div>

        <div className="profile">
          <div className="profile-avatar">E</div>

          <div className="profile-info">
            <strong>Weather User</strong>
            <span>Personal account</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function WeatherIcon({ type = 'sun', size = 45 }) {
  if (type === 'rain') {
    return <CloudRain size={size} />
  }

  if (type === 'wind') {
    return <Wind size={size} />
  }

  if (type === 'cloud') {
    return <Cloud size={size} />
  }

  if (type === 'snow') {
    return <CloudSnow size={size} />
  }

  return <Sun size={size} />
}

function MainDashboard({ selectedCity }) {
  const { favorites, toggleFavorite, addHistory } = useAppContext()

  const [city, setCity] = useState('Lörrach')
  const [searchInput, setSearchInput] = useState('')
  const [weather, setWeather] = useState(null)
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')

  const favorite = favorites.some(
    (item) => item.toLowerCase() === city.toLowerCase()
  )

  async function loadCity(cityName) {
    setLoading(true)
    setError('')

    try {
      const cities = await searchCity(cityName)

      if (!cities || cities.length === 0) {
        throw new Error('City not found')
      }

      const selectedCityData = cities[0]

      const weatherData = await getWeather(
        selectedCityData.latitude,
        selectedCityData.longitude
      )

      setLocation(selectedCityData)
      setWeather(weatherData)
      setCity(selectedCityData.name)
      setSearchInput('')

      return selectedCityData
    } catch (err) {
      setError(err.message || 'Something went wrong')
      return null
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(event) {
    event.preventDefault()

    if (!searchInput.trim()) {
      return
    }

    setSearching(true)

    const result = await loadCity(searchInput.trim())

    if (result) {
      addHistory(result.name)
    }

    setSearching(false)
  }

  function handleFavorite() {
    if (city) {
      toggleFavorite(city)
    }
  }

  useEffect(() => {
    loadCity(selectedCity || 'Lörrach')
  }, [selectedCity])

  const current = weather?.current
  const daily = weather?.daily
  const hourly = weather?.hourly

  const currentWeatherType = current
    ? getWeatherIconType(current.weather_code)
    : 'sun'

  const currentDescription = current
    ? getWeatherDescription(current.weather_code)
    : ''

  const currentTime = current?.time
    ? new Date(current.time).getHours()
    : new Date().getHours()

  const hourlyForecast = hourly
    ? hourly.time
        .map((time, index) => ({
          time,
          temperature: hourly.temperature_2m[index],
          weatherCode: hourly.weather_code[index],
        }))
        .filter(
          (item) => new Date(item.time).getHours() >= currentTime
        )
        .slice(0, 6)
    : []

  const dailyForecast = daily
    ? daily.time.map((date, index) => ({
        date,
        weatherCode: daily.weather_code[index],
        max: daily.temperature_2m_max[index],
        min: daily.temperature_2m_min[index],
      }))
    : []

  function formatHour(time) {
    return new Date(time).toLocaleTimeString('en', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function formatDay(date, index) {
    if (index === 0) return 'Today'
    if (index === 1) return 'Tomorrow'

    return new Date(date).toLocaleDateString('en', {
      weekday: 'long',
    })
  }

  return (
    <main className="main-content">
      <header className="topbar">
        <div>
          <p className="greeting">Welcome back 👋</p>
          <h1>Weather Dashboard</h1>
        </div>

        <button className="menu-button">
          <Menu size={20} />
        </button>

        <form className="search-box" onSubmit={handleSearch}>
          <Search size={18} />

          <input
            type="text"
            placeholder="Search city..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />

          <button
            type="submit"
            className="search-submit"
            disabled={searching}
          >
            {searching ? (
              <LoaderCircle size={16} className="spin" />
            ) : (
              'Search'
            )}
          </button>
        </form>
      </header>

      {error && (
        <div className="error-message">
          {error === 'City not found'
            ? 'City not found. Please try another name.'
            : error}
        </div>
      )}

      <section className="weather-section">
        <div className="section-heading">
          <div>
            <h2>Today's Weather</h2>
            <p>Current weather conditions</p>
          </div>

          <button
            className={`favorite-button ${favorite ? 'favorited' : ''}`}
            onClick={handleFavorite}
            disabled={loading || !location}
          >
            <Star
              size={17}
              fill={favorite ? 'currentColor' : 'none'}
            />

            {favorite
              ? 'Added to favorites'
              : 'Add to favorites'}
          </button>
        </div>

        <div className="weather-hero">
          {loading ? (
            <div className="loading-weather">
              <LoaderCircle size={35} className="spin" />
              <span>Loading weather...</span>
            </div>
          ) : current ? (
            <>
              <div className="weather-hero-left">
                <div className="location">
                  <MapPin size={17} />
                  <span>
                    {location?.name}, {location?.country}
                  </span>
                </div>

                <div className="temperature">
                  {Math.round(current.temperature_2m)}
                  <span>°</span>
                </div>

                <h3>{currentDescription}</h3>

                <p className="feels-like">
                  Feels like{' '}
                  {Math.round(current.apparent_temperature)}°C
                </p>

                {dailyForecast.length > 0 && (
                  <div className="temperature-range">
                    <span>
                      ↑ {Math.round(dailyForecast[0].max)}°
                    </span>

                    <span>
                      ↓ {Math.round(dailyForecast[0].min)}°
                    </span>
                  </div>
                )}
              </div>

              <div className="hero-weather-icon">
                <WeatherIcon
                  type={currentWeatherType}
                  size={150}
                />
              </div>

              <div className="hero-decoration"></div>
            </>
          ) : null}
        </div>

        {!loading && current && (
          <div className="weather-stats">
            <div className="stat-card">
              <div className="stat-icon humidity">
                <Droplets size={21} />
              </div>

              <div>
                <span className="stat-label">Humidity</span>
                <strong>{current.relative_humidity_2m}%</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon wind">
                <Wind size={21} />
              </div>

              <div>
                <span className="stat-label">Wind speed</span>
                <strong>{current.wind_speed_10m} km/h</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon visibility">
                <Sun size={21} />
              </div>

              <div>
                <span className="stat-label">Weather</span>
                <strong>{currentDescription}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pressure">
                <Cloud size={21} />
              </div>

              <div>
                <span className="stat-label">Pressure</span>
                <strong>
                  {Math.round(current.pressure_msl)} hPa
                </strong>
              </div>
            </div>
          </div>
        )}
      </section>

      {!loading && weather && (
        <>
          <section className="forecast-section">
            <div className="section-heading">
              <div>
                <h2>Hourly Forecast</h2>
                <p>Weather throughout the day</p>
              </div>
            </div>

            <div className="hourly-list">
              {hourlyForecast.map((hour, index) => (
                <div
                  className={`hour-card ${
                    index === 0 ? 'hour-active' : ''
                  }`}
                  key={hour.time}
                >
                  <span className="hour-time">
                    {index === 0
                      ? 'Now'
                      : formatHour(hour.time)}
                  </span>

                  <WeatherIcon
                    type={getWeatherIconType(hour.weatherCode)}
                  />

                  <strong>
                    {Math.round(hour.temperature)}°
                  </strong>
                </div>
              ))}
            </div>
          </section>

          <section className="forecast-section">
            <div className="section-heading">
              <div>
                <h2>7-Day Forecast</h2>
                <p>Coming days overview</p>
              </div>
            </div>

            <div className="daily-list">
              {dailyForecast.map((day, index) => (
                <div className="daily-card" key={day.date}>
                  <span>{formatDay(day.date, index)}</span>

                  <WeatherIcon
                    type={getWeatherIconType(day.weatherCode)}
                    size={30}
                  />

                  <div className="daily-temperatures">
                    <strong>{Math.round(day.max)}°</strong>
                    <span>{Math.round(day.min)}°</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <footer className="footer">
        WeatherFlow · Powered by Open-Meteo
      </footer>
    </main>
  )
}


function AppContent() {
  const [activePage, setActivePage] = useState('dashboard')
  const [selectedCity, setSelectedCity] = useState('Lörrach')

  function handleSelectCity(city) {
    setSelectedCity(city)
    setActivePage('dashboard')
  }

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      {activePage === 'dashboard' && (
        <MainDashboard selectedCity={selectedCity} />
      )}

      {activePage === 'favorites' && (
        <FavoritesPage onSelectCity={handleSelectCity} />
      )}

      {activePage === 'history' && (
        <HistoryPage onSelectCity={handleSelectCity} />
      )}

      {activePage === 'crypto' && <CryptoPage />}
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App