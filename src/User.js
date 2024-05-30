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

class User {

  constructor(username) {
    this.username = username; 
  }

  getUsername() {
    return this.username;
  }
  
  signUp(password) {
    this.password = hash(password);
    // store user in a database
  }

  // will need jwt tokens
  changeUsername(username) {
    this.username = username;
  }

  // may not work because user is allowed to set the username
  async authenticateUser(username, password, callback) {
    if (username == this.username) {
      const authenticated = await verify(this.password, password)
    if (authenticated) {
      callback(null, {username: this.username})
    } else {
      callback(new Error("Invalid password"), null)
    }
    }
  }

  async changePassword(oldPassword, newPassword, callback) {
    const authenticated = await verify(this.password, oldPassword)
    if (authenticated) {
      this.password = hash(newPassword)
      callback(null)
    } else {
      callback(new Error("Invalid password"))
    }
  }
  

  
}
