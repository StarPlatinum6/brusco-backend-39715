import { Router } from "express";
import {
  getTickets,
  getTicketById,
} from "../controllers/tickets.controller.js";

const ticketsRouter = Router();
ticketsRouter.get("/", getTickets);
ticketsRouter.get("/:tid", getTicketById);

export default ticketsRouter;
