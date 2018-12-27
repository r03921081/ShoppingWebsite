const bCrypt = require("bcrypt-nodejs");
const localStrategy = require("passport-local").Strategy;

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
                                console.log("newUser null");
                                return done(null, false);
                            }
                            if(newUser){
                                console.log(newUser);
                                newUser.createCart();
                                return done(null, newUser);
                            }
                        })
                        .catch(err => console.log(err));
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
                    return done(null, false, {
                        message: "Email does not exist"
                    });
                }
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: "Incorrect password."
                    });
                }
                const userinfo = user.get();
                return done(null, userinfo);
            }).catch(function(err) {
                console.log("catch:", err);
                return done(null, false, {
                    message: "Something went wrong with your Signin"
                });
            });
        }
    ));
};

module.exports = passportLocal;