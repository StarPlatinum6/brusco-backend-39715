import config from "../config.js";
import database from "../db.js";

export let productDAO, cartDAO, userDAO, messageDAO;

// ! Acá tocará cambiar config.persistence por lo que venga en el process por CLI
switch (config.PERSISTENCE) {
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
    break;
}
