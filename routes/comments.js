const express = require("express");
const router = express.Router();

const middleware = require("../util/middleware");
const commentsController = require("../controllers/comments");

// Get "create a new comment" page.
router.get("/:pid/comments/new", middleware.isLoggedIn, commentsController.getAddComment);
// Create a new comment.
router.post("/:pid/comments/", middleware.isLoggedIn, commentsController.postAddComment);
// Get "edit the specific comment" page.
router.get("/:pid/comments/:cid/edit", middleware.checkCommentOwnership, commentsController.getEditComment);
// Update "edit the specific comment".
router.put("/:pid/comments/:cid", middleware.checkCommentOwnership, commentsController.putEditComment);
// Destroy the specific comment.
router.delete("/:pid/comments/:cid", middleware.checkCommentOwnership, commentsController.deleteEditComment);

exports.routes = router;