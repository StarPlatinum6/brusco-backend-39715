import database from "../db.js";
import { persistenceType } from "../config/commander.js";

export let productDAO, cartDAO, userDAO, messageDAO, ticketDAO;

switch (persistenceType) {
  case "MONGO":
    database.connect();
    const { productMongo } = await import("./mongo/product.mongo.js");
    productDAO = productMongo;
    const { cartMongo } = await import("./mongo/cart.mongo.js");
    cartDAO = cartMongo;
    const { userMongo } = await import("./mongo/user.mongo.js");
    userDAO = userMongo;
    const { messageMongo } = await import("./mongo/message.mongo.js");
    messageDAO = messageMongo;
    const { ticketMongo } = await import("./mongo/ticket.mongo.js");
    ticketDAO = ticketMongo;
    break;
  case "FILESYSTEM":
    const { productFs } = await import("./fs/product.fs.js");
    productDAO = productFs;
    const { cartFs } = await import("./fs/cart.fs.js");
    cartDAO = cartFs;
    const { userFs } = await import("./fs/user.fs.js");
    userDAO = userFs;
    const { messageFs } = await import("./fs/message.fs.js");
    messageDAO = messageFs;
    const { ticketFs } = await import("./fs/ticket.fs.js");
    ticketDAO = ticketFs;
    break;
  default:
    throw new Error(
      `${persistenceType} is not a valid persistence type, you must select "MONGO" or "FILESYSTEM"`
    );
}
