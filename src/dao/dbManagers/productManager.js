import { productModel } from "../models/products.model.js";
import socket from "../../socket.js";

export default class ProductManager {
  constructor() {}

  getProducts = async () => {
    try {
      const products = await productModel.find().lean();
      return products;
    } catch (error) {
      console.log(error);
    }
  };

  getProductById = async (productId) => {
    try {
      const filteredProduct = await productModel.find({ _id: productId });
      return filteredProduct;
    } catch (error) {
      console.log(error);
    }
  };

  addProduct = async (product) => {
    try {
      product.stock > 0
        ? (product = { status: true, ...product })
        : (product = { status: false, ...product });

      if (product?.thumbnails[0]?.hasOwnProperty("fieldname")) {
        const imgPaths = product.thumbnails.map(
          (prod) => `images/${prod.filename}`
        ); // ! Revisar esto por el tema del __dirname y las rutas, consultar como sirve en dbs?
        product.thumbnails = imgPaths;
      }

      const newProduct = await productModel.create(product);

      socket.io.emit("product_add", newProduct);

      return newProduct;
    } catch (error) {
      console.log(error);
    }
  };

  updateProduct = async (productId, updateProd) => {
    try {
      const updatedProduct = await productModel.updateOne(
        { _id: productId },
        updateProd
      );
      return updatedProduct;
    } catch (error) {
      console.log(error);
    }
  };

  deleteProduct = async (deleteId) => {
    try {
      socket.io.emit("product_remove", deleteId);
      const deletedProduct = await productModel.deleteOne({ _id: deleteId });
      return deletedProduct;
    } catch (error) {
      console.log(error);
    }
  };
}
