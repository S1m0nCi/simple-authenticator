const jwt = require("jsonwebtoken");
require("dotenv").config()

const { Token } = require("./Token.js");

class RefreshToken extends Token {

  constructor(exp, payload) {
    const token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: exp,
      }
    )
    super(token)
  }
}

module.exports = { RefreshToken };
