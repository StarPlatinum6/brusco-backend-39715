import jwt from "jsonwebtoken";

import config from "../config.js";
import { createHash, isValidPassword } from "../utils.js";

import UserManager from "../dao/dbManagers/userManager.js";

const userManager = new UserManager();

export const registerUser = async (req, res) => {
  return res
    .status(201)
    .send({ status: "success", message: "User registered" });
};

export const failRegister = async (req, res) => {
  return res.send({ status: "error", message: "User already exists" });
};

export const loginUser = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const user = await userManager.getUser({ email });

  if (!user)
    return res
      .status(401)
      .send({ status: "error", error: "Invalid credentials." });

  if (!isValidPassword(user, password)) {
    return res
      .status(401)
      .send({ status: "error", error: "Invalid credentials." });
  }

  const jwtUser = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
    role: user.role,
    cart: user.cart,
  };

  const expireTime = rememberMe ? "7d" : "3h";

  const token = jwt.sign(jwtUser, config.JWT_SECRET, {
    expiresIn: `${expireTime}`,
  });

  return res
    .cookie("jwtCookie", token, { httpOnly: true })
    .send({ status: "success", message: "Logged In" });
};

export const githubLogin = async (req, res) => {};

export const githubCallback = async (req, res) => {
  req.user.email === "adminCoder@coder.com"
    ? (req.user.role = "admin")
    : (req.user.role = "user");

  req.user = {
    name: req.user.first_name,
    last_name: req.user.last_name,
    age: req.user.age,
    email: req.user.email,
    role: req.user.role,
    cart: req.user.cart,
  };

  const token = jwt.sign(req.user, config.JWT_SECRET, { expiresIn: "3h" });

  return res.cookie("jwtCookie", token, { httpOnly: true }).redirect("/home");
};

export const currentUser = (req, res) => {
    return res.status(200).send({ status: "success", message: req.user });
};

export const logoutUser = (req, res) => {
    return res
    .clearCookie("jwtCookie")
    .send({ status: "success", message: "Logout successful!" });
};

export const restoreUserPassword = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await userManager.getUser({ email });
      if (!user) {
        return res
          .status(404)
          .send({ status: "error", error: "User does not exist" });
      }
  
      const hashedPassword = createHash(password);
  
      await userManager.updatePassword({ email }, { password: hashedPassword });
  
      return res.send({
        status: "success",
        message: "Successfully updated password",
      });
    } catch (error) {
      console.log(error);
    }
  };
