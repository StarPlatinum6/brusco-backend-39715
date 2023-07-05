import { Router } from "express";

import productsRouter from "./products.routes.js";
import cartsRouter from "./carts.routes.js";
import messagesRouter from "./messages.routes.js";
import usersRouter from "./users.routes.js";
import viewsRouter from "./views.routes.js";
import ticketsRouter from "./tickets.routes.js";

import { swaggerUi } from "../config/swagger.js";

const routerAPI = (app) => {
  const router = Router();
  app.use("/api/v1", router);
  app.use("/", viewsRouter);
  app.use("/loggerTest", (req, res) => {
    req.logger.debug("Request in test endpoint at debug level!");
    req.logger.http("Request in test endpoint at http level!");
    req.logger.info("Request in test endpoint at info level!");
    req.logger.warning("Request in test endpoint at warning level!");
    req.logger.error("Request in test endpoint at error level!");
    req.logger.fatal("Request in test endpoint at fatal level!");
    res.send({ message: "Logger test sent to console" });
  });

  router.use("/products", productsRouter);
  router.use("/carts", cartsRouter);
  router.use("/messages", messagesRouter);
  router.use("/users", usersRouter);
  router.use("/tickets", ticketsRouter);

  router.use("/docs", swaggerUi());
};

export default routerAPI;
