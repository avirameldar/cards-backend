const User = require("./mongodb/User");
const _ = require("lodash");

const config = require("config");
const DB = config.get("DB");

const { createError } = require("../../utils/handleErrors");
const { generateAuthToken } = require("../../auth/providers/jwt");
const { comparePassword } = require("bcryptjs");

const registerUser = async (normalizedUser) => {
  if (DB === "MONGODB") {
    try {
      const { email } = normalizedUser;
      let user = await User.findOne({ email });
      if (user) throw new Error("User already registered");
      user = new User(normalizedUser);
      user = await user.save();
      user = _.pick(user, ["name", "email", "_id"]);
      return Promise.resolve(user);
    } catch (error) {
      return createError("Mongoose", error);
    }
  }
  return Promise.resolve("registerUser new user not in mongodb");
};

const loginUser = async ({ email, password }) => {
  if (DB === "MONGODB") {
    try {
      const user = await User.findOne({ email });
      if (!user)
        throw new Error("Authentication Error: Invalid email or password");
      const validPassword1 = password == user.password;
      const validPassword = comparePassword(password, user.password);


      if (!validPassword)
        throw new Error("Authentication Error: Invalid email or password");

      const token = generateAuthToken(user);

      return Promise.resolve(token);
    } catch (error) {
      return createError("Mongoose", error);
    }
  }
  return Promise.resolve("loginUser user not in mongodb");
};

const getUsers = async () => {
  if (DB === "MONGODB") {
    try {
      const users = await User.find({}, { password: 0, __v: 0 });
      return Promise.resolve(users);
    } catch (error) {
      return createError("Mongoose", error);
    }
  }
  return Promise.resolve("get users not in mongodb");
};

const getUser = async (userId) => {
  if (DB === "MONGODB") {
    try {
      let user = await User.findById(userId, {
        password: 0,
        __v: 0,
      });
      if (!user) throw new Error("Could not find this user in the database");
      return Promise.resolve(user);
    } catch (error) {
      return createError("Mongoose", error);
    }
  }
  return Promise.resolve("get user not in mongodb");
};

const updateUser = async (userId, normalizedUser) => {
  if (DB === "MONGODB") {
    try {
      let user = await User.findByIdAndUpdate(userId, normalizedUser, {
        new: true,
      });
      if (!user) {
        throw new Error("The user with this id didnt found");
      }
      return Promise.resolve(user);
    } catch (error) {
      return createError("Mongoose", error);
    }
  }
  return Promise.resolve("card update not in mongodb");
};

const changeUserBusinessStatus = async (userId) => {
  if (DB === "MONGODB") {
    try {
      let user = User.findById(userId);
      user.isBusiness = !user.isBusiness;
      user.save();
      return Promise.resolve(`user no. ${userId} change his business status!`);
    } catch (error) {
      return createError("Mongoose", error);
    }
  }
  return Promise.resolve("card liked not in mongodb");
};

const deleteUser = async (userId, userIdToDelete) => {
  if (DB === "MONGODB") {
    try {
      let userToDelete = await User.findById(userIdToDelete);
      let user = await User.findById(userId);
      if (!user || !userToDelete)
        throw new Error("A user with this ID cannot be found in the database");
      if (!user.isAdmin || user._id != userToDelete._id)
        throw new Error(
          "Authorization Error: Only the user who created the business card or admin can delete this card"
        );
      userToDelete = await User.findByIdAndDelete(userIdToDelete);
      return Promise.resolve(userToDelete);
    } catch (error) {
      return createError("Mongoose", error);
    }
  }
  return Promise.resolve("card deleted not in mongodb");
};

exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.changeUserBusinessStatus = changeUserBusinessStatus;
exports.deleteUser = deleteUser;
