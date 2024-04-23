const jwt = require("jsonwebtoken");
const secret = "SECRETOS";

const generateToken = (payload) => {
  let token = jwt.sign(payload, secret);
  return token;
};

const verifyToken = (token) => {
  let verify = jwt.verify(token, secret);
  return verify;
};

module.exports = { generateToken, verifyToken };
