import jwt from "jsonwebtoken";
import 'dotenv/config';

import Token from "./Token";

export default class AccessToken extends Token {
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

// module.exports = { AccessToken }