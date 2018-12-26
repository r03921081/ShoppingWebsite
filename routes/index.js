const express = require("express");
const router = express.Router();
const passport = require("passport");

const indexController = require("../controllers/index");

router.get("/", indexController.getLandingPage);

router.get("/signup", indexController.getSignup);
router.get("/userinfo", isLoggedIn, indexController.getUserinfo);
router.post("/signup", passport.authenticate("local-signup", {
    successRedirect: "/userinfo",
    failureRedirect: "/signup"
}));
router.get("/login", indexController.getSignin);
router.post("/login", passport.authenticate("local-signin", {
    successRedirect: "/products",
    failureRedirect: "/login"
}));
router.get("/logout", indexController.getSignout);

function isLoggedIn(req, res, next){ 
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

exports.routes = router;