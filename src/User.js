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

const UserBase = require("UserBase.js");
const AccessToken = require("AccessToken.js");
const IdToken = require("IdToken.js");
const RefreshToken = require("RefreshToken.js");

class User {

  constructor(username, userBase) {
    this.username = username; 
    this.userBase = userBase;
  }

  getUsername() {
    return this.username;
  }
  
  async signUp(password) {
    this.password = hash(password);
    await this.setUserTokens();
    // store user and password in a database. How do we or the user do this?
    // for now, we can use an object or a file: just to ensure that everything works.
    this.userBase.addUser(this.username, this.password);
  }

  // will need jwt tokens
  changeUsername(newUsername) {
    this.username = newUsername;
  }

  // may not work because user is allowed to set the username and the password
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
          return err;
        } 
        return result;
      })
    } else {
      callback("user does not exist", null)
    }
  }
 
  async forgotPassword(oldPassword, newPassword, callback) {
    const authenticated = await verify(this.password, oldPassword);
    if (authenticated) {
      this.password = hash(newPassword);
      callback(null, "Password reset successfully");
    } else {
      callback(new Error("Invalid password"), null);
    }
  }


  // create a function to store user tokens, may be static
  async setUserTokens() {
    this.userTokens = {
      access: await AccessToken(this.userBase.settings.access_exp),
      id: await IdToken(this.username, this.userBase.settings.id_exp),
      refresh: await RefreshToken(this.userBase.setting.refresh_exp)
    };
  }
  
  async refreshUserTokens(userRefreshToken) {
    this.userTokens = {
      access: await AccessToken(this.userBase.settings.access_exp),
      id: await IdToken(this.username, this.userBase.settings.id_exp),
      refresh: userRefreshToken
    }
  }

  // create a function to check all jwt tokens
  // we will need to store the user tokens though: a session, in the user class
  async authenticateUserTokens() {
    // first check access and id tokens
    if (this.userTokens.access.verify() && this.userTokens.access.verify()) {
      return true;
    } else {
      if (this.userTokens.refresh.verify()) {
        // refresh the tokens
        this.refreshUserTokens(this.userTokens.refresh);
        return true;
      } else {
        return false;
        // then the user will have to be re-authenticated with a password flow
      }
    }
  }
  

  
}

export default User;
