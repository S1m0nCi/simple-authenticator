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
    this.users = users
  }

  addUser(username, hashedPassword) {
    this.users.username = {password: hashedPassword}
  }


}

module.exports = { UserBase };

