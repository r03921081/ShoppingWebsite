const bCrypt = require("bcrypt-nodejs");
const localStrategy = require("passport-local").Strategy;
const mySendEmail = require("./email");

const passportLocal = (passport, user) => {
    const User = user;

    passport.serializeUser((user, done) => { 
        done(null, user.id); 
    });

    passport.deserializeUser((id, done) => {
        User.findByPk(id)
            .then((user) => {
                if (user) {
                    done(null, user.get());
                } else {
                    done(user.errors, null);
                }
            })
            .catch(err => console.log(err));
    });
    
    passport.use("local-signup", new localStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        },
        (req, email, password, done) => {
            // Add new input confirmedPassword here.
            // Use bCrypt.compare to compare password and confirmedPassword.
            const generateHash = password => {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            User.findOne({
                where: {
                    email: email
                }
            })
            .then(user => {
                console.log(user);
                if(user){
                    console.log("The email is already taken.");
                    req.flash("error", "The email already exists.");
                    return done(null, false, {
                        message: "The email is already taken."
                    });
                }
                else{
                    const userPassword = generateHash(password);
                    const userData = {
                        email: email,
                        password: userPassword,
                        username: req.body.username
                    };
                    User.create(userData)
                        .then((newUser) => {
                            if(!newUser){
                                req.flash("error", "Please try again");
                                console.log("newUser null");
                                return done(null, false);
                            }
                            if(newUser){
                                console.log(newUser);
                                newUser.createCart();
                                console.log(mySendEmail.sendSignupConfirmedMail(newUser));
                                return done(null, newUser);
                            }
                        })
                        .catch(err => {
                            req.flash("error", "The username already exists.");
                            console.log(err);
                            return done(null, false);
                        });
                }
            })
            .catch(err => console.log(err));
        }
    ));

    passport.use("local-signin", new localStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        },(req, email, password, done) => {
            const User = user;
            const isValidPassword = function(userpass, password) {
                return bCrypt.compareSync(password, userpass);
            };
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (!user) {
                    req.flash("error", "Email does not exist");
                    return done(null, false, {
                        message: "Email does not exist."
                    });
                }
                if (!isValidPassword(user.password, password)) {
                    req.flash("error", "Incorrect password.");
                    return done(null, false, {
                        message: "Incorrect password."
                    });
                }
                const userinfo = user.get();
                return done(null, userinfo);
            }).catch(function(err) {
                console.log("catch:", err);
                req.flash("error", "Something went wrong with your Signin.");
                return done(null, false, {
                    message: "Something went wrong with your Signin."
                });
            });
        }
    ));
};

module.exports = passportLocal;