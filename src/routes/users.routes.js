import { Router } from "express";
import passport from "passport";
import { verifyRole } from "../middlewares/auth.js";
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
  changeRole,
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

usersRouter.post(
  "/premium/:uid",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => verifyRole(req, res, next, "admin"),
  changeRole
);

usersRouter.post("/restore", restorePasswordProcess);
usersRouter.put("/resetPassword", updatePassword);

usersRouter.get("/logout", logoutUser);

export default usersRouter;
