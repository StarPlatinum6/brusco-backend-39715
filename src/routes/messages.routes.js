import { Router } from "express";
import { verifyRole } from "../middlewares/auth.js";
import { getMessages } from "../controllers/messages.controller.js";

const messagesRouter = Router();
messagesRouter.get(
  "/",
  (req, res, next) => verifyRole(req, res, next, "user"),
  getMessages
);

export default messagesRouter;
