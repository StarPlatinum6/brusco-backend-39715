import { config } from "../config/config.js";

import { userService } from "../services/index.js";

import CustomError from "../services/errors/CustomError.js";
import {
  ErrorCodes,
  ErrorMessages,
  ErrorNames,
} from "../services/errors/enums.js";
import { loginErrorInfo } from "../services/errors/info.js";

const {
  jwt: { COOKIE_NAME },
} = config;

export const registerUser = async (req, res) => {
  try {
    return res
      .status(201)
      .send({ status: "success", message: "User registered" });
  } catch (error) {
    req.logger.error(`Failed to register user: ${error}`);
    return res
      .status(500)
      .send({ status: "error", error: "Failed to register user" });
  }
};

export const failRegister = async (req, res) => {
  return res
    .status(409)
    .send({ status: "error", error: "User already exists" });
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      const error = CustomError.createError({
        name: ErrorNames.AUTHENTICATION_ERROR,
        cause: loginErrorInfo({ email, password }),
        message: ErrorMessages.AUTHENTICATION_ERROR_MESSAGE,
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
      .cookie(COOKIE_NAME, token, { httpOnly: true })
      .send({ status: "success", message: "Logged In" });
  } catch (error) {
    req.logger.error(`Failed to login with error: ${error}`);
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

    return res.cookie(COOKIE_NAME, token, { httpOnly: true }).redirect("/home");
  } catch (error) {
    req.logger.error(`Failed to handle GitHub callback with error: ${error}`);
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
    .clearCookie(COOKIE_NAME)
    .send({ status: "success", message: "Logout successful!" });
};

export const restorePasswordProcess = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    await userService.restorePasswordProcess(email);

    return res.status(200).send({
      status: "success",
      message: "Password reset email sent",
    });
  } catch (error) {
    req.logger.error(`Failed to send password reset email: ${error}`);
    return res.status(500).send({ status: "error", error: `${error}` });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { password, token } = req.body;

    if (!password || !token) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    const passwordUpdate = await userService.updatePassword(token, password);

    if (!passwordUpdate) {
      return res
        .status(500)
        .send({ status: "error", error: "Failed to update password" });
    }

    return res.status(200).send({
      status: "success",
      message: "Successfully updated password",
    });
  } catch (error) {
    req.logger.error(`Failed to restore user password: ${error}`);
    return res.status(500).send({ status: "error", error: `${error}` });
  }
};

export const changeRole = async (req, res) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    const roleChanged = await userService.changeRole(uid);

    if (!roleChanged) {
      return res
        .status(500)
        .send({ status: "error", error: "Failed to change role" });
    }

    return res.status(200).send({
      status: "success",
      message: `Successfully changed role for user ${uid}`,
    });
  } catch (error) {
    req.logger.error(`Failed to change role: ${error}`);
    return res.status(500).send({ status: "error", error: `${error}` });
  }
};
