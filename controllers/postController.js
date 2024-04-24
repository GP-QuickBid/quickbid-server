const { Post } = require("../models");

class postController {
  // Static method to create a new post
  static async createPost(req, res, next) {
    try {
      const { title, description, imageUrl, price } = req.body;

      const post = await Post.create({
        title,
        description,
        imageUrl,
        price,
        UserId: req.user.id,
      });

      res.status(201).json(post);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  // Static method to get all posts
  static async getAllPosts(req, res, next) {
    try {
      const post = await Post.findAll();

      res.status(200).json(post);
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  // Static method to get a post by id
  static async getPostById(req, res, next) {
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id);
      if (!post) throw { name: "NotFound" };

      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  // Static method to update a post by id
  static async updatePostStatus(req, res, next) {
    try {
      const { id } = req.params;

      const post = await Post.findByPk(id);

      if (!post) throw { name: "NotFound" };

      await post.update({ status: "sold" });

      // Kirim notifikasi ke semua klien bahwa status post telah diperbarui
      // io.emit('postStatusUpdated', { postId, status: "sold" });

      res
        .status(200)
        .json({ message: "Status has been updated to SOLD.", post });
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  // Static method to delete a post by id
  static async deletePost(req, res, next) {
    try {
      const { id } = req.params;

      const post = await Post.findOne({ where: { id } });
      if (!post) throw { name: "NotFound" };

      await post.destroy({ where: { id: req.params.id } });

      res.status(200).json({ message: `${post.title} success to delete` });
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }
}

module.exports = postController;
