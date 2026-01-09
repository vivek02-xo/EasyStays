const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const Listing = require('../models/listing');

const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingsController = require("../controllers/listings");




// Index Route 
router.get("/" , wrapAsync(listingsController.index));

// new route
router.get('/new',isLoggedIn, listingsController.renderNewForm);

// Show Route
router.get("/:id", wrapAsync(listingsController.showListing));

// create Route
router.post("/",validateListing, wrapAsync(listingsController.createListing));

// Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingsController.renderEditForm));

// Update Route
router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingsController.updateListing));

// Delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingsController.destroyListing));

module.exports = router;