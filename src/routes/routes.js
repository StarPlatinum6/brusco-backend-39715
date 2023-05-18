import { Router } from "express";

import productsRouter from "./products.routes.js";
import cartsRouter from "./carts.routes.js";
import messagesRouter from "./messages.routes.js";
import sessionsRouter from "./sessions.routes.js";
import viewsRouter from "./views.routes.js";

const routerAPI = (app) => {
  const router = Router();
  app.use("/api/v1", router);
  app.use("/", viewsRouter);

  router.use("/products", productsRouter);
  router.use("/carts", cartsRouter);
  router.use("/messages", messagesRouter);
  router.use("/sessions", sessionsRouter);
};

export default routerAPI;
