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

            // Kirim data post ke klien melalui socket
            // io.emit('allPosts', { post });

            res.status(200).json({ post })
        } catch (error) {
            // console.log(error);
            // res.send(error)
            next(error)
        }
    }

    // Static method to get a post by id
    static async getPostById(req, res, next) {
        try {
            const { postId } = req.params
            const post = await Post.findByPk(postId);

            if (!post) throw { name: "NotFound" };

            res.status(200).json({ post })
        } catch (error) {
            next(error)
        }
    }

    // Static method to update a post by id
    static async updatePostStatus(req, res, next) {
        try {
            const { postId } = req.params

            const post = await Post.findByPk(postId);

            if (!post) throw { name: "NotFound" };

            await post.update({ status: "sold" });

            // Kirim notifikasi ke semua klien bahwa status post telah diperbarui
            // io.emit('postStatusUpdated', { postId, status: "sold" });

            res.status(200).json({ message: 'Status has been updated to SOLD.', post })
        } catch (error) {
            // console.log(error);
            // res.send(error)
            next(error)
        }
    }


    // Static method to delete a post by id
    // ini belum bisa karna belum buat auth
    static async deletePost(req, res, next) {
        try {
            const { id } = req.user
            const { UserId } = req.params

            const post = await Post.findOne({ where: { UserId } });

            if (!post) throw { name: "NotFound" };

            await post.destroy();

            res.status(200).json({ post })
        } catch (error) {
            // res.send(error)
            // console.log(error);
            next(error)
        }
    }

};

module.exports = postController;
