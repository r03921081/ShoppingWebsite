const { body } = require("express-validator/check");
const User = require("../models/user");

let validator = {};

// Verify the user's request.
validator.checkUserUsername = body("username").isString().trim().escape().custom(value => {
    return User.findOne({
        where: {
            username: value
        }
    })
    .then(user => {
        if(user){
            return Promise.reject("Username already in use.");
        }
    });
});
validator.checkUserEmail = body("email", "Please enter a valid email.").isEmail().normalizeEmail();
validator.checkUserPassword = body("password", "Please enter a valid password.")
    .isLength({ min: 5 }).trim().isAlphanumeric();
validator.checkUserConfirmedPassword = body("confirmedPassword").trim().custom((value, { req }) => {
    if(value !== req.body.password){
        throw new Error("Password confirmation does not match password.");
    }
    return true;
}).escape();

// Verify the product's request.
validator.checkProductName = body("product[name]").isString().trim().escape();
validator.checkProductPrice = body("product[price]").isInt({ min: 0 });
validator.checkProductDescription = body("product[description]").trim().escape();

// Verify the user comment's request.
validator.checkCommentText = body("comment[text]").trim().escape();

module.exports = validator;