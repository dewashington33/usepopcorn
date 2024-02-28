import { useEffect, useState } from "react";
import StarRating from "./StarRating";
/*
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
*/

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = '92d76f2e';

export default function App() {

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);



  /* The following shows how useEffect works and when its executed

    useEffect(function () {
      console.log("After initial render");
    }, []); // empty array means it only runs once when the app mounts

    useEffect(function () {
      console.log("After every render");
    }); // no array means it runs after every render

    useEffect(function () {
      console.log("D");
    }, [query]); // array with a value means it runs after every render if the value has changed

  */
  function handleSelectMovie(id) {
    // Update the selectedId state
    // If the current id is the same as the selectedId, set selectedId to null (deselect it)
    // If the current id is not the same as the selectedId, set selectedId to the current id (select it)
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  // This function is used to handle the closing of a movie.
  // It sets the selectedId state to null, indicating that no movie is currently selected.
  function handleCloseMovie() {
    setSelectedId(null);
  }

  /* 
  This is a React component that fetches movie data from the OMDB API when it mounts.
   It sets a loading state before starting the fetch and resets it when the fetch is complete.
   If the fetch is successful, it updates the movies state with the fetched data.
   If the fetch fails, it updates the error state with the error message.
   The component renders different components based on the states:
   - If it's loading, it renders a Loader component.
   - If there's an error, it renders an ErrorMessage component with the error message.
   - If it's not loading and there's no error, it renders a MovieList component with the movies.
   It also renders a NavBar component with a Search component and a NumResults component with the movies,
   and a Main component with two Box components, one with the Loader, ErrorMessage, or MovieList,
   and one with a WatchedSummary component with the watched movies and a WatchedMoviesList component with the watched movies. 
   */
  useEffect(function () {
    async function fetchMovies() {

      try {
        setIsLoading(true);
        setError(""); // reset the error state
        const res = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${KEY}`);
        // Check if the response was not successful
        if (!res.ok) {
          // If the response was not successful, throw an error with a message
          throw new Error('Could not fetch movies.  Check your internet connection and try again.');
        }
        // Parse the response as JSON
        const data = await res.json();
        // If the API response indicates an error, throw an error with the API's error message
        // this could also indicat that there was a 404 error meaning the movie was not found
        if (data.Response === 'False') throw new Error(data.Error);
        // Update the movies state with the Search results from the API response
        setMovies(data.Search);
        // console.log(data.Search);
      }
      catch (error) {
        // Log the error to the console
        console.error(error.message);
        setError(error.message);
      } finally {
        // Set the isLoading state to false to indicate that loading is complete
        setIsLoading(false);
      }
      // console.log(data.Search);
    }

    if (!query.length) {
      setMovies([])
      setError('')
      return
    }

    fetchMovies();
  }, [query]); // empty array means it only runs once when the app mounts

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* If isLoading is true, render the Loader component */}
          {isLoading && <Loader />}
          {/* If isLoading is false and error is false, render the MovieList component */}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
          {/* If error is true, render the ErrorMessage component */}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {
            selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
              />) :
              (
                <>
                  <WatchedSummary watched={watched} />
                  <WatchedMoviesList watched={watched} />
                </>
              )
          }
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return (
    <p className="loader">Loading...</p>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error"><span>⛔</span>{message}</p>
  );
};


function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {


  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

/*
function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>

      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>
      )}
    </div>
  );
}
*/

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID}
          onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie }) {

  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { Title: title,
    Poster: poster,
    Year: year,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Genre: genre,
    Director: director,
  }
    = movie;

  console.log(title, year)

  useEffect(function () {
    async function getMovieDetails() {
      setIsLoading(true);
      try {
        const res = await fetch(`http://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}`);
        if (!res.ok) {
          throw new Error('Could not fetch movie details.  Check your internet connection and try again.');
        }
        const data = await res.json();
        // console.log(data);
        setMovie(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    getMovieDetails();
  }, [selectedId]);


  return <div className="details">
    {isLoading ? <Loader /> :
      <>
        <header>
          <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
          <img src={poster} alt={`Poster of ${movie} movie`} />
          <div className="details-overview">
            <h2>{title}</h2>
            <p>{released} &bull; {runtime}</p>
            <p>{genre}</p>
            <p><span>⭐</span>{imdbRating} IMDb rating</p>

          </div>
        </header>
        <section>
          <div className="rating">
            <StarRating maxRating={10} size={24} />
          </div>
          <p><em>{plot}</em></p>
          <p>Starring {actors}</p>
          <p>Directed by {director}</p>
        </section>
      </>
    }
  </div>;
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
