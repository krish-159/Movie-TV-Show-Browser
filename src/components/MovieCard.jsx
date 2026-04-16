function MovieCard({ movie, onSelect, isActive, placeholder }) {
  return (
    <button
      className={`movie-card ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(movie.imdbID)}
    >
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : placeholder}
        alt={movie.Title}
        className="movie-poster"
      />
      <span className="card-status">{isActive ? 'Selected' : 'Open details'}</span>

      <div className="movie-card-content">
        <div className="movie-card-meta">
          <p className="movie-type">{movie.Type}</p>
          <p className="movie-year">{movie.Year}</p>
        </div>
        <h3>{movie.Title}</h3>
      </div>
    </button>
  )
}

export default MovieCard
