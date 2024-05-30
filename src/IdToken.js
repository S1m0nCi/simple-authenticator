import jwt from "jsonwebtoken"

import Token from "./Token.js"


class IdToken extends Token {
  
  constructor() {
    super("id")
    this.value = jwt.sign({"username": username}, process.env.SECRET_KEY)

  }
}