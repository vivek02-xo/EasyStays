const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");
const { reviewSchema } = require("../schema");
const Review = require('../models/review');
const Listing = require('../models/listing');



const validatereview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMssg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMssg);
    }else{
        next();
    }
}

// post review route
router.post("/", validatereview, wrapAsync(async (req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    
    res.redirect(`/listings/${listing._id}`);
}));

// Delete review route
router.delete("/:reviewId", wrapAsync(async (req, res) =>{
    let {id , reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));


module.exports = router;