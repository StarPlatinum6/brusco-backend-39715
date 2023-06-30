import { Router } from "express";
import { verifyRole } from "../middlewares/auth.js";
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
cartsRouter.post(
  "/",
  (req, res, next) => verifyRole(req, res, next, "admin"),
  createCart
);
cartsRouter.post(
  "/:cid/product/:pid",
  (req, res, next) => verifyRole(req, res, next, ["user", "premium"]),
  addToCart
);
cartsRouter.post(
  "/:cid/purchase",
  (req, res, next) => verifyRole(req, res, next, ["user", "premium"]),
  createTicket
);
cartsRouter.put("/:cid", updateCart);
cartsRouter.put("/:cid/product/:pid", updateProductFromCart);
cartsRouter.delete(
  "/:cid",
  (req, res, next) => verifyRole(req, res, next, "admin"),
  deleteCart
);
cartsRouter.delete("/:cid/product/:pid", deleteProductFromCart);

export default cartsRouter;
