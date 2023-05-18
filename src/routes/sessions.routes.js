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
  restoreUserPassword,
} from "../controllers/sessions.controller.js";

const sessionsRouter = Router();

sessionsRouter.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/api/sessions/failRegister",
  }),
  registerUser
);

sessionsRouter.get("/failRegister", failRegister);
sessionsRouter.post("/login", loginUser);

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  githubLogin
);

sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", { session: false, failureRedirect: "/" }),
  githubCallback
);

sessionsRouter.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  currentUser
);

sessionsRouter.get("/logout", logoutUser);

sessionsRouter.put("/restore", restoreUserPassword);

export default sessionsRouter;
