const express = require("express");
const router = express.Router();

const middleware = require("../util/middleware");
const commentsController = require("../controllers/comments");

// Get "create a new comment" page.
router.get("/products/:pid/comments/new", middleware.isLoggedIn, commentsController.getAddComment);
// Save a new comment.
router.post("/products/:pid/comments/", middleware.isLoggedIn, commentsController.postAddComment);
// Get "edit the specific comment" page.
router.get("/products/:pid/comments/:cid/edit", commentsController.getEditComment);
// Update "edit the specific comment".
router.put("/products/:pid/comments/:cid", commentsController.putEditComment);
// Destroy the specific comment.
router.delete("/products/:pid/comments/:cid", commentsController.deleteEditComment);

exports.routes = router;