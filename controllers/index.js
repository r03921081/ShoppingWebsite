const User = require("../models/user");
const myMail = require("../util/email");
const crypto = require("crypto");
const bCrypt = require("bcrypt-nodejs");

exports.getLandingPage = (req, res) => {
    console.log("LandingPage");
    // req.flash("success", "Welcome to the MyShop.");
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

exports.postSignout = (req, res) => {
    User.findByPk(req.user.id)
        .then(user => {
            console.log(Date.now());
            user.last_login = Date.now();
            return user.save();
        })
        .then(()=>{
            req.flash("success", "You have successfully logged out.");
            req.session.destroy(() => {                
                res.redirect("/");
            });
        })
        .catch(err => console.log(err));    
};

exports.getForgetPassword = (req, res) => {
    res.render("users/forget");
};

exports.postForgetPassword = (req, res) => {
    const requestEmail = req.body.email;
    // Need to create a crypto token for user.
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            console.log(err);
            res.redirect("/");
        }
        const token = buffer.toString("hex");
        User.findOne({
            where: {
                email: requestEmail
            }
        })
        .then(user => {
            if(!user){
                console.log("No account with that email found");
                return res.redirect("/forget");
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 600000;
            return user.save();
        })
        .then(() => {
            myMail.sendResetPassword(requestEmail, token);
            res.redirect("/");
        })
        .catch(err => console.log(err));
    });
    
};

exports.getResetPassword = (req, res) => {
    const myToken = req.params.token;
    User.findOne({
        where: {
            resetToken: myToken,
            resetTokenExpiration: {$gt: Date.now()}
        }
    })
    .then(user => {
        res.render("users/reset", {
            userName: user.username,
            userId: user.id,
            userToken: myToken
        });
    })
    .catch(err => console.log(err));
    res.render("users/reset");
};

exports.postResetPassword = (req, res) => {
    const userId = req.body.userId;
    const newPassword = req.body.password;
    const myToken = req.body.userToken;
    let myUser;

    User.findOne({
        where: {
            id: userId,
            resetToken: myToken,
            resetTokenExpiration: {$gt: Date.now()}
        }
    })
    .then(user => {
        myUser = user;
        return bCrypt.hashSync(newPassword, bCrypt.genSaltSync(8), null);
    })
    .then(userPassword => {
        myUser.password = userPassword;
        myUser.resetToken = null;
        myUser.resetTokenExpiration = null;
        return myUser.save();
    })
    .then(() => {
        res.redirect("/login");
    })
    .catch(err => console.log(err));
};