import { Router } from "express";
import passport from "passport";
import {
  currentUser,
  failRegister,
  githubCallback,
  githubLogin,
  loginUser,
  logoutUser,
  registerUser,
  restorePasswordProcess,
  updatePassword,
} from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/api/v1/users/failRegister",
  }),
  registerUser
);

usersRouter.get("/failRegister", failRegister);
usersRouter.post("/login", loginUser);

usersRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  githubLogin
);

usersRouter.get(
  "/githubcallback",
  passport.authenticate("github", { session: false, failureRedirect: "/" }),
  githubCallback
);

usersRouter.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  currentUser
);

usersRouter.get("/logout", logoutUser);

usersRouter.post("/restore", restorePasswordProcess);
usersRouter.put("/resetPassword", updatePassword);

export default usersRouter;
