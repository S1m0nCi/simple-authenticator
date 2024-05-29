import jwt from "jsonwebtoken";

import Token from "./Token"

class AccessToken extends Token {
  constructor(value) {
    
  }

  getToken() {
    return this.token;
  }

  verifyToken() {}
}