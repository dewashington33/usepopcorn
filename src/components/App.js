import { useEffect, useState } from "react";
import Box from "./Box";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import Main from "./Main";
import MovieDetails from "./MovieDetails";
import MovieList from "./MovieList";
import NavBar from "./NavBar";
import NumResults from "./NumResults";
import Search from "./Search";
import WatchedMoviesList from "./WatchedMoviesList";
import WatchedSummary from "./WatchedSummary";

const KEY = '92d76f2e';

export default function App() {

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);



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

  function handleAddWatch(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  // This function handles the deletion of a watched movie.
  // It takes an id as a parameter, which is the imdbID of the movie to be deleted.
  // The function updates the watched state by filtering out the movie with the given id.
  // The filter method creates a new array with all movies that pass the test implemented by the provided function.
  // In this case, the test is whether the imdbID of the movie is not equal to the given id.
  // So, all movies except the one with the given id pass the test and are included in the new array.
  // This effectively deletes the movie with the given id from the watched state.
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
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
    const controller = new AbortController();

    async function fetchMovies() {

      try {
        setIsLoading(true);
        setError(""); // reset the error state
        const res = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${KEY}`,
          { signal: controller.signal }
        );
        // Check if the response was not successful
        if (!res.ok) {
          // If the response was not successful, throw an error with a message
          throw new Error('Could not fetch movies.  Check your internet connection and try again.');
        }
        // Parse the response as JSON
        const data = await res.json();
        // If the API response indicates an error, throw an error with the API's error message
        // this could also indicate that there was a 404 error meaning the movie was not found
        if (data.Response === 'False') throw new Error(data.Error);
        // Update the movies state with the Search results from the API response
        setMovies(data.Search);
        setError("");
        // console.log(data.Search);
      }
      catch (error) {
        // Log the error to the console
        console.error(error.message);
        if (error.name !== 'AbortError') {
          setError(error.message);
        }

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

    handleCloseMovie();
    fetchMovies();
    return function () {
      controller.abort();
    }
  }, [query]); // The query state is used as a dependency for the useEffect hook

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
                onAddWatched={handleAddWatch}
                watched={watched}
              />) :
              (
                <>
                  <WatchedSummary watched={watched} />
                  <WatchedMoviesList watched={watched}
                    onDeleteWatched={handleDeleteWatched} />
                </>
              )
          }
        </Box>
      </Main>
    </>
  );
}






