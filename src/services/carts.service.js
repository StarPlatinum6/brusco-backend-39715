import { cartsRepository } from "../repositories/index.js";

class CartService {
  constructor() {}

  async getCartById(cid) {
    try {
      const filteredCart = await cartsRepository.getCartById(cid);
      if (!filteredCart) throw new Error(`Cart with id: ${cid} does not exist`);

      return filteredCart;
    } catch (error) {
      console.log(`Failed to get cart with error: ${error}`);
      throw error;
    }
  }

  async createCart() {
    try {
      const newCart = await cartsRepository.createCart();
      if (!newCart) throw new Error("Error creating new cart");

      return newCart;
    } catch (error) {
      console.log(`Failed to create cart with error: ${error}`);
      throw error;
    }
  }

  async addToCart(cid, pid, quantity) {
    try {
      const productAddedToCart = await cartsRepository.addToCart(
        cid,
        pid,
        quantity
      );
      if (!productAddedToCart)
        throw new Error(`Error adding product ${pid} to cart ${cid}`);

      return productAddedToCart;
    } catch (error) {
      console.log(`Failed to add to cart with error: ${error}`);
      throw error;
    }
  }

  async updateCart(cid, products) {
    try {
      const updatedCart = await cartsRepository.updateCart(cid, products);
      if (!updatedCart) throw new Error(`Error updating cart ${cid}`);

      return updatedCart;
    } catch (error) {
      console.log(`Failed to update cart with error: ${error}`);
      throw error;
    }
  }

  async updateProductFromCart(cid, pid, quantity) {
    try {
      const updatedProductFromCart =
        await cartsRepository.updateProductFromCart(cid, pid, quantity);
      if (!updatedProductFromCart)
        throw new Error(`Error updating product ${pid} from cart ${cid}`);

      return updatedProductFromCart;
    } catch (error) {
      console.log(`Failed to update product from cart with error: ${error}`);
      throw error;
    }
  }

  async deleteCart(cid) {
    try {
      const deletedCart = await cartsRepository.deleteCart(cid);
      if (!deletedCart) throw new Error(`Error deleting cart ${cid}`);

      return deletedCart;
    } catch (error) {
      console.log(`Failed to delete cart with error: ${error}`);
      throw error;
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const deletedProductFromCart =
        await cartsRepository.deleteProductFromCart(cid, pid);
      if (!deletedProductFromCart)
        throw new Error(`Error deleting product ${pid} from cart ${cid}`);

      return deletedProductFromCart;
    } catch (error) {
      console.log(`Failed to delete product from cart with error: ${error}`);
      throw error;
    }
  }
}

export const cartsService = new CartService();
