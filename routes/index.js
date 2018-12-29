const express = require("express");
const router = express.Router();
const passport = require("passport");

const indexController = require("../controllers/index");
const middleware = require("../util/middleware");

// Get the landing page.
router.get("/", indexController.getLandingPage);
// Get the sign up page.
router.get("/signup", indexController.getSignup);
// Get the user information page.
router.get("/userinfo", middleware.isLoggedIn, indexController.getUserinfo);
// Sign up a new user.
router.post("/signup", passport.authenticate("local-signup", {
    successRedirect: "/userinfo",
    failureRedirect: "/signup"
}));
// Get the login page.
router.get("/login", indexController.getSignin);
// Login the user.
router.post("/login", passport.authenticate("local-signin", {
    successRedirect: "/products",
    failureRedirect: "/login"
}));
// Logout the user.
router.post("/logout", indexController.postSignout);

// Get "Forget Password Request".
router.get("/forgetPassword", indexController.getForgetPassword);
// Send "Forget Password Request" email.
router.post("/forgetPassword", indexController.postForgetPassword);
// Get "Reset Password Request".
router.get("/resetPassword/:token", indexController.getResetPassword);
// Post "Reset Password Request".
router.post("/resetPassword", indexController.postResetPassword);

exports.routes = router;