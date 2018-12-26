const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products");

router.get("/", productsController.getProducts);
router.post("/", productsController.postAddProduct);
router.get("/new", productsController.getAddProduct);
router.get("/:pid", productsController.getUniqueProduct);
router.get("/:pid/edit", productsController.getEditProduct);
router.put("/:pid", productsController.putEditProduct);
router.delete("/:pid", productsController.deleteEditProduct);

exports.routes = router;