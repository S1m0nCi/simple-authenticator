import jwt from "jsonwebtoken";

import Token from "./Token"

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

  getToken() {
    return this.token;
  }

}