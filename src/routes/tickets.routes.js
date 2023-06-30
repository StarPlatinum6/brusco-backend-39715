import { Router } from "express";
import { verifyRole } from "../middlewares/auth.js";
import {
  getTickets,
  getTicketById,
  getTicketsByEmail,
} from "../controllers/tickets.controller.js";

const ticketsRouter = Router();
ticketsRouter.get(
  "/",
  (req, res, next) => verifyRole(req, res, next, "admin"),
  getTickets
);
ticketsRouter.get("/:tid", getTicketById);
ticketsRouter.get(
  "/orders/:email",
  (req, res, next) => verifyRole(req, res, next, ["user", "premium"]),
  getTicketsByEmail
);

export default ticketsRouter;
