// import ProductManager from "../dao/fileManagers/productManager.js";
import ProductManager from "../dao/dbManagers/productManager.js";

// import MessageManager from "../dao/fileManagers/messageManager.js";
import MessageManager from "../dao/dbManagers/messageManager.js";

import CartManager from "../dao/dbManagers/cartManager.js";

const productManager = new ProductManager();
const messageManager = new MessageManager();
const cartManager = new CartManager();

export const loginView = (req, res) => {
  res.render("login", {
    style: "styles.css",
    title: "Ephemer - Login",
  });
};

export const registerView = (req, res) => {
  res.render("register", {
    style: "styles.css",
    title: "Ephemer - Register",
  });
};

export const profileView = (req, res) => {
  res.render("profile", {
    user: req.user,
    style: "styles.css",
    title: "Ephemer - Your Profile",
  });
};

export const restorePasswordView = (req, res) => {
  res.render("restore", {
    user: req.user,
    style: "styles.css",
    title: "Ephemer - Password Restore",
  });
};

export const homeView = async (req, res) => {
  const { limit = 10, page = 1, category, available, sort } = req.query;
  const {
    docs: products,
    hasPrevPage,
    hasNextPage,
    nextPage,
    prevPage,
  } = await productManager.getProducts(page, limit, category, available, sort);
  res.render("home", {
    user: req.user,
    products,
    page,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    style: "styles.css",
    title: "Ephemer - Products",
  });
};

export const productView = async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);
  res.render("product", {
    cartId: req.user.cart,
    product,
    style: "styles.css",
    title: "Ephemer - Product Detail",
  });
};

export const cartView = async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getCartById(cid);
  res.render("cart", {
    cart,
    style: "styles.css",
    title: "Ephemer - Cart Detail",
  });
};

//////////////////////////////////////////////////////

export const realTimeProductsView = async (req, res) => {
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
};

export const chatView = async (req, res) => {
  const messages = await messageManager.getMessages();
  res.render("chat", {
    messages,
    style: "styles.css",
    title: "Ephemer - Chat",
  });
};
