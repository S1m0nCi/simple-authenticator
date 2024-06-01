/* Contains the User class 
Features: 
  - Constructor to initialize the User object with username and password
  - Getter and Setter methods for the username and password
  - Method to check if the password is valid
  - Method to check if the username is valid
*/

// need to implement a database
// for now, leave the database implementation to the library user

import { hash, verify } from "argon2";

import UserBase from "UserBase.js";
import AccessToken from "AccessToken.js";
import IdToken from "IdToken.js";
import RefreshToken from "RefreshToken.js";

class User {

  constructor(username, userBase) {
    this.username = username; 
    this.userBase = userBase;
  }

  getUsername() {
    return this.username;
  }
  
  signUp(password) {
    this.password = hash(password);
    // store user in a database
  }

  // will need jwt tokens
  changeUsername(newUsername) {
    this.username = newUsername;
  }

  // may not work because user is allowed to set the username
  async authenticateUser(password, callback) {
    const authenticated = await verify(this.password, password)
    if (authenticated) {
      // generate and store jwt tokens in this class
      // we need an object will all three user tokens
      await this.setUserTokens()
      callback(null, this.username)
    } else {
      callback(new Error("Invalid password"), null)
    } 
  }

  async forgotPassword(oldPassword, newPassword, callback) {
    const authenticated = await verify(this.password, oldPassword)
    if (authenticated) {
      this.password = hash(newPassword)
      callback(null, "Password reset successfully")
    } else {
      callback(new Error("Invalid password"), null)
    }
  }


  // create a function to store user tokens, may be static
  async setUserTokens() {
    this.userTokens = {
      access: await AccessToken(this.userBase.settings.access_exp),
      id: await IdToken(this.username, this.userBase.settings.id_exp),
      refresh: await RefreshToken(this.userBase.setting.refresh_exp)
    }
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
