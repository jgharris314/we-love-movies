const theaterService = require("./theaters.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
    const theaterList = await theaterService.list();
    
    for(let theater of theaterList){
        const movies = await theaterService.movieList(theater.theater_id);

        theater["movies"] = movies;
    }
    res.json({data: theaterList})
}

module.exports = {
    list: [asyncErrorBoundary(list)]
}