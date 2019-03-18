const express = require("express");
const router = express.Router();
const passport = require("passport");

const indexController = require("../controllers/index");
const middleware = require("../util/middleware");
const validator = require("../util/validator");
const { validationResult } = require("express-validator/check");

// Get the landing page.
router.get("/", indexController.getLandingPage);
// Get the sign up page.
router.get("/signup", indexController.getSignup);
// Get the user information page.
router.get("/userinfo", middleware.isLoggedIn, indexController.getUserinfo);
// Sign up a new user.
router.post("/signup", [
    validator.checkUserUsername,
    validator.checkUserEmail,
    validator.checkUserPassword,
    validator.checkUserConfirmedPassword
], (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.log(validationErrors.array()[0].msg);

        return res.status(422).render("users/signup", {
            validationErrors: validationErrors.array(),
            error: validationErrors.array()[0].msg
        });
    }
    passport.authenticate("local-signup", {
        successRedirect: "/userinfo",
        failureRedirect: "/signup",
        failureFlash: true
    })(req, res);
});
// Get the login page.
router.get("/login", indexController.getSignin);
// Login the user.
router.post("/login", [
    validator.checkUserEmail,
    validator.checkUserPassword
], (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.log(validationErrors.array()[0].msg);

        return res.status(422).render("users/login", {
            validationErrors: validationErrors.array(),
            error: validationErrors.array()[0].msg
        });
    }
    passport.authenticate("local-signin", {
        successRedirect: "/products",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res);
});
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