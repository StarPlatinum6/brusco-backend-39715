import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import config from "../config.js";
import userModel from "../dao/models/user.model.js";
import UserManager from "../dao/dbManagers/userManager.js";

import { createHash, isValidPassword } from "../utils.js";

const router = Router();
const userManager = new UserManager();

router.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/api/sessions/failRegister",
  }),
  async (req, res) => {
    return res
      .status(201)
      .send({ status: "success", message: "User registered" });
  }
);

router.get("/failRegister", (req, res) => {
  return res.send({ status: "error", message: "User already exists" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
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

  const token = jwt.sign(jwtUser, config.JWT_SECRET, { expiresIn: "3h" });

  return res
    .cookie("jwtCookie", token, { httpOnly: true })
    .send({ status: "success", message: "Logged In" });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { session: false, failureRedirect: "/" }),
  async (req, res) => {
    req.user.email === "adminCoder@coder.com"
      ? (req.user.role = "admin")
      : (req.user.role = "user");

    req.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
      cart: req.user.cart,
    };

    const token = jwt.sign(req.user, config.JWT_SECRET, { expiresIn: "3h" });

    return res.cookie("jwtCookie", token, { httpOnly: true }).redirect("/home");
  }
);

router.get("/logout", (req, res) => {
  return res
    .clearCookie("jwtCookie")
    .send({ status: "success", message: "Logout successful!" });
});

router.put("/restore", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ status: "error", error: "User does not exist" });
    }

    const hashedPassword = createHash(password);

    await userModel.updateOne({ email }, { password: hashedPassword });

    return res.send({
      status: "success",
      message: "Successfully updated password",
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
