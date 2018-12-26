const User = require("../models/user");

exports.getLandingPage = (req, res) => {
    console.log("LandingPage");
    req.flash("success", "Welcome to the MyShop.");
    res.render("landing");
};

exports.getSignup = (req, res) => {
    res.render("users/signup");
};

exports.getUserinfo = (req, res) => {
    console.log(req.user);
    res.render("users/userinfo", {
        user: req.user
    });
};

exports.getSignin = (req, res) => {
    res.render("users/login");
};

exports.getSignout = (req, res) => {
    User.findByPk(req.user.id)
        .then(user => {
            console.log(Date.now());
            user.last_login = Date.now();
            return user.save();
        })
        .then(()=>{
            req.flash("success", "You have successfully logged out.");
            req.session.destroy(() => res.redirect("/"));
        })
        .catch(err => console.log(err));    
};