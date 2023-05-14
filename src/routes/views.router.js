import { Router } from "express";
import ProductManager from "../productManager.js";

const productManager = new ProductManager();
const router = Router();

const products = await productManager.getProducts();

router.get("/", async (req, res) => {
  res.render("home", {
    products,
    title: "Products",
  });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    products,
    title: "Real Time Products",
  });
});

export default router;
