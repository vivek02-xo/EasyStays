const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const Listing = require('../models/listing');
const { isLoggedIn, isOwner, validateListing } = require("../middleware");




// Index Route 
router.get("/" , wrapAsync(async (req, res) =>{
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", {allListing})
}));

// new route
router.get('/new',isLoggedIn, (req, res) => {

    res.render('listings/new.ejs');
});

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path:'reviews',populate: {path: 'author'}}).populate('owner');

    if(!listing){
        req.flash('error', 'Listing you requested for does not exist!');
        return res.redirect('/listings');
    }
    res.render("listings/show.ejs", {listing});
}));

// create Route
router.post("/",validateListing, 
    wrapAsync(async (req, res) => {
        
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash('success', 'Successfully made a new listing!');
        res.redirect("/listings");
    })
);

// Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error', 'Listing you requested for does not exist!');
        return res.redirect('/listings');
    }
    res.render("listings/edit.ejs", {listing});
}));

// Update Route
router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash('success', 'Listing update Successfully!');
    res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    const {id} = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash('success', 'Listing deleted Successfully!');
    res.redirect("/listings");
}));

module.exports = router;