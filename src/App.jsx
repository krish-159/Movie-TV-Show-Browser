import { useEffect, useState } from 'react'
import MovieCard from './components/MovieCard.jsx'
import posterPlaceholder from './assets/poster-placeholder.svg'
import './App.css'

const API_KEY = 'd7a6d1ed'

function App() {
  const [searchText, setSearchText] = useState('')
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query) {
      setMovies([])
      setSelectedId('')
      setSelectedMovie(null)
      setError('')
      setLoading(false)
      return
    }

    const fetchMovies = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
        )
        const data = await response.json()

        if (data.Response === 'True') {
          setMovies(data.Search)
          setSelectedId(data.Search[0].imdbID)
          setSelectedMovie(null)
        } else {
          setMovies([])
          setSelectedId('')
          setSelectedMovie(null)
          setError(data.Error || 'No movies found.')
        }
      } catch {
        setMovies([])
        setSelectedId('')
        setSelectedMovie(null)
        setError('Something went wrong while fetching movies.')
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [query])

  useEffect(() => {
    if (!selectedId) {
      return
    }

    const fetchMovieDetails = async () => {
      setDetailsLoading(true)

      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}&plot=full`
        )
        const data = await response.json()

        if (data.Response === 'True') {
          setSelectedMovie(data)
        } else {
          setSelectedMovie(null)
        }
      } catch {
        setSelectedMovie(null)
      } finally {
        setDetailsLoading(false)
      }
    }

    fetchMovieDetails()
  }, [selectedId])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (searchText.trim() === '') {
      return
    }

    setQuery(searchText.trim())
  }

  return (
    <div className="app-shell">
      <header className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Movie Search Project</p>
          <h1>Search for movies and check some quick details.</h1>
          <p className="hero-text">
            This is a simple movie finder I made using React and the OMDb API.
            You can search any movie or show, then click a card to see more
            information on the side.
          </p>

          <div className="hero-stats" aria-label="Search summary">
            <div className="stat-pill">
              <span>Current search</span>
              <strong>{query || 'Nothing searched yet'}</strong>
            </div>
            <div className="stat-pill">
              <span>Total results</span>
              <strong>
                {!query
                  ? '0 items'
                  : loading
                    ? 'Loading...'
                    : movies.length + ' items'}
              </strong>
            </div>
            <div className="stat-pill">
              <span>Selected movie</span>
              <strong>{selectedMovie ? selectedMovie.Title : 'No movie selected'}</strong>
            </div>
          </div>
        </div>

        <form className="search-bar" onSubmit={handleSubmit}>
          <label className="search-label" htmlFor="movie-search">
            Type a movie name
          </label>
          <div className="search-controls">
            <input
              id="movie-search"
              type="text"
              placeholder="Example: Interstellar"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            <button type="submit">Search</button>
          </div>
        </form>
      </header>

      <main className="content-grid">
        <section className="results-panel">
          <div className="section-head">
            <div>
              <p className="section-label">Search Results</p>
              <h2>{loading ? 'Searching...' : `${movies.length} movies found`}</h2>
            </div>
            <p className="section-note">{query || 'You can search anything'}</p>
          </div>

          {error ? <p className="message error-message">{error}</p> : null}
          {loading ? <p className="message">Loading movies...</p> : null}
          {!loading && !error && !query ? (
            <p className="message">
              Start by typing any movie or TV show in the search box.
            </p>
          ) : null}
          {!loading && !error ? (
            <p className="panel-intro">Click any card to see more details.</p>
          ) : null}

          {!loading && !error ? (
            <div className="movie-grid">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  onSelect={setSelectedId}
                  isActive={selectedId === movie.imdbID}
                  placeholder={posterPlaceholder}
                />
              ))}
            </div>
          ) : null}
        </section>

        <aside className="details-panel">
          <p className="section-label">Movie Details</p>
          {detailsLoading ? <p className="message">Loading details...</p> : null}

          {!detailsLoading && selectedMovie ? (
            <div className="details-card">
              <img
                src={
                  selectedMovie.Poster !== 'N/A'
                    ? selectedMovie.Poster
                    : posterPlaceholder
                }
                alt={selectedMovie.Title}
                className="details-poster"
              />

              <div className="details-content">
                <div className="title-row">
                  <div>
                    <h3>{selectedMovie.Title}</h3>
                    <p className="detail-subtitle">
                      {selectedMovie.Type} | {selectedMovie.Year}
                    </p>
                  </div>
                  <span className="rating-badge">
                    {selectedMovie.imdbRating && selectedMovie.imdbRating !== 'N/A'
                      ? 'IMDb ' + selectedMovie.imdbRating
                      : 'No rating'}
                  </span>
                </div>

                <div className="tag-row">
                  {selectedMovie.Genre && selectedMovie.Genre !== 'N/A'
                    ? selectedMovie.Genre.split(',').map((genre) => (
                        <span className="genre-tag" key={genre}>
                          {genre.trim()}
                        </span>
                      ))
                    : null}
                </div>

                <p className="meta-line">
                  {selectedMovie.Runtime} • {selectedMovie.Rated} •{' '}
                  {selectedMovie.Released}
                </p>
                <p className="plot">{selectedMovie.Plot}</p>

                <div className="info-list">
                  <div>
                    <span>Director</span>
                    <p>{selectedMovie.Director}</p>
                  </div>
                  <div>
                    <span>Actors</span>
                    <p>{selectedMovie.Actors}</p>
                  </div>
                  <div>
                    <span>Language</span>
                    <p>{selectedMovie.Language}</p>
                  </div>
                  <div>
                    <span>Awards</span>
                    <p>{selectedMovie.Awards}</p>
                  </div>
                  <div>
                    <span>Writer</span>
                    <p>{selectedMovie.Writer}</p>
                  </div>
                  <div>
                    <span>Box Office</span>
                    <p>{selectedMovie.BoxOffice}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {!detailsLoading && !selectedMovie && !error ? (
            <p className="message">Select a movie card to see the details here.</p>
          ) : null}
        </aside>
      </main>
    </div>
  )
}

export default App
