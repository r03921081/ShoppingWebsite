const express = require("express");
const router = express.Router();

const commentsController = require("../controllers/comments");

// router.get("/", commentsController.getComments);
router.post("/:pid/comments/", commentsController.postAddComment);
router.get("/:pid/comments/new", commentsController.getAddComment);
// router.get("/:id", commentsController.getUniqueComment);
router.get("/:pid/comments/:cid/edit", commentsController.getEditComment);
router.put("/:pid/comments/:cid", commentsController.putEditComment);
router.delete("/:pid/comments/:cid", commentsController.deleteEditComment);

exports.routes = router;