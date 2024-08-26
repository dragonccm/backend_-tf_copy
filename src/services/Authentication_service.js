require("dotenv").config();
import bcrypt from "bcryptjs";
import User from "../models/user_model.js";
// const { getGroupWithRole } = require("./jwt-services.js");
const { createToken } = require("../middleware/jwt.js");
// get the promise implementation, we will use bluebird
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync("B4c0//", salt);
import { v4 as uuidv4 } from "uuid";
const hashPassword = (password) => {
  const pass_hash = bcrypt.hashSync(password, salt);
  return pass_hash;
};
const checkEmail = async (email) => {
  let user = await User.findOne({ email: email });
  if (user) {
    return true;
  } else {
    return false;
  }
};
const checkUsername = async (username) => {
  let user = await User.findOne({ username: username });
  if (user) {
    return true;
  } else {
    return false;
  }
};
const generateId = () => {
  return uuidv4();
};
const handleRegister = async (data) => {
  try {
    let isEmailExist = await checkEmail(data.email);
    let isUsernameExist = await checkUsername(data.username);
    console.log("email" + data.email);
    console.log("name" + data.username);
    if (isUsernameExist) {
      return {
        EM: "the Username already exists",
        EC: "1",
      };
    } else if (isEmailExist) {
      return {
        EM: "the Email already exists",
        EC: "1",
      };
    } else {
      let hashPass = hashPassword(data.password);

      const newUser = new User({
        id: generateId(),
        email: data.email,
        username: data.username,
        password: hashPass,
        avt: "",
        birthday: "",
        role: "1",
        type_login: "normal",
      });
      await newUser.save();

      return {
        EM: "A user created successfully",
        EC: "0",
      };
    }
  } catch (error) {
    console.log("error: >>>>", error);
    return {
      EM: "error creating user",
      EC: "2",
    };
  }
};
const checkPassword = async(inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword);
};
const handleLogin = async (data) => {
  try {
    const user = await User.findOne({
      $or: [{ email: data.valueLogin }, { username: data.valueLogin }],
    });
    if (user) {
      let isCorrectPassword = await checkPassword(data.password, user.password);
      if (isCorrectPassword) {
        // let groupWithRole = await getGroupWithRole(user);
        let payload = {
          id: user.id,
          email: user.email,
          type_login: user.type_login,
          username: user.username,
        };
        let token = createToken(payload);
        return {
          EM: "ok!",
          EC: "0",
          DT: {
            access_token: token,
            avt: user.avt,
            email: user.email,
            username: user.username,
          },
        };
      }
    } else {
      console.log("hahah");
      return {
        EM: "Your email/phone or password is incorrect!",
        EC: "2",
        DT: "",
      };
    }

    return {
      EM: "Your email/phone or password is incorrect!",
      EC: "1",
      DT: "",
    };
  } catch (error) {
    console.log("error: >>>>", error);
    return {
      EM: "error creating user",
      EC: "2",
      DT: "",
    };
  }
};
const handleAuthGG = async (token) => {
  try {
    const user = await User.findOne({
      token: token,
    });
    if (user) {
      user.token = generateId();
      await user.save();
      // let groupWithRole = await getGroupWithRole(user);
      let payload = {
        id: user.id,
        email: user.email,
        username: user.username,
        type_login: user.type_login,
      };
      let token = createToken(payload);
      return {
        EM: "ok!",
        EC: "0",
        DT: {
          access_token: token,
          avt: user.avt,
          email: user.email,
          username: user.username || "",
        },
      };
    } else {
      console.log("hahah");
      return {
        EM: "Your email/phone or password is incorrect!",
        EC: "2",
        DT: "",
      };
    }
  } catch (error) {
    console.log("error: >>>>", error);
    return {
      EM: "error creating user",
      EC: "2",
      DT: "",
    };
  }
};
const handleCheckAccount = async (id) => {
  const user = await User.findOne({
    id: id,
  });
  // console.log(user);
  // console.log(id);
  if (user) {
    return {
      EM: "ok!",
      EC: "0",
      DT: user,
    };
  }
};
module.exports = {
  handleRegister,
  handleLogin,
  handleAuthGG,
  checkEmail,
  generateId,
  checkPassword,
  hashPassword,
  handleCheckAccount,
};
