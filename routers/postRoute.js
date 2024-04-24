const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();

router.post("/create", postController.createPost);
router.get("/getPost", postController.getAllPosts)
router.get("/getOne/:PostId", postController.getPostById)
router.put("/update-sold/:postId", postController.updatePostStatus)
router.get("/delete/:UserId" , postController.deletePost)


module.exports = router;
