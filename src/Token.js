const { verify } = require("jsonwebtoken");

class Token {  
  constructor(token, userBase) {
    this.token = token;
    this.userBase = userBase;
  }

  getToken() {
    return this.token;
  }

  verifyToken() {
    return verify(this.token, process.env.SECRET_KEY, (err, result) => {
      if (err) {
        return false;
      } 
      return true;      
    })
  }
}

module.exports = { Token };

