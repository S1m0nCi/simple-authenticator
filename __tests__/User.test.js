const { User } = require("../src/User.js");
const { UserBase } = require("../src/UserBase.js")
// we will only use the users.json file in our tests to imitate the user's use of a database or similar
test("User created", () => {
  const userBase = new UserBase();
  const username = "first_user";
  const user = new User(username, userBase);
  expect(user);
})