/* Contains the User class 
Features: 
  - Constructor to initialize the User object with username and password
  - Getter and Setter methods for the username and password
  - Method to check if the password is valid
  - Method to check if the username is valid
*/

// need to implement a database
// for now, leave the database implementation to the library user

const { hash, verify } =  require("argon2");

const { UserBase } = require("./UserBase.js");
const { AccessToken } = require("./AccessToken.js");
const { IdToken } = require("./IdToken.js");
const { RefreshToken } = require("./RefreshToken.js");

class User {

  constructor(username, userBase) {
    this.username = username; 
    this.userBase = userBase;
  }

  getUsername() {
    return this.username;
  }
  
  async signUp(password) {
    this.password = await hash(password);
    await this.setUserTokens();
    // store user and password in a database. How do we or the user do this?
    // for now, we can use an object or a file: just to ensure that everything works.
    this.userBase.addUser(this.username, this.password, (err, result) => {
      if (err) {
        return err;
      } else {
        return result;
      }
    });
  }

  async changeUsername(newUsername, callback) {
    const authorised = await this.authenticateUserTokens((err, result) => {
      if (err) {
        return err
      }
    });
    if (authorised) {
      this.username = newUsername;
      callback(null, "username changed successfully");
    } else {
      callback("user not authorised", null)
    }
  }

  async authenticateUser(username, password, callback) {
    const authenticated = await verify(this.userBase.users[username].password, password)
    if (authenticated) {
      // generate and store jwt tokens in this class
      // we need an object will all three user tokens
      await this.setUserTokens()
      callback(null, this.username)
    } else {
      callback(new Error("Invalid password"), null)
    } 
  }
  // do we return the callback or not? no, we should just need to call it: it is the user's job to define the callback function to return or not.

  // create a sign in function that calls authenticate user, for dev ease and to look more deeply at databases
  async signIn(username, password, callback) {
    if (username in this.userBase.users) {
      return await this.authenticateUser(username, password, (err, result) => {
        if (err) {
          callback(err, null);
        } 
        callback(null, "user signed in");
      })
    } else {
      callback("user does not exist", null)
    }
  }
 
  async forgotPassword(oldPassword, newPassword, callback) {
    const authenticated = await verify(this.password, oldPassword);
    if (authenticated) {
      this.password = await hash(newPassword);
      callback(null, "Password reset successfully");
    } else {
      callback(new Error("Invalid password"), null);
    }
  }

  async changePassword(oldPassword, newPassword, callback) {
    const authorised = await this.authenticateUserTokens((err, result) => {
      if (err) {
        return err;
      }
    });
    if (authorised) {
      authenticated = verify(this.password, oldPassword);
      if (authenticated) {
        this.password = newPassword;
        callback(null, "password changed successfully");
      } else {
        callback("password incorrect", null);
      }
    } else {
      callback("user not signed in", null);
    }
  }

  // create a function to store user tokens, may be static
  async setUserTokens() {
    this.userTokens = {
      access: new AccessToken(this.userBase.settings.access_exp),
      id: new IdToken(this.username, this.userBase.settings.id_exp),
      refresh: new RefreshToken(this.userBase.settings.refresh_exp)
    };
  }
  
  // INTERNAL USE ONLY
  async refreshUserTokens(userRefreshToken) {
    this.userTokens = {
      access: new AccessToken(this.userBase.settings.access_exp),
      id: new IdToken(this.username, this.userBase.settings.id_exp),
      refresh: userRefreshToken
    }
  }

  // create a function to check all jwt tokens
  // we will need to store the user tokens though: a session, in the user class
  async authenticateUserTokens(callback) {
    // first check access and id tokens
    if (this.userTokens.access.verifyToken() && this.userTokens.access.verifyToken()) {
      callback(null, "short-lived tokens valid");
    } else {
      if (this.userTokens.refresh.verifyToken()) {
        // refresh the tokens
        this.refreshUserTokens(this.userTokens.refresh);
        callback(null, "tokens refreshed");
      } else {
        callback("tokens invalid", null);
        // then the user will have to be re-authenticated with a password flow
      }
    }
  }
}

module.exports = { User };
