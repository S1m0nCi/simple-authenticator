const jwt = require("jsonwebtoken");
require("dotenv").config()

const { Token } = require("./Token")

class AccessToken extends Token {
  
  constructor(exp, payload) {
    const token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: exp 
      }
    )
    super(token)
  }
}

module.exports = { AccessToken }