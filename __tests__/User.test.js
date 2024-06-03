const { randomBytes } = require("crypto");
const { verify } = require("argon2")

const { User } = require("../src/User.js");
const { UserBase } = require("../src/UserBase.js");
// we will only use the users.json file in our tests to imitate the user's use of a database or similar

test("User created", () => {
  const userBase = new UserBase();
  const username = "user2";
  const user = new User(username, userBase);
  expect(user);
})

test("Sign up a user", async () => {
  const userBase = new UserBase();
  const username = "user3"
  const user = new User(username, userBase);
  const testPassword = randomBytes(8).toString("hex");
  await user.signUp(testPassword);
  expect(user);
  expect(userBase.users[username]);
  console.log(userBase.getUsers());
  expect(await verify(userBase.getUsers()[username].password, testPassword)).toBe(true);
})