const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Review = require('../models/review');
const Listing = require('../models/listing');
const { validatereview, isLoggedIn,isReviewAuthor } = require("../middleware");
const reviewsController = require("../controllers/reviews");



// post review route
router.post("/",isLoggedIn, validatereview, wrapAsync(reviewsController.createReview));

// Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewsController.destroyReview));


module.exports = router;