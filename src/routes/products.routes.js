import { Router } from "express";
import { uploader } from "../utils.js";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/products.controller.js";

const productsRouter = Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:pid", getProductById);
productsRouter.post("/", uploader.array("thumbnails"), addProduct);
productsRouter.put("/:pid", updateProduct);
productsRouter.delete("/:pid", deleteProduct);

export default productsRouter;
