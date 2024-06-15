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
    try {
      this.password = await hash(password);
      await this.setUserTokens();
      this.userBase.addUser(this.username, this.password);
    } catch (error) {
      throw new Error(error);
    }
    // for now, we can use an object or a file: just to ensure that everything works.
    // leaving the addUser function as synchronous for now
  }
  
  // we will need to check if the username is taken or not
  async changeUsername(newUsername) {
    try {
      await this.authenticateUserTokens();
      // change username in userBase.users object also
      if (!(newUsername in this.userBase.users)) {
        delete this.userBase.users[this.username];
        this.username = newUsername;
        this.userBase.addUser(this.username, this.password);
        return "username changed successfully";
      } else {
        throw new Error("username already taken");
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async authenticateUser(username, password) {
    try {
      await verify(this.userBase.users[username].password, password);
        // generate and store jwt tokens in this class
        // we need an object will all three user tokens
      await this.setUserTokens();
      return this.getUserTokens();
    } catch (error) {
      throw new Error(error);
    } 
  }
  // do we return the callback or not? no, we should just need to call it: it is the user's job to define the callback function to return or not.

  // create a sign in function that calls authenticate user, for dev ease and to look more deeply at databases
  async signIn(username, password) {
    if (username in this.userBase.users) {
      try {
        return await this.authenticateUser(username, password);
      } catch (error) {
        throw new Error(error);
      }
    } else {
      throw new Error("user does not exist");
    }
  }
 
  async forgotPassword(oldPassword, newPassword) {
    try {
      await verify(this.password, oldPassword);
      this.password = await hash(newPassword);
      // change password in userBase.users object also
      this.userBase.changeUser(this.username, this.password);
      return "Password reset successfully";
    } catch (error) {
      throw new Error(error);
    }
  }

  async changePassword(oldPassword, newPassword) {
    try {
      await this.authenticateUserTokens();
      await verify(this.password, oldPassword);
      this.password = await hash(newPassword);
      // change password in userBase.users object also
      this.userBase.changeUser(this.username, this.password);
      return "Password changed successfully";
    } catch (error) {
      throw new Error(error);
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

  getUserTokens() {
    return this.userTokens;
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
  async authenticateUserTokens() {
    // first check access and id tokens
    try {
      this.userTokens.access.verifyToken();
      this.userTokens.id.verifyToken();
      return "short-lived tokens valid";
    } catch (error) {
      try {
        this.userTokens.refresh.verifyToken(); 
        await this.refreshUserTokens(this.userTokens.refresh);
        return "tokens refreshed";
      } catch (error) {
        throw new Error(error);
      }
    }
  }

  // Sign Out Function:
}

module.exports = { User };
