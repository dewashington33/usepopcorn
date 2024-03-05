import { useEffect, useState } from 'react';
import Loader from './Loader';
import StarRating from './StarRating';

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
    const KEY = '92d76f2e';
    const [movie, setMovie] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [userRating, setUserRating] = useState('');

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