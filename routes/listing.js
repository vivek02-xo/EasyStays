const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const Listing = require('../models/listing');

const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingsController = require("../controllers/listings");
const multer = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingsController.index)) // index route
.post(isLoggedIn,upload.single('listing[image]') ,validateListing, wrapAsync(listingsController.createListing)); // create route




// new route
router.get('/new',isLoggedIn, listingsController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingsController.showListing)) // show route
.put(isLoggedIn,isOwner,upload.single('listing[image]') ,validateListing, wrapAsync(listingsController.updateListing)) // Update Route
.delete(isLoggedIn,isOwner, wrapAsync(listingsController.destroyListing)); // Delete Route


// Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingsController.renderEditForm));

module.exports = router;