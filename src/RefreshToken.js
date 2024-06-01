import jwt from "jsonwebtoken"

import Token from "./Token.js"

class RefreshToken extends Token {

  constructor(exp) {
    const token = jwt.sign(
      {
        "typ": "refresh"
      },
      secretOrPrivateKey=process.env.SECRET_KEY,
      {
        expiresIn: exp,
      }
    )
    super(token)
  }
}