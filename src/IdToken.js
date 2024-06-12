import jwt from "jsonwebtoken";
import 'dotenv/config';

import Token from "./Token.js";


export default class IdToken extends Token {

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

//module.exports = { IdToken };
