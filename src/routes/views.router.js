import { Router } from "express";
import { checkLogged, checkLogin } from "../middlewares/auth.js";

// import ProductManager from "../dao/fileManagers/productManager.js";
import ProductManager from "../dao/dbManagers/productManager.js";

// import MessageManager from "../dao/fileManagers/messageManager.js";
import MessageManager from "../dao/dbManagers/messageManager.js";

import CartManager from "../dao/dbManagers/cartManager.js";

const productManager = new ProductManager();
const messageManager = new MessageManager();
const cartManager = new CartManager();

const router = Router();

router.get("/", checkLogged, (req, res) => {
  res.render("login", {
    style: "styles.css",
    title: "Ephemer - Login",
  });
});

router.get("/register", checkLogged, (req, res) => {
  res.render("register", {
    style: "styles.css",
    title: "Ephemer - Register",
  });
});

router.get("/profile", checkLogin, (req, res) => {
  res.render("profile", {
    user: req.session.user,
    style: "styles.css",
    title: "Ephemer - Your Profile",
  });
});

router.get("/home", checkLogin, async (req, res) => {
  const { limit = 10, page = 1, category, available, sort } = req.query;
  const {
    docs: products,
    hasPrevPage,
    hasNextPage,
    nextPage,
    prevPage,
  } = await productManager.getProducts(page, limit, category, available, sort);
  res.render("home", {
    user: req.session.user,
    products,
    page,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    style: "styles.css",
    title: "Ephemer - Products",
  });
});

router.get("/product/:pid", checkLogin, async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);
  res.render("product", {
    product,
    style: "styles.css",
    title: "Ephemer - Product Detail",
  });
});

router.get("/cart/:cid", checkLogin, async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getCartById(cid);
  res.render("cart", {
    cart,
    style: "styles.css",
    title: "Ephemer - Cart Detail",
  });
});

//////////////////////////////////////////////////////

router.get("/realtimeproducts", checkLogin, async (req, res) => {
  const { limit = 10, page = 1, category, available, sort } = req.query;
  const {
    docs: products,
    hasPrevPage,
    hasNextPage,
    nextPage,
    prevPage,
  } = await productManager.getProducts(page, limit, category, available, sort);

  res.render("realTimeProducts", {
    products,
    page,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    style: "styles.css",
    title: "Ephemer - Real Time Products",
  });
});

router.get("/chat", checkLogin, async (req, res) => {
  const messages = await messageManager.getMessages();
  res.render("chat", {
    messages,
    style: "styles.css",
    title: "Ephemer - Chat",
  });
});

export default router;
