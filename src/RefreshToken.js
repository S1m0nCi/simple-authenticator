import jwt from "jsonwebtoken";
import 'dotenv/config';

import Token from "./Token.js";

export default class RefreshToken extends Token {

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

// module.exports = { RefreshToken };
