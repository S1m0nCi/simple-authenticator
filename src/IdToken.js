const jwt = require("jsonwebtoken");

const Token = require("./Token.js");


class IdToken extends Token {

  constructor(username, exp) {
    const token = jwt.sign(
      {
        "typ":"id",
        "username": username,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: exp,
      }
    )
    this.username = username
    super(token)
  }
 
}

module.exports = { IdToken };
