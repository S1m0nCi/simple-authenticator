const jwt = require("jsonwebtoken");
require("dotenv").config()

const { Token } = require("./Token.js");

class RefreshToken extends Token {

  constructor(exp) {
    const token = jwt.sign(
      {
        "typ": "refresh"
      },
      process.env.SECRET_KEY,
      {
        expiresIn: exp,
      }
    )
    super(token)
  }
}

module.exports = { RefreshToken };
