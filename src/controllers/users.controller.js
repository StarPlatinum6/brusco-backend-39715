import { userService } from "../services/users.service.js";

import CustomError from "../services/errors/CustomError.js";
import ErrorCodes from "../services/errors/enums.js";
import { loginErrorInfo } from "../services/errors/info.js";

export const registerUser = async (req, res) => {
  try {
    return res
      .status(201)
      .send({ status: "success", message: "User registered" });
  } catch (error) {
    console.log(`Failed to register user: ${error}`);
    return res
      .status(500)
      .send({ status: "error", error: "Failed to register user" });
  }
};

export const failRegister = async (req, res) => {
  return res
    .status(409)
    .send({ status: "error", message: "User already exists" });
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      const error = CustomError.createError({
        name: "User Login error",
        cause: loginErrorInfo({ email, password }),
        message: "Error trying to login User",
        code: ErrorCodes.MISSING_DATA_ERROR,
        status: 400,
      });
      return next(error);
    }

    const user = await userService.getUser(email);

    if (!user) {
      return res
        .status(401)
        .send({ status: "error", error: "Invalid credentials." });
    }

    if (!userService.passwordValidate(user, password)) {
      return res
        .status(401)
        .send({ status: "error", error: "Invalid credentials." });
    }

    const token = userService.generateJwtToken(user, rememberMe);

    if (!token) {
      return res
        .status(500)
        .send({ status: "error", error: "Failed to generate JWT token" });
    }

    return res
      .cookie("jwtCookie", token, { httpOnly: true })
      .send({ status: "success", message: "Logged In" });
  } catch (error) {
    console.log(`Failed to login with error: ${error}`);
    return res.status(500).send({ status: "error", error: "Login failed" });
  }
};

export const githubLogin = async (req, res) => {};

export const githubCallback = async (req, res) => {
  try {
    const { user } = req;
    const token = userService.generateJwtToken(user);

    if (!token) {
      return res
        .status(500)
        .send({ status: "error", error: "Failed to generate JWT token" });
    }

    return res.cookie("jwtCookie", token, { httpOnly: true }).redirect("/home");
  } catch (error) {
    console.log(`Failed to handle GitHub callback with error: ${error}`);
    return res
      .status(500)
      .send({ status: "error", error: "Failed to handle GitHub callback" });
  }
};

export const currentUser = (req, res) => {
  return res.status(200).send({ status: "success", payload: req.user });
};

export const logoutUser = (req, res) => {
  return res
    .clearCookie("jwtCookie")
    .send({ status: "success", message: "Logout successful!" });
};

export const restoreUserPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    const user = await userService.getUser({ email });

    if (!user) {
      return res
        .status(404)
        .send({ status: "error", error: "User does not exist" });
    }

    const passwordUpdate = await userService.updatePassword(email, password);

    if (!passwordUpdate) {
      return res
        .status(500)
        .send({ status: "error", error: "Failed to update password" });
    }

    return res.status(204).send({
      status: "success",
      message: "Successfully updated password",
    });
  } catch (error) {
    console.log(`Failed to restore user password: ${error}`);
    return res
      .status(500)
      .send({ status: "error", error: "Failed to restore user password" });
  }
};
