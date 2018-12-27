const Product = require("../models/product");

exports.getProducts = (req, res) => {
    Product.findAll()
        .then(prods => {
            res.render("products/", {
                prod: prods
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

    req.user.createProduct({
        name: name,
        type: type,
        image: image
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
        .catch(err => console.log(err));
};

exports.getEditProduct = (req, res) => {

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
            prod: prod
        });
    })
    .catch(err => console.log(err));

    // Product.findByPk(req.params.pid)
    // .then(prod => {
    //     console.log("Edit " + prod.pid);
    //     res.render("products/edit", {
    //         prod: prod
    //     });
    // }).catch(err => {
    //     console.log(err);
    // });
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
    .catch(err => console.log(err));
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
    .catch(err => console.log(err));
};

exports.getCart = (req, res) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(prods => {
                    res.render("products/cart", {
                        prod: prods
                    });
                })
                .catch(err => console.log(err));
        }).catch(err => console.log(err));
};

exports.postAddProductIntoCart = (req,res) => {
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
            res.redirect("/cart");
        })
        .catch(err => console.log(err));
};

exports.postDeleteProductFromCart = (req, res) => {
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
            res.redirect("/cart");
        })
        .catch(err => console.log(err));
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
        .catch(err => console.log(err));
    }    
};

exports.getOrders = (req, res) => {
    req.user.getOrders({
            include: ["products"]
        })
        .then(orders => {
            console.log(orders);
            res.render("products/orders", {
                orders: orders
            });
        })
        .catch(err => console.log(err));
};

exports.postAddCartIntoOrder = (req, res) => {
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
                        return order.addProducts(products.map(prod => {
                            prod.orderItem = {quantity: prod.cartItem.quantity};
                            return prod;
                        }));
                    })
                    .catch(err => console.log(err));
        })
        .then(() => {
            return myCart.setProducts(null);
        })
        .then(() => {
            res.redirect("/orders");
        })
        .catch(err => console.log(err));
};