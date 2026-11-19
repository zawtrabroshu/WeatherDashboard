import '../App.css'
import { useAppContext } from '../context/AppContext'
import { History as HistoryIcon, Trash2, MapPin } from 'lucide-react'

function History({ onSelectCity }) {
  const { history, clearHistory } = useAppContext()

  return (
    <main className="main-content">
      <header className="topbar">
        <div>
          <p className="greeting">Recently searched locations</p>
          <h1>Search History</h1>
        </div>
      </header>

      <section className="forecast-section">
        <div className="section-heading">
          <div>
            <h2>Recent Searches</h2>
            <p>{history.length} recent cities</p>
          </div>

          {history.length > 0 && (
            <button
              className="remove-favorite"
              onClick={clearHistory}
            >
              <Trash2 size={18} />
              Clear history
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <HistoryIcon size={40} />
            <h3>Your history is empty</h3>
            <p>Search for cities to see them here.</p>
          </div>
        ) : (
          <div className="favorites-list">
            {history.map((city, index) => (
              <div className="favorite-city-card" key={`${city}-${index}`}>
                <div className="favorite-city-info">
                  <MapPin size={20} />
                  <div>
                    <h3>{city}</h3>
                    <p>Recent search</p>
                  </div>
                </div>

                <button
                  className="search-submit"
                  onClick={() => onSelectCity(city)}
                >
                  View weather
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default History