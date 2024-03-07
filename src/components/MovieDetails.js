import { useEffect, useState } from 'react';
import Loader from './Loader';
import StarRating from './StarRating';

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
    const KEY = '92d76f2e';
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState('');
    /*
    The watched variable is presumably an array of movie objects, each with an imdbID property. 
    The map function is used to create a new array that consists of the 
    imdbID of each movie in the watched array.
    
    The includes function is then called on this new array of imdbIDs. 
    It checks if selectedId is present in the array. 
    The selectedId is likely the imdbID of a movie that the user 
    has selected or is currently viewing.
    
    The result of this check (a boolean value) is assigned to the isWatched constant. 
    If selectedId is found within the array of imdbIDs, isWatched will be true, 
    indicating that the selected movie has been watched. 
    If selectedId is not found, 
    isWatched will be false, indicating that the selected movie has not been watched.
    */
    const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
    console.log(isWatched);

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



    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: runtime.split(' ').at(0),
            userRating,
        };
        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    // Use the useEffect hook to perform side effects
    useEffect(function () {
        // Define an asynchronous function to fetch movie details
        async function getMovieDetails() {
            // Set the isLoading state to true to indicate that the data is currently being loaded
            setIsLoading(true);
            try {
                // Make a fetch request to the OMDB API with the selectedId and the API key
                const res = await fetch(`http://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}`);
                // If the response status is not ok, throw an error
                if (!res.ok) {
                    throw new Error('Could not fetch movie details.  Check your internet connection and try again.');
                }
                // Parse the response as JSON
                const data = await res.json();
                // Update the movie state with the fetched data
                setMovie(data);
            } catch (error) {
                // If an error is thrown, log the error message to the console
                console.error(error.message);
            } finally {
                // Whether an error was thrown or not, set the isLoading state to false to indicate that the loading is complete
                setIsLoading(false);
            }
        }
        // Call the getMovieDetails function to start the fetch request
        getMovieDetails();
        // The useEffect hook is set to run whenever the selectedId state changes
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
                        {!isWatched ?
                            <>
                                <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
                                { /* If the userRating is greater than 0, render the button */}
                                {userRating > 0 &&
                                    (<button className="btn-add"
                                        onClick={handleAdd}>
                                        + Add to list
                                    </button>
                                    )}
                            </> : (
                                <p>You rated the movie</p>
                            )}
                    </div>
                    <p><em>{plot}</em></p>
                    <p>Starring {actors}</p>
                    <p>Directed by {director}</p>
                </section>
            </>
        }
    </div>;
}

export default MovieDetails