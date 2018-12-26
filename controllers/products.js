const Product = require("../models/product");
// const Comment = require("../models/comment");

const association = require("../util/association");
// const Sequelize = require("sequelize");
const sequelize = require("../util/database");

exports.getProducts = (req, res) => {
    console.log("Products");
    Product.findAll()
    .then(prod => {
        res.render("products/", {
            prod: prod
        });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getAddProduct = (req, res) => {
    res.render("products/new");
};

exports.postAddProduct = (req, res) => {
    const name = req.body.product.name;
    const type = req.body.product.type;
    const image = req.body.product.image;    

    Product.create({
        name: name,
        type: type,
        image: image,
        fk_userid : req.user.id
    }, {
        include: [association.ProductBelongsToUser]
    })
    .then(prod => {
        console.log("Create " + prod.name);
        res.redirect("products/");
    })
    .catch(err => {
        console.log(err);
    });    
};

exports.getUniqueProduct = (req, res) => {
    Product.findByPk(req.params.pid)
    .then(prod => {
        sequelize.query(
            "SELECT c.cid, c.text, c.createdAt, u.id, u.username \
            FROM comments c, users u \
            WHERE c.fk_userid = u.id \
            AND c.fk_prodid = :prodId \
            ORDER BY c.createdAt",{
            replacements: {
                prodId: req.params.pid,
                type: sequelize.QueryTypes.SELECT
            }
        }).then(comment => {
            res.render("products/show", {
                prod: prod,
                comment: comment[0]
            });
        }).catch();        
    }).catch(err => console.log(err));
};

exports.getEditProduct = (req, res) => {
    Product.findByPk(req.params.pid)
    .then(prod => {
        console.log("Edit " + prod.pid);
        res.render("products/edit", {
            prod: prod
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.putEditProduct = (req, res) => {
    const updatedName = req.body.product.name;
    const updatedType = req.body.product.type;
    const updatedImage = req.body.product.image;

    Product.findByPk(req.params.pid)
    .then(prod => {
        prod.name = updatedName;
        prod.type = updatedType;
        prod.Image = updatedImage;       
        return prod.save();        
    })
    .then(() => {
        console.log("Updated Product Finish!");
        res.redirect("/products/" + req.params.pid);
    })
    .catch(err => {
        console.log(err);
    });
};

exports.deleteEditProduct = (req, res) => {
    Product.findByPk(req.params.pid)
    .then(prod => {
        return prod.destroy();
    })
    .then(() => {
        console.log("Delete Product Finish!");
        res.redirect("/products");
    })
    .catch(err => {
        console.log(err);
    });
};