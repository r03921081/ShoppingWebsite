const Product = require("../models/product");
const Comment = require("../models/comment");
const association = require("../util/association");

exports.getAddComment = (req, res) => {
    Product.findByPk(req.params.pid)
        .then(prod => {
            console.log(prod);
            res.render("comments/new", {
                prod: prod
            });
        })
        .catch(err => console.log(err));
};

exports.postAddComment = (req, res) => {
    const text = req.body.comment.text;  
    Product.findByPk(req.params.pid)
        .then(prod => {
            Comment.create({
                text: text,
                fk_userid: req.user.id,
                fk_prodid: req.params.pid
            }, {
                include: [association.CommentBelongsToUser, association.CommentBelongsToProduct]
            }).then(() => {
                res.redirect("/products/" + prod.pid);
            }).catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.getEditComment = (req, res) => {
    Product.findByPk(req.params.pid)
        .then(prod => {
            Comment.findByPk(req.params.cid)
                .then(comment => {
                    res.render("comments/edit", {
                        prod: prod,
                        comment: comment
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));    
};

exports.putEditComment = (req,res) => {
    const updatedText = req.body.comment.text;
    console.log(req.params.pid);
    Product.findByPk(req.params.pid)
        .then(prod => {
            Comment.findByPk(req.params.cid)
                .then(comment => {
                    comment.text = updatedText;
                    comment.save();
                })
                .then(() => {
                    console.log("Updated Comment Finish!");
                    res.redirect("/products/" + prod.pid);
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));    
};

exports.deleteEditComment = (req, res) => {
    Comment.findByPk(req.params.cid)
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