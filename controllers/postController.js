const { Post } = require('../models');
const { io } = require('../app')

class postController {
    // Static method to create a new post
    static async createPost(req, res, next) {
        try {
            const { title, description, imageUrl, price, UserId } = req.body

            const post = await Post.create({ title, description, imageUrl, price, UserId });


            // Kirim notifikasi ke semua klien bahwa post baru telah dibuat
            // io.emit('newPost', { post });

            res.status(200).json({ message: "Success add!!", post })
        } catch (error) {
            console.log(error);
            // res.send(error)
            next(error)
        }
    }

    // Static method to get all posts
    static async getAllPosts(req, res, next) {
        try {
            const post = await Post.findAll();
            // return posts;

            // Kirim data post ke klien melalui socket
            // io.emit('allPosts', { post });

            res.status(200).json({ post })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    // Static method to get a post by id
    static async getPostById(req, res, next) {
        try {
            const post = await Post.findByPk();
            if (!post) {
                throw new Error("Post not found");
            }
            return post;
        } catch (error) {
            throw new Error("Failed to get post: " + error.message);
        }
    }

    // Static method to update a post by id
    static async updatePostStatus(req, res, next) {
        try {
            const { postId } = req.params

            const post = await Post.findByPk(postId);

            if (!post) throw { name: 'post is undefined' }

            await post.update({ status: "sold" });

            // Kirim notifikasi ke semua klien bahwa status post telah diperbarui
            // io.emit('postStatusUpdated', { postId, status: "sold" });

            res.status(200).json({ message: 'Status has been updated to "sold".', post })
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    // Static method to delete a post by id
    /*
    static async deletePost(req, res, next) {
        try {
            const post = await Post.findByPk();
            if (!post) {
                throw new Error("Post not found");
            }
            await post.destroy();
            return { message: "Post deleted successfully" };
        } catch (error) {
            throw new Error("Failed to delete post: " + error.message);
        }
    }
    */
};

module.exports = postController;
