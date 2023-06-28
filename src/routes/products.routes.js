import { Router } from "express";
import { uploader } from "../utils.js";
import { verifyRole } from "../middlewares/auth.js";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  mockingProducts,
} from "../controllers/products.controller.js";

const productsRouter = Router();

productsRouter.get(
  "/mockingproducts",
  (req, res, next) => verifyRole(req, res, next, "admin"),
  mockingProducts
);
productsRouter.get("/", getProducts);
productsRouter.get("/:pid", getProductById);
productsRouter.post(
  "/",
  (req, res, next) => verifyRole(req, res, next, "admin"),
  uploader.array("thumbnails"),
  addProduct
);
productsRouter.put(
  "/:pid",
  (req, res, next) => verifyRole(req, res, next, "admin"),
  updateProduct
);
productsRouter.delete(
  "/:pid",
  (req, res, next) => verifyRole(req, res, next, "admin"),
  deleteProduct
);

export default productsRouter;
