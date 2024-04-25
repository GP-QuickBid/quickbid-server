const express = require("express");
const postController = require("../controllers/postController");
const authentication = require("../middlewares/authenticate");
const { authorization } = require("../middlewares/authorize");
const router = express.Router();

router.post("/", authentication, postController.createPost);
router.get("/",  postController.getAllPosts);
router.get("/:id", authentication, postController.getPostById);
router.post("/:postId", authentication, postController.updatePostPrice);

router.put(
  "/:id",
  authentication,
  authorization,
  postController.updatePostStatus
);

router.post("/:postId", postController.updatePostPrice);

router.delete("/:id", authentication, authorization, postController.deletePost);



module.exports = router;
