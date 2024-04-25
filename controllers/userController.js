const { checkPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { User } = require("../models");

class UserController {
  static async registerUser(req, res, next) {
    try {
      // console.log(req.body);
      let user = await User.create(req.body);
      let { id, email } = user;
      res.status(201).json({ id, email, message: "Registered successfully" });
    } catch (error) {
      // console.log(error);
      next(error);
    }
  }

  static async loginUser(req, res, next) {
    try {
      let { email, password } = req.body;
      if (!email || !password) {
        throw { name: "InvalidInput" };
      }

      let user = await User.findOne({ where: { email } });
      if (!user) {
        throw { name: "InvalidUser" };
      }

      let comparePassword = checkPassword(password, user.password);
      if (!comparePassword) {
        throw { name: "InvalidUser" };
      }

      let access_token = generateToken({
        id: user.id,
      });

      res.status(200).json({ access_token, email });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = UserController;
