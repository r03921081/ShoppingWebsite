const Product = require("../models/product");
const UserComment = require("../models/userComment");
const { validationResult } = require("express-validator/check");

exports.getAddComment = (req, res) => {
    const productId = req.params.pid;
    Product.findByPk(productId)
        .then(prod => {
            res.render("comments/new", {
                prod: prod,
                validationErrors: []
            });
        })
        .catch(err => console.log(err));
};

exports.postAddComment = (req, res) => {
    const productId = req.params.pid;
    const prod = req.body.myProduct;
    const text = req.body.comment.text;
    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){
        return res.status(422).render("comments/new", {
            prod: prod,
            validationErrors: validationErrors.array(),
            error: validationErrors.array()[0].msg
        });
    }

    req.user.createUserComment({
            text: text
        })
        .then(comment => {
            return  Product.findByPk(productId)
                .then(product => {
                    product.addUserComment(comment);
                })
                .catch(err => console.log(err));                
        })
        .then(() => {
            console.log("Successfully add a new comment");
            req.flash("success", "Successfully add a new comment");
            res.redirect("/products/" + productId);
        })
        .catch(err => console.log(err));
};

exports.getEditComment = (req, res) => {
    const productId = req.params.pid;
    const commentId = req.params.cid;
    let myComment;

    UserComment.findByPk(commentId)
        .then(comment => {
            myComment = comment;
            return Product.findByPk(productId);
        })
        .then(product => {
            res.render("comments/edit", {
                prod: product,
                comment: myComment,
                validationErrors: []
            });
        })
        .catch(err => console.log(err));  
};

exports.putEditComment = (req,res) => {
    const productId = req.params.pid;
    const prod = req.body.myProduct;
    const commentId = req.params.cid;
    const updatedText = req.body.comment.text;    
    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){
        return res.status(422).render("comments/edit", {
            prod: prod,
            comment: {
                cid: commentId,
                text: updatedText
            },
            validationErrors: validationErrors.array(),
            error: validationErrors.array()[0].msg
        });
    }

    UserComment.findByPk(commentId)
    .then(comment => {
        console.log("---");
        console.log(comment.text);
        comment.text = updatedText;
        return comment.save();
    })
    .then(() => {
        console.log("Updated Comment Finish!");
        req.flash("success", "Updated Comment Finish!");
        res.redirect("/products/" + productId);
    })
    .catch(err => console.log(err));  
};

exports.deleteEditComment = (req, res) => {
    const commentId = req.params.cid;

    UserComment.findByPk(commentId)
    .then(comment => {
        return comment.destroy();
    })
    .then(() => {
        console.log("Delete Comment Finish!");
        req.flash("success", "Delete Comment Finish!");
        res.redirect("/products/" + req.params.pid);
    })
    .catch(err => {
        console.log(err);
    });
};