const reviewService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function reviewExists(req, res, next) {
    const {reviewId} = req.params;
    const review = await reviewService.read(reviewId);

    if(review.length) {
        res.locals.review = review;
        return next();
    }

    return next({status: 404, message: "Review cannot be found"})
}
function read(req, res, next){
    res.json({data: res.locals.review[0]})
}

async function destroy(req, res) {
    await reviewService.destroy(res.locals.review[0].review_id);
    res.sendStatus(204);
}

async function hasProps(req, res, next) {
    const {data} = req.body;

    if(!data.content && !data.score){
        return next({
            status: 400,
            message: `The update request must include score and/or content properties.`
        })
    }
    res.locals.updatedReview = data;
    return next();
}

async function update(req, res){
    const updatedReview = {
        ...res.locals.review[0],
        ...res.locals.updatedReview, 
    };

    const data = await reviewService.update(updatedReview);
    res.json({data: data});
};

module.exports = {
    read: [asyncErrorBoundary(reviewExists), read],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(hasProps), asyncErrorBoundary(update)]
}