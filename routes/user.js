const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware");

const usersController = require("../controllers/user");


router.get("/signup", usersController.randerSignupForm);

router.post("/signup", wrapAsync(usersController.signup));

router.get("/login", usersController.renderLoginForm);

router.post("/login", saveRedirectUrl,passport.authenticate("local" , {failureRedirect: "/login" , failureFlash: true}), wrapAsync(usersController.login));

router.get("/logout", usersController.logout);

module.exports = router;