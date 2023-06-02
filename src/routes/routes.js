import { Router } from "express";

import productsRouter from "./products.routes.js";
import cartsRouter from "./carts.routes.js";
import messagesRouter from "./messages.routes.js";
import usersRouter from "./users.routes.js";
import viewsRouter from "./views.routes.js";
import ticketsRouter from "./tickets.routes.js";

const routerAPI = (app) => {
  const router = Router();
  app.use("/api/v1", router);
  app.use("/", viewsRouter);

  router.use("/products", productsRouter);
  router.use("/carts", cartsRouter);
  router.use("/messages", messagesRouter);
  router.use("/users", usersRouter);
  router.use("/tickets", ticketsRouter);
};

export default routerAPI;
