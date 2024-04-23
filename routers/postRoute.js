const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();

router.post("/create", postController.createPost);
router.get("/getPost", postController.getAllPosts)
router.patch("/update-sold/:postId", postController.updatePostStatus)

// router.post("/login", UserController.loginUser);

module.exports = router;
