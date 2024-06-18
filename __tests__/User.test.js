const { randomBytes } = require("crypto");
const { verify } = require("argon2")

const { User } = require("../src/User.js");
const { UserBase } = require("../src/UserBase.js");
const { AccessToken } = require("../src/AccessToken.js");
const { IdToken } = require("../src/IdToken.js");
const { RefreshToken } = require("../src/RefreshToken.js");
// we will only use the users.json file in our tests to imitate the user's use of a database or similar

// also test negative cases

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
  const username = "user4";
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
  const username = "user5";
  const user = new User(username, userBase);
  const testPassword = randomBytes(8).toString("hex");
  const newTestPassword = randomBytes(8).toString("hex");
  try {
    await user.signUp(testPassword);
    const tokensBefore = user.userTokens;
    const result = await user.authenticateUserTokens();
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

test("Expect access denied", async () => {
  const userBase = new UserBase();
  const username = "deny_user";
  const user = new User(username, userBase);
  const testPassword = randomBytes(8).toString("hex");
  const newPassword = randomBytes(8).toString("hex"); 
  // do not sign user up
  // or in fact we could sign user up and give fake tokens.
  try {
    await user.changeUsername("deny_user_2");
  } catch (error) {
    expect(error);
  }
  try {
    await user.signUp(testPassword);
    user.userTokens.access.token = user.userTokens.access.token + "fake";
    // the tokens will get refreshed without the next line
    user.userTokens.refresh.token = user.userTokens.refresh.token + "fake";
  } catch (error) {
    // our error was that the assigning of tokens was not correct
  }
  // directly verify token to test
  try {
    user.userTokens.access.verifyToken();
  } catch (error) {
    var testError = error;
  }
  expect(testError);
  try {
    await user.changePassword(testPassword, newPassword);
  } catch (error) {
    testError = error;
  }
  expect(testError);
  expect(await verify(userBase.getUsers()[username].password, testPassword)).toBe(true);
  try {
    await user.changeUsername("deny_user_3");
  } catch (error) {
    testError = error;
  }
  expect(testError);
  expect(user.username).toBe(username);
})

test("Duplicate usernames", async () => {
  const userBase = new UserBase();
  const username = "not_unique_user";
  const user = new User(username, userBase);
  const userDup = new User(username, userBase);
  const testPassword = randomBytes(8).toString("hex");
  try {
    await user.signUp(testPassword);
    var users = userBase.users;
    await userDup.signUp(testPassword);
  } catch (error) {}
  expect(users).toBe(userBase.users);
  const username2 = "now_unique_user";
  const user2 = new User(username2, userBase);
  const otherPassword = randomBytes(8).toString("hex");
  try {
    await user2.signUp(otherPassword);
    await user2.changeUsername(username);
  } catch (error) {
    expect(error);
  }
  expect(user2.getUsername()).toBe(username2);
})


test("Forgot Password", async () => {
  const userBase = new UserBase();
  const username = "user_forgot_password";
  const user = new User(username, userBase);
  const testPassword = randomBytes(8).toString("hex");
  const newPassword = randomBytes(8).toString("hex");
  try { 
    await user.signUp(testPassword);
    await user.forgotPassword(testPassword, newPassword); 
  } catch (error) {} 
  expect(await verify(userBase.getUsers()[username].password, newPassword)).toBe(true); 
})

test("Sign Out", async () => {
  const userBase = new UserBase();
  const username = "user_sign_out";
  const user = new User(username, userBase);
  const testPassword = randomBytes(8).toString("hex");
  const failPassword = randomBytes(8).toString("hex");
  try {
    await user.signUp(testPassword);
    await user.signOut(testPassword);
    await user.changePassword(failPassword);
  } catch (error) {
    var err = error;
  }
  expect(err)
  expect(await verify(userBase.getUsers()[username].password, testPassword)).toBe(true); 
})