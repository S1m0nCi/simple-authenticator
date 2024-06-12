import verify from "jsonwebtoken";

export default class Token {  
  constructor(token, userBase) {
    this.token = token;
    this.userBase = userBase;
  }

  getToken() {
    return this.token;
  }

  verifyToken() {
    try {
      verify(this.token, process.env.SECRET_KEY);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}

//module.exports = { Token };

