// This function calculates the average of all numbers in an array.
// It uses the reduce method to sum up all the numbers in the array,
// and then divides the sum by the length of the array to get the average.
// a is the accumulator, and b is the current value in the array.
// The 0 in the reduce method is the initial value of the accumulator.
//function average(arr) {
//console.log('Array: ')
//    console.log(arr)
//     return arr.reduce((a, b) => a + b, 0) / arr.length;
//}

function average(arr) {
    return arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
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
                    <span>{avgImdbRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                </p>
            </div>
        </div>
    );
}

export default WatchedSummary