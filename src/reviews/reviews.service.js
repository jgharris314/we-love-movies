const knex = require("../db/connection")

function read(reviewId) {
    return knex("reviews")
                .select("*")
                .where({review_id: reviewId})
}

function destroy(reviewId){
    return knex("reviews").where({review_id: reviewId}).del();
}

function update(updatedReview) {
    return knex("reviews as r")
      .where({ "r.review_id": updatedReview.review_id })
      .update(updatedReview, "*")
      .then(() => Promise.resolve(_attachCritic(updatedReview)));
  }

async function _attachCritic(review) {
    review.critic = await knex("critics as c")
      .where({
        "c.critic_id": review.critic_id,
      })
      .first();
    return review;
  }

module.exports = {
    read,
    destroy,
    update
}