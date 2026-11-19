import '../App.css'
import { useAppContext } from '../context/AppContext'
import { Star, Trash2, MapPin } from 'lucide-react'

function Favorites({ onSelectCity }) {
  const { favorites, toggleFavorite } = useAppContext()

  return (
    <main className="main-content">
      <header className="topbar">
        <div>
          <p className="greeting">Your saved locations</p>
          <h1>Favorites</h1>
        </div>
      </header>

      <section className="forecast-section">
        <div className="section-heading">
          <div>
            <h2>Favorite Cities</h2>
            <p>{favorites.length} saved cities</p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <Star size={40} />
            <h3>No favorite cities yet</h3>
            <p>
              Search for a city on Dashboard and add it to your favorites.
            </p>
          </div>
        ) : (
          <div className="favorites-list">
            {favorites.map((city) => (
              <div className="favorite-city-card" key={city}>
                <div className="favorite-city-info">
                  <MapPin size={20} />
                  <div>
                    <h3>{city}</h3>
                    <p>Saved location</p>
                  </div>
                </div>

                <div className="favorite-city-actions">
                  <button
                    className="search-submit"
                    onClick={() => onSelectCity(city)}
                  >
                    View weather
                  </button>

                  <button
                    className="remove-favorite"
                    onClick={() => toggleFavorite(city)}
                    title="Remove from favorites"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Favorites