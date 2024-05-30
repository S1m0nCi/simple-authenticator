import jwt from "jsonwebtoken";

import Token from "./Token"

class AccessToken extends Token {
  constructor() {
    super("access")
    this.value = jwt.sign(secretOrPrivateKey = process.env.SECRET_KEY)
  }

  getToken() {
    return this.token;
  }

}