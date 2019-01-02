const express = require("express");
const router = express.Router();

const middleware = require("../util/middleware");
const validator = require("../util/validator");
const commentsController = require("../controllers/comments");

// Get "create a new comment" page.
router.get("/products/:pid/comments/new", middleware.isLoggedIn, commentsController.getAddComment);
// Save a new comment.
router.post("/products/:pid/comments/", [
        validator.checkCommentText
    ], middleware.isLoggedIn, commentsController.postAddComment);
// Get "edit the specific comment" page.
router.get("/products/:pid/comments/:cid/edit", middleware.checkCommentOwnership, commentsController.getEditComment);
// Update "edit the specific comment".
router.put("/products/:pid/comments/:cid", middleware.checkCommentOwnership, commentsController.putEditComment);
// Destroy the specific comment.
router.delete("/products/:pid/comments/:cid", middleware.checkCommentOwnership, commentsController.deleteEditComment);

exports.routes = router;