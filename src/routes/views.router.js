import { Router } from "express";

// import ProductManager from "../dao/fileManagers/productManager.js";
import ProductManager from "../dao/dbManagers/productManager.js";

// import MessageManager from "../dao/fileManagers/messageManager.js";
import MessageManager from "../dao/dbManagers/messageManager.js";

const productManager = new ProductManager();
const messageManager = new MessageManager();

const router = Router();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", {
    products,
    style: "styles.css",
    title: "Products",
  });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", {
    products,
    style: "styles.css",
    title: "Real Time Products",
  });
});

router.get("/chat", async (req, res) => {
  const messages = await messageManager.getMessages();
  res.render("chat", {
    messages,
    style: "styles.css",
    title: "Ephemer Chat",
  });
});

export default router;
