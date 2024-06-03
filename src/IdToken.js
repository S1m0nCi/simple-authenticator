const jwt = require("jsonwebtoken");
require("dotenv").config()

const { Token } = require("./Token.js");


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
    );
    super(token);
    this.username = username;
  }
 
}

module.exports = { IdToken };
