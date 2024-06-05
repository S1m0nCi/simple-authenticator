const { hash, verify } = require('argon2');
const { randomBytes } = require('crypto')

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
  expect(userBase.settings);
  expect(userBase.users);
})

test("User should be added", async () => {
  const userBase = new UserBase();
  const username = "user1";
  const testPassword = randomBytes(8).toString("hex");
  const hashedPassword = await hash(testPassword);
  try {
    userBase.addUser(username, hashedPassword);
  } catch (error) {
    return error; 
  }
  expect(userBase.users[username]);
  expect(await verify(userBase.getUsers()[username].password, testPassword)).toBe(true);
})
