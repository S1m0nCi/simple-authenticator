const { verify } = require("jsonwebtoken");

class Token {  
  constructor(token) {
    this.token = token;
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

module.exports = { Token };

