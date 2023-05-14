import fs from "fs";
import { Blob } from "buffer";

export default class ProductManager {
  constructor() {
    this.path = "./files/products.json";
  }

  getProducts = async () => {
    if (fs.existsSync(this.path)) {
      const productData = await fs.promises.readFile(this.path, "utf-8");
      const size = new Blob([productData]).size;
      if (size > 0) {
        const parsedProducts = JSON.parse(productData);
        console.log(parsedProducts);
        return parsedProducts;
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  addProduct = async (product) => {
    const products = await this.getProducts();

    if (!product.title ||!product.description ||!product.price ||!product.thumbnail ||!product.code ||!product.stock) {
      console.log("Error: All fields are mandatory");
      return;
    }

    const productIndex = await products.findIndex((prod) => prod.code === product.code);

    if (productIndex === -1) {
      if (products.length === 0) {
        product.id = 1;
      } else {
        product.id = products[products.length - 1].id + 1;
      }
      products.push(product);
      await fs.promises.writeFile(this.path,JSON.stringify(products, null, "\t"));
      console.log(`Product with code ${product.code} added successfully`);
    } else {
      console.log(`Error: Product with code ${product.code} already exists`);
    }
  };

  getProductById = async (productId) => {
    const products = await this.getProducts();
    const productIdFound = products.findIndex((prod) => prod.id === productId);
    if (productIdFound === -1) {
      console.log(`Error: Product with ID ${productId} was not found`);
    } else {
      console.log(`Info on product with Product ID ${productId}:`);
      console.log(products[productIdFound]);
    }
  };

  updateProduct = async (productId, updatingKey, updateValue) => {
    const products = await this.getProducts();
    const productIdFound = products.findIndex((prod) => prod.id === productId);
    if (productIdFound === -1) {
      console.log(`Update error: Product with ID ${productId} was not found`);
    } else {
      products[productIdFound][updatingKey] = updateValue;
      await fs.promises.writeFile(this.path,JSON.stringify(products, null, "\t"));
      console.log(`Product with ID ${productId} was updated successfully`);
    }
  };

  deleteProduct = async (productId) => {
    const products = await this.getProducts();
    const productIdFound = products.findIndex((prod) => prod.id === productId);
    if (productIdFound === -1) {
      console.log(`Delete error: Product with ID ${productId} was not found`);
    } else {
      console.log(`Product with Product ID ${productId} was successfully deleted.`);
      products.splice(productIdFound, 1);
      await fs.promises.writeFile(this.path,JSON.stringify(products, null, "\t"));
    }
  };
}