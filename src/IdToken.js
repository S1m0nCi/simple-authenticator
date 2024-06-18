const jwt = require("jsonwebtoken");
require("dotenv").config()

const { Token } = require("./Token.js");

class IdToken extends Token {

  constructor(exp, payload) {
    const token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: exp,
      }
    );
    super(token);
    this.username = payload.username;
  }
}

module.exports = { IdToken };
