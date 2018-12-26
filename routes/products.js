const express = require("express");
const router = express.Router();

const middleware = require("../util/middleware");
const productsController = require("../controllers/products");

// Get all products' index.
router.get("/", productsController.getProducts);
// Create a new product.
router.post("/", middleware.isLoggedIn, productsController.postAddProduct);
// Get "create a new product" page.
router.get("/new", middleware.isLoggedIn, productsController.getAddProduct);
// Get the specific product.
router.get("/:pid", productsController.getUniqueProduct);
// Get "edit the specific product" page.
router.get("/:pid/edit", middleware.checkProductOwnership, productsController.getEditProduct);
// Update "edit the specific product".
router.put("/:pid", middleware.checkProductOwnership, productsController.putEditProduct);
// Destroy the specific product.
router.delete("/:pid", middleware.checkProductOwnership, productsController.deleteEditProduct);

exports.routes = router;