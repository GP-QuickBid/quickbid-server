const { Post, User } = require("../models");

const authorization = async (req, res, next) => {
  try {
    let user = await User.findByPk(req.user.id);
    // console.log(user.id)
    let post = await Post.findByPk(req.params.id);
    // console.log(post.UserId)
    if (!post) {
      throw { name: "NotFound" };
    }

    if (user.id !== post.UserId) {
      throw { name: "Forbidden" };
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authorization };
