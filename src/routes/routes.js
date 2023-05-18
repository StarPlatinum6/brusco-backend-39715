import { Router } from "express";

import productsRouter from "./products.routes.js";
import cartsRouter from "./carts.routes.js";
import messagesRouter from "./messages.routes.js";
import viewsRouter from "./views.routes.js";
import sessionsRouter from "./sessions.routes.js";

const routerAPI = (app) => {
  const router = Router();
  app.use("/api/v1", router);

  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/api/messages", messagesRouter);
  app.use("/api/sessions", sessionsRouter);
  app.use("/", viewsRouter);
};

export default routerAPI;
