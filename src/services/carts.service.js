import { cartsRepository } from "../dao/repositories/carts.repository.js";

class CartService {
  constructor() {}

  async getCartById(cid) {
    try {
      const filteredCart = await cartsRepository.getCartById(cid);
      return filteredCart;
    } catch (error) {
      console.log(`Failed to get cart with error: ${error}`);
      throw error;
    }
  }

  async createCart() {
    try {
      const newCart = await cartsRepository.createCart();
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
      return productAddedToCart;
    } catch (error) {
      console.log(`Failed to add to cart with error: ${error}`);
      throw error;
    }
  }

  async updateCart(cid, products) {
    try {
      const updatedCart = await cartsRepository.updateCart(cid, products);
      return updatedCart;
    } catch (error) {
      console.log(`Failed to update cart with error: ${error}`);
      throw error;
    }
  }

  async updateProductFromCart(cid, pid, quantity) {
    try {
      const updatedProductFromCart = await cartsRepository.updateProductFromCart(
        cid,
        pid,
        quantity
      );

      return updatedProductFromCart;
    } catch (error) {
      console.log(`Failed to update product from cart with error: ${error}`);
      throw error;
    }
  }

  async deleteCart(cid) {
    try {
      const deletedCart = await cartsRepository.deleteCart(cid);
      return deletedCart;
    } catch (error) {
      console.log(`Failed to delete cart with error: ${error}`);
      throw error;
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const deletedProductFromCart = await cartsRepository.deleteProductFromCart(
        cid,
        pid
      );
      return deletedProductFromCart;
    } catch (error) {
      console.log(`Failed to delete product from cart with error: ${error}`);
      throw error;
    }
  }
}

export const cartsService = new CartService();
