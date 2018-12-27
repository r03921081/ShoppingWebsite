const Product = require("../models/product");
const UserComment = require("../models/userComment");

exports.getAddComment = (req, res) => {
    const productId = req.params.pid;
    Product.findByPk(productId)
        .then(prod => {
            res.render("comments/new", {
                prod: prod
            });
        })
        .catch(err => console.log(err));
};

exports.postAddComment = (req, res) => {
    const productId = req.params.pid;
    const text = req.body.comment.text;

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
                comment: myComment
            });
        })
        .catch(err => console.log(err));  
};

exports.putEditComment = (req,res) => {
    const productId = req.params.pid;
    const updatedText = req.body.comment.text;
    const commentId = req.params.cid;

    UserComment.findByPk(commentId)
    .then(comment => {
        console.log("---");
        console.log(comment.text);
        comment.text = updatedText;
        return comment.save();
    })
    .then(() => {
        console.log("Updated Comment Finish!");
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
        res.redirect("/products/" + req.params.pid);
    })
    .catch(err => {
        console.log(err);
    });
};