import { Router } from "express";
import passport from "passport";

import { checkLogged, isProtected, verifyRole } from "../middlewares/auth.js";
import {
  cartView,
  chatView,
  homeView,
  loginView,
  productView,
  profileView,
  realTimeProductsView,
  registerView,
  restorePasswordView,
  ticketsView,
} from "../controllers/views.controller.js";

const viewsRouter = Router();

viewsRouter.get("/", checkLogged, loginView);

viewsRouter.get("/register", checkLogged, registerView);

viewsRouter.get(
  "/profile",
  isProtected,
  passport.authenticate("jwt", { session: false }),
  profileView
);

viewsRouter.get("/restore", restorePasswordView);

viewsRouter.get(
  "/home",
  isProtected,
  passport.authenticate("jwt", { session: false }),
  homeView
);

viewsRouter.get(
  "/product/:pid",
  isProtected,
  passport.authenticate("jwt", { session: false }),
  productView
);

viewsRouter.get(
  "/cart/:cid",
  isProtected,
  (req, res, next) => verifyRole(req, res, next, "user"),
  passport.authenticate("jwt", { session: false }),
  cartView
);

viewsRouter.get(
  "/tickets",
  isProtected,
  (req, res, next) => verifyRole(req, res, next, "user"),
  passport.authenticate("jwt", { session: false }),
  ticketsView
);

//////////////////////////////////////////////////////

viewsRouter.get(
  "/realtimeproducts",
  isProtected,
  passport.authenticate("jwt", { session: false }),
  realTimeProductsView
);

viewsRouter.get(
  "/chat",
  isProtected,
  (req, res, next) => verifyRole(req, res, next, "user"),
  passport.authenticate("jwt", { session: false }),
  chatView
);

export default viewsRouter;
