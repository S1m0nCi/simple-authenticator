// configures the settings for the user
/* 
We would like this to behave similarly to a javascript struct
it would be best to use an object

email
mobile
accessexp
idexp
refreshexp
*/

import { randomBytes } from "crypto";

export default class UserBase {

  static defaultSettings = {
    email: false,
    mobile: false,
    access_exp: "1h",
    id_exp: "1h",
    refresh_exp: "30d"
  }

  // configure authentication settings
  constructor(settings=UserBase.defaultSettings, users={}) {
    this.settings = settings;
    this.users = users;
    // maybe we should generate a secret here that does not need to be added to a .env file or anything: issue is that the secret

  }

  getUsers() {
    return this.users;
  }

  setUsers(userObj) {
    this.users = userObj;
  }

  addUser(username, hashedPassword) {
    if (!(username in this.users)) {
      this.users[username] = {password: hashedPassword};
      return "User Added successfully"
    } else {
      throw new Error("username not available");
    }
  }
}

// module.exports = { UserBase };

