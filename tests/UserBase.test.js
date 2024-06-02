const { test, expect } = require("jest");

const UserBase =  require("../src/UserBase.js");

test("Default Userbase should be created", () => {
  const userBase = UserBase();
  const defaultSettings = {
    email: false,
    mobile: false,
    access_exp: "1h",
    id_exp: "1h",
    refresh_exp: "30d"
  }
  expect(userBase.settings).toBe(defaultSettings)
  expect(userBase.users).toBe({})
})

