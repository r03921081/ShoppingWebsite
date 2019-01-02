const express = require("express");
const router = express.Router();

const middleware = require("../util/middleware");
const validator = require("../util/validator");
const productsController = require("../controllers/products");

// Get all products' index.
router.get("/products/", productsController.getProducts);
// Create a new product.
router.post("/products/", [
        validator.checkProductName,
        validator.checkProductPrice,
        validator.checkProductDescription
    ], middleware.isLoggedIn, productsController.postAddProduct);
// Get "create a new product" page.
router.get("/products/new", middleware.isLoggedIn, productsController.getAddProduct);
// Get the specific product.
router.get("/products/:pid", productsController.getUniqueProduct);
// Get "edit the specific product" page.
router.get("/products/:pid/edit", middleware.checkProductOwnership, productsController.getEditProduct);
// Update "edit the specific product".
router.put("/products/:pid", [
        validator.checkProductName,
        validator.checkProductPrice,
        validator.checkProductDescription
    ], middleware.checkProductOwnership, productsController.putEditProduct);
// Destroy the specific product.
router.delete("/products/:pid", middleware.checkProductOwnership, productsController.deleteEditProduct);

// Get Cart page.
router.get("/cart", productsController.getCart);
// Add the specific product into Cart.
router.post("/cart", productsController.postAddProductIntoCart);
// Delete the specific product in Cart.
router.post("/cartDelete", productsController.postDeleteProductFromCart);


// Get Order page.
router.get("/orders", productsController.getOrders);
// Add the specific Cart into Order.
// Write a payment algorithm in postAddCartIntoOrder.
router.post("/orders", productsController.postAddCartIntoOrder);

// Get inovice
router.get("/orders/:oid", middleware.checkOrderOwnership, productsController.getInovice);

exports.routes = router;