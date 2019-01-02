const Product = require("../models/product");
const Order = require("../models/order");
const { validationResult } = require("express-validator/check");
const fileHandler = require("../util/fileHandler");
const PDFDocument = require("pdfkit");
const blobStream = require("blob-stream")
const fs = require("fs");

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(prods => {
            res.render("products/", {
                prod: prods
            });
        })
        .catch(err => {
            console.log(error);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getAddProduct = (req, res) => {
    res.render("products/new", {
        product: null,
        validationErrors: []
    });
};

exports.postAddProduct = (req, res, next) => {
    const name = req.body.product.name;
    const type = req.body.product.type;
    const image = req.file;
    const price = req.body.product.price;
    const description = req.body.product.description;
    const validationErrors = validationResult(req);

    if(!image){
        return res.status(422).render("products/new", {
            product: {
                name: name,
                type: type,
                price: price,
                descripiton: description
            },
            validationErrors: [],
            error: "Attached file is not an image."
        });
    }
    const imageURL = image.path;

    if(!validationErrors.isEmpty()){
        return res.status(422).render("products/new", {
            product: {
                name: name,
                type: type,
                price: price,
                descripiton: description
            },
            validationErrors: validationErrors.array(),
            error: validationErrors.array()[0].msg
        });
    }

    req.user.createProduct({
        name: name,
        type: type,
        image: imageURL,
        price: price,
        description: description
    })
    .then(prod => {
        console.log("Create " + prod.name);
        res.redirect("products/");
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getUniqueProduct = (req, res, next) => {
    const productId = req.params.pid;
    let myProd;
    let myComment;

    Product.findByPk(productId)
        .then(prod => {
            myProd = prod;
            console.log(myProd);
            return prod.getUserComments();
        })
        .then(comments => {
            console.log(comments);
            myComment = comments;
            return comments;
        })
        .then(() => {
            res.render("products/show",{
                prod: myProd,
                comment: myComment
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.pid;

    req.user.getProducts({
        where: { 
            pid: prodId 
        } 
    })
    .then(prods => {
        const prod = prods[0];
        if (!prod) {
            return res.redirect("/");
        }
        res.render("products/edit", {
            prod: prod,
            validationErrors: []
        });
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.putEditProduct = (req, res, next) => {
    const productId = req.params.pid;
    const updatedName = req.body.product.name;
    const updatedType = req.body.product.type;
    const updatedImage = req.file;
    const updatedPrice = req.body.product.price;
    const updatedDescription = req.body.product.descripiton;
    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){
        return res.status(422).render("products/edit", {
            prod: {
                name: updatedName,
                type: updatedType,
                price: updatedPrice,
                descripiton: updatedDescription
            },
            validationErrors: validationErrors.array(),
            error: validationErrors.array()[0].msg
        });
    }

    Product.findByPk(productId)
    .then(prod => {
        prod.name = updatedName;
        prod.type = updatedType;
        if(updatedImage){
            fileHandler.deleteFile(prod.image);
            prod.image = updatedImage.path;
        }
        prod.price = updatedPrice;
        prod.descripiton = updatedDescription;
        return prod.save();        
    })
    .then(() => {
        console.log("Updated Product Finish!");
        res.redirect("/products/" + productId);
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.deleteEditProduct = (req, res, next) => {
    const productId = req.params.pid;
    Product.findByPk(productId)
    .then(prod => {
        fileHandler.deleteFile(prod.image);
        return prod.destroy();
    })
    .then(() => {
        console.log("Delete Product Finish!");
        res.redirect("/products");
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(prods => {
                    res.render("products/cart", {
                        prod: prods
                    });
                })
                .catch(err => {
                    console.log(err);
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postAddProductIntoCart = (req,res, next) => {
    console.log(req.body.productId);
    const prodId = req.body.productId;
    let myCart;
    let newQuantity = 1;

    req.user.getCart()
        .then(cart => {
            myCart = cart;
            return cart.getProducts({
                where: {
                    pid: prodId
                }
            });
        })
        .then(prods => {
            let prod;
            if(prods.length > 0){
                prod = prods[0];
            }
            if(prod){
                const oldQuantity = prod.cartItem.quantity;
                newQuantity = oldQuantity+1;
                return prod;
            }
            return Product.findByPk(prodId);
        })
        .then(prod => {
            return myCart.addProduct(prod, {
                through: {quantity: newQuantity}
            });
        })
        .then(() => {
            req.flash("success", "Successfully add the product into your cart.");
            res.redirect("back");
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postDeleteProductFromCart = (req, res, next) => {
    const prodId = req.body.productId;
    const editMode = req.query.edit;

    if(editMode){
        req.user.getCart()
        .then(cart => {
            return cart.getProducts({
                where: {
                    pid: prodId
                }
            });
        })
        .then(prods => {
            const prod = prods[0];
            if(--prod.cartItem.quantity === 0){
                return prod.cartItem.destroy();
            }
            return prod.cartItem.save();
        })
        .then(() => {
            req.flash("success", "Successfully delete the product from your cart.");
            res.redirect("/cart");
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    }
    else{
        req.user.getCart()
        .then(cart => {
            return cart.getProducts({
                where: {
                    pid: prodId
                }
            });
        })
        .then(prods => {
            console.log(prods);
            const prod = prods[0];
            return prod.cartItem.destroy();
        })
        .then(() => {
            res.redirect("/cart");
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    }    
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders({
        order: [["createdAt", "DESC"]],
        include: ["orderItems"]
    })
    .then(orders => {
        res.render("products/orders", {
            orders: orders
        });
    })
    .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.postAddCartIntoOrder = (req, res, next) => {
    let myCart;
    req.user.getCart()
        .then(cart => {
            myCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            console.log(products);
            return req.user.createOrder()
                    .then(order => {
                        products.map(prod => {
                            order.createOrderItem({
                                quantity: prod.cartItem.quantity,
                                productName: prod.name,
                                productType: prod.type,
                                productPrice: prod.price
                            })
                            .catch(err => console.log(err));
                        });
                    })
                    // .then(order => {
                    //     return order.addProducts(products.map(prod => {
                    //         prod.orderItem = {
                    //             quantity: prod.cartItem.quantity,
                    //             productName: prod.name,
                    //             productType: prod.type,
                    //             productPrice: prod.price
                    //         };
                    //         return prod;
                    //     }));
                    // })
                    .catch(err => {
                        console.log(err);
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        return next(error);
                    });
        })
        .then(() => {
            return myCart.setProducts(null);
        })
        .then(() => {
            req.flash("success", "Successfully add the cart into your order.");
            res.redirect("/orders");
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getInovice = (req, res, next) => {
    const orderId = req.params.oid;
    req.user.getOrders({
            where: {
                id: orderId
            },
            include: ["orderItems"]
        })
    // Order.findByPk(orderId, {
    //     includes: ["orderItems"]
    // })
        .then(order => {
            if(!order){
                return next(new Error("Order not found."));
            }
            const doc = new PDFDocument();
            const fileName = "invoice-" + orderId + ".pdf";
            // const filePath = __dirname + "/data" + "/inovice";
            // console.log(filePath);
            res.setHeader("Content-type", "application/pdf");
            res.setHeader("Content-disposition", "attachment; filename=\"" + fileName + "\"");

            let totalPrice = 0;
            const myOrderItems = order[0].dataValues.orderItems;
            doc.font("Times-Roman", 24).text("MyShop inovice", {align: "center"});
            doc.moveDown();
            myOrderItems.forEach(item => {
                totalPrice = totalPrice + item.dataValues.quantity * item.dataValues.productPrice;
                doc.font("Times-Roman", 16).text("Product:    " + item.dataValues.productName);
                doc.font("Times-Roman", 16).text("Quantity:  " + item.dataValues.quantity);
                doc.font("Times-Roman", 16).text("Price:        $" + item.dataValues.productPrice);
                doc.moveDown(0.5);
            });
            doc.moveDown();
            doc.font("Times-Roman", 20).text("Total Price: $" + totalPrice, {align: "right"});
            doc.pipe(res);
            doc.end();
        })
        .catch(err => console.log(err));
};