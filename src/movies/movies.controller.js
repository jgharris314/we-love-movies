const movieService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
    const {movieId} = req.params;
    const movie = await movieService.read(movieId);

    if(movie.length) {
        res.locals.movie = movie;
        return next();
    }
    return next({status: 404, message: "Movie cannot be found"})
}

async function theaterByMovie(req, res, next) {
    const {movieId} = req.params;
    const data = await movieService.theaterByMovie(movieId);
    res.json({data})
}

async function list(req, res, next){
    const isShowing = req.query.is_showing === "true"
    const data = await movieService.list(isShowing);
    res.json({data})
}

async function readMovieReviews(req, res, next){
    const {movieId} = req.params;
    const data = await movieService.readMovieReviews(movieId)
    res.json({data: data})
}

function read(req, res, next){
    res.json({data: res.locals.movie[0]})
}

module.exports = {

    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), read],
    readTheaterByMovie: [asyncErrorBoundary(movieExists), asyncErrorBoundary(theaterByMovie)],
    readMovieReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readMovieReviews)],


};