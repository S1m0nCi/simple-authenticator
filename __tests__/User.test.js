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
  expect(await verify(userBase.getUsers()[username].password, testPassword)).toBe(true);
})

test("Sign in", async () => {
  const userBase = new UserBase();
  const username = "user4"
  const user = new User(username, userBase);
  const testPassword = randomBytes(8).toString("hex");
  try {
    await user.signUp(testPassword);
    var result = await user.signIn(username, testPassword)
  } catch (error) {
    return (error);
  }
  expect(result).toBe(user.getUserTokens());
})

test("Verify tokens and change password", async () => {
  const userBase = new UserBase();
  const username = "user5"
  const user = new User(username, userBase);
  const testPassword = randomBytes(8).toString("hex");
  const newTestPassword = randomBytes(8).toString("hex");
  try {
    await user.signUp(testPassword);
    const tokensBefore = user.userTokens;
    var result = await user.authenticateUserTokens();
    expect(result).toBe("short-lived tokens valid");
    expect(user.userTokens.access.getToken()).toBe(tokensBefore.access.getToken());
    await user.changeUsername("newUsername");
    expect(user.username).toBe("newUsername");
    await user.changePassword(testPassword, newTestPassword);
    expect(await verify(userBase.getUsers()[username].password, newTestPassword)).toBe(true); 
  } catch (error) {
    return (error);
  }
})

test("Refresh tokens", async () => {
  const userBase = new UserBase();
  const user = new User('refresh_user', userBase);
  const testPassword = randomBytes(8).toString("hex");
  try {
    await user.signUp(testPassword);
  } catch (error) {
    return error;
  }
  const tokensBefore = user.userTokens;
  if (user.userTokens.refresh.verifyToken()) {
    user.refreshUserTokens(user.userTokens.refresh);
  }
  expect(user.userTokens.refresh).toBe(tokensBefore.refresh);
  expect(user.userTokens.access).not.toBe(tokensBefore.access);
  expect(user.userTokens.id).not.toBe(tokensBefore.id);
})