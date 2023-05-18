import { Router } from "express";
import { getMessages } from "../controllers/messages.controller.js";

const messagesRouter = Router();
messagesRouter.get("/", getMessages);

export default messagesRouter;
