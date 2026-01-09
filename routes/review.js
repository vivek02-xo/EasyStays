const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Review = require('../models/review');
const Listing = require('../models/listing');
const { validatereview, isLoggedIn,isReviewAuthor } = require("../middleware");


// post review route
router.post("/",isLoggedIn, validatereview, wrapAsync(async (req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success', 'new review created!');
    
    res.redirect(`/listings/${listing._id}`);
}));

// Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) =>{
    let {id , reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted Successfully!');

    res.redirect(`/listings/${id}`);
}));


module.exports = router;