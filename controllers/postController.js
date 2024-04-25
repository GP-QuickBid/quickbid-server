const io = require("../app");
const { Post, User } = require("../models");

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
      // const posts = await Post.findAll();
      const posts = await Post.findAll({
        include: {
          model: User, // Menyertakan model User
          attributes: ["id", "fullName", "email"],
        },
      });

      res.status(200).json(posts);
    } catch (error) {
      console.log(error);
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

      if (!post) throw { name: "Not Found" };

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
      if (!post) throw { name: "Not Found" };

      await post.destroy({ where: { id: req.params.id } });

      res.status(200).json({ message: `${post.title} success to delete` });
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async updatePostPrice(req, res, next) {
    try {
      const { postId } = req.params;
      const increment = 100000;
      const post = await Post.findByPk(postId);

      if (!post) throw { name: "NotFound" };

      // Tambahkan nilai increment ke kolom price menggunakan metode increment dari Sequelize
      await post.increment("price", { by: increment });

      res.status(200).json({ message: "Bid successfully placed." });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = postController;
