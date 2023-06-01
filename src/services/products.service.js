import { productsRepository } from "../repositories/index.js";

class ProductService {
  constructor() {}

  async getProducts(page, limit, category, available, sort) {
    try {
      const products = await productsRepository.getProducts(
        page,
        limit,
        category,
        available,
        sort
      );
      if (!products) throw new Error("Couldn't find products");

      return products;
    } catch (error) {
      console.log(`Failed to get products with error: ${error}`);
      throw error;
    }
  }

  async getProductById(pid) {
    try {
      const filteredProduct = await productsRepository.getProductById(pid);
      if (!filteredProduct)
        throw new Error(`Product with id: ${pid} does not exist`);

      return filteredProduct;
    } catch (error) {
      console.log(`Failed to get product id ${pid} with error: ${error}`);
      throw error;
    }
  }

  async addProduct(
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails
  ) {
    try {
      const productObj = {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails,
      };

      const addedProduct = await productsRepository.addProduct(productObj);
      if (!addedProduct) throw new Error("Error adding new product");

      return addedProduct;
    } catch (error) {
      console.log(`Failed to add product with error: ${error}`);
      throw error;
    }
  }

  async updateProduct(updateId, updateProd) {
    try {
      const updatedProduct = await productsRepository.updateProduct(
        updateId,
        updateProd
      );
      if (!updatedProduct)
        throw new Error(`Error updating product with id: ${updateId}`);

      return updatedProduct;
    } catch (error) {
      console.log(`Failed to update product with error: ${error}`);
      throw error;
    }
  }

  async deleteProduct(deleteId) {
    try {
      const deletedProduct = await productsRepository.deleteProduct(deleteId);
      if (!deletedProduct)
        throw new Error(`Error deleting product with id: ${deleteId}`);
      return deletedProduct;
    } catch (error) {
      console.log(`Failed to delete product with error: ${error}`);
      throw error;
    }
  }
}

export const productsService = new ProductService();
