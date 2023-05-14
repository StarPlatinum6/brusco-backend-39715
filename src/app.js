import express from "express";
import handlebars from "express-handlebars";
import socket from "./socket.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import messagesRouter from "./routes/messages.router.js"
import viewsRouter from "./routes/views.router.js";

import __dirname from "./utils.js";

const env = async () => {
  dotenv.config();

  const PORT = process.env.PORT || 8080;
  const DB_NAME = process.env.DB_NAME;
  const DB_USERNAME = process.env.DB_USERNAME;
  const DB_PASSWORD = process.env.DB_PASSWORD;

  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(`${__dirname}/public`));

  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);
  app.use("/api/messages", messagesRouter);
  app.use("/", viewsRouter);

  app.engine("handlebars", handlebars.engine());
  app.set("view engine", "handlebars");
  app.set("views", __dirname + "/views");

  const httpServer = app.listen(`${PORT}`, () =>
    console.log("Server up in port 8080!")
  );

  mongoose.connect(
    `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_NAME}.lihzhkv.mongodb.net/?retryWrites=true&w=majority`
  );

  socket.connect(httpServer);
};

env();
