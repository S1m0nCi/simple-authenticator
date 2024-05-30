import jwt from "jsonwebtoken"

import Token from "./Token.js"

class RefreshToken extends Token {
  constructor() {
    super("refresh")
    this.value = jwt.sign({"username": username}, process.env.SECRET_KEY)
  }
}