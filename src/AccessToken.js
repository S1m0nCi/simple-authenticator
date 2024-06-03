const jwt = require("jsonwebtoken");
require("dotenv").config()

const { Token } = require("./Token")

class AccessToken extends Token {
  constructor(exp) {
    const token = jwt.sign(
      {
        "typ": "access"
      },
      process.env.SECRET_KEY,
      {
        expiresIn: exp 
      }
    )
    super(token)
  }
}

module.exports = { AccessToken }