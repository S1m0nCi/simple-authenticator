//const { test, expect } = require("jest");

const { UserBase } =  require("../src/UserBase.js");

// first trial test: 
test("Default Userbase should be created", () => {
  const userBase = new UserBase();
  const defaultSettings = {
    email: false,
    mobile: false,
    access_exp: "1h",
    id_exp: "1h",
    refresh_exp: "30d"
  }
  expect(userBase.settings)
  expect(userBase.users)
})

