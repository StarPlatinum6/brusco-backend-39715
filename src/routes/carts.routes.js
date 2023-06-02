import { Router } from "express";
import {
  addToCart,
  createTicket,
  createCart,
  deleteCart,
  deleteProductFromCart,
  getCartById,
  updateCart,
  updateProductFromCart,
} from "../controllers/carts.controller.js";

const cartsRouter = Router();

cartsRouter.get("/:cid", getCartById);
cartsRouter.post("/", createCart);
cartsRouter.post("/:cid/product/:pid", addToCart);
cartsRouter.post("/:cid/purchase", createTicket);
cartsRouter.put("/:cid", updateCart);
cartsRouter.put("/:cid/product/:pid", updateProductFromCart);
cartsRouter.delete("/:cid", deleteCart);
cartsRouter.delete("/:cid/product/:pid", deleteProductFromCart);

export default cartsRouter;
