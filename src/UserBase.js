// configures the settings for the user
/* 
Sets the secretKey for jwt, for instance: no, we will only have one secret key.
We would like this to behave similarly to a javascript struct
it would be best to use an object

email
mobile
accessexp
idexp
refreshexp
*/

const { randomBytes } = require("crypto");

class UserBase {

  // email, mobile can be put into userData or optionalUserData. In fact, anything can be added to these.
  static defaultSettings = {
    expiry: {
      access: "1h",
      id: "1h",
      refresh: "30d"
    },
    userData: ["username", "password"],
    optionalUserData: [],
    payload: {
      access: {
        "typ": "access"
      },
      id: {
        "typ": "id"
      },
      refresh: {
        "typ": "refresh"
      }
    }
  }
  // we can add username to id payload when we create the token.

  // configure authentication settings
  constructor(settings=UserBase.defaultSettings, users={}) {
    // some input validation may be needed
    this.settings = settings;
    this.users = users;
  }

  getUsers() {
    return this.users;
  }

  setUsers(userObj) {
    this.users = userObj;
  }

  addUser(username, hashedPassword) {
    if (!(username in this.users)) {
      this.users[username] = { password: hashedPassword };
      return "User added";
    } else {
      throw new Error("username not available");
    }
  }

  changeUser(username, hashedPassword) {
    if (username in this.users) {
      this.users[username] = { password: hashedPassword };
      return "User details changed"
    } else {
      throw new Error("User does not exist");
    }
  }
}

module.exports = { UserBase };

