const knex = require("../db/connection")
const mapProperties = require("../utils/map-properties")

const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
  });
  

function list(isShowing) {
    if(isShowing){
        return knex("movies_theaters as mt")
        .join("movies as m", "m.movie_id", "mt.movie_id")
        .select("*")
        .where({is_showing: true})
        .then((activeMovies) => {
            return activeMovies.filter((element, idx, arr) => {
              return idx === arr.findIndex((selected) => selected.movie_id === element.movie_id);
            });
          });
        
    };
    return knex("movies")
        .select("*")
}

function read(movieId) {
    return knex("movies")
        .select("*")
        .where({ movie_id: movieId})
}

function theaterByMovie(movieId) {
    return knex("movies_theaters as mt")
        .join("theaters as t", "t.theater_id", "mt.theater_id")
        .select("*")
        .where({movie_id: movieId, is_showing: true});
}

function readMovieReviews(movieId) {
    return knex("reviews as r")
            .join("critics as c", "r.critic_id", "c.critic_id")
            .select("r.*", "c.*")
            .where({movie_id: movieId})
            .then((res) => {
                
                return Promise.all(res.map(addCritic))
            })
            
}

module.exports = {
    list,
    read,
    theaterByMovie,
    readMovieReviews,

}