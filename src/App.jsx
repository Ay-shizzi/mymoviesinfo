import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const MovieDatabaseApp = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${
          import.meta.env.VITE_REACT_APP_MOVIE_API_KEY
        }&query=${query}`
      );
      setMovies(response.data.results);
    } catch (error) {
      console.error("Error searching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const showMovieDetails = async (movieId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${
          import.meta.env.VITE_REACT_APP_MOVIE_API_KEY
        }`
      );
      setSelectedMovie(response.data);
      const castResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${
          import.meta.env.VITE_REACT_APP_MOVIE_API_KEY
        }`
      );
      setCast(castResponse.data.cast);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    setQuery("");
    setMovies([]);
    setSelectedMovie(null);
    setCast([]);
    setError(null);
  };

  return (
    <>
      <nav className="navbar">
        <h1 onClick={refresh} className="logo">
          MyMovieInfo
        </h1>
        <div className="searchInputWrapper">
          <input
            className="searchInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search Movie"
          ></input>
          <i
            onClick={searchMovies}
            className="searchInputIcon fa fa-search"
          ></i>
        </div>
      </nav>
      <section className="container">
        <div className="search-output">
          {movies.map((movie) => (
            <div
              className="movie-list"
              key={movie.id}
              onClick={() => showMovieDetails(movie.id)}
            >
              <img
                className="list-img"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`Poster of ${movie.title}`}
              />
              <p className="movie-title">{movie.title}</p>
            </div>
          ))}
        </div>

        {loading && <div className="loader"></div>}

        {selectedMovie && (
          <div className="selected-movie">
            <img
              className="selected-movie-img"
              src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
              alt={`Poster of ${selectedMovie.title}`}
            />
            <h2>{selectedMovie.title}</h2>
            <p className="overview">
              <span className="info-header">Overview</span>:
              {selectedMovie.overview}
            </p>
            <p>
              <span className="info-header">Release Date</span>:
              {selectedMovie.release_date}
            </p>
            <p>
              <span className="info-header">Original Language</span>:
              {selectedMovie.original_language}
            </p>
            <p>
              <span className="info-header">Popularity</span>:
              {selectedMovie.popularity}
            </p>
            <p>
              <span className="info-header">Vote Count</span>:
              {selectedMovie.vote_count}
            </p>
            <p>
              <span className="info-header">Vote Average</span>:
              {selectedMovie.vote_average}
            </p>
            <p>
              <span className="info-header">Cast</span>:
            </p>
            <div className="casts">
              {cast.map((actor) => (
                <p key={actor.id}>{actor.name}</p>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default MovieDatabaseApp;
