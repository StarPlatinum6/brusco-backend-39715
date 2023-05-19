// import CartManager from "../dao/fileManagers/cartManager.js";
import CartManager from "../dao/dbManagers/cartManager.js";

const cartManager = new CartManager();

class CartService {
  constructor() {}

  async getCartById(cid) {
    try {
      const filteredCart = await cartManager.getCartById(cid);
      return filteredCart;
    } catch (error) {
      console.log(`Failed to get cart with error: ${error}`);
      throw error;
    }
  }

  async createCart() {
    try {
      const newCart = await cartManager.createCart();
      return newCart;
    } catch (error) {
      console.log(`Failed to create cart with error: ${error}`);
      throw error;
    }
  }

  async addToCart(cid, pid, quantity) {
    try {
      const productAddedToCart = await cartManager.addToCart(
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
      const updatedCart = await cartManager.updateCart(cid, products);
      return updatedCart;
    } catch (error) {
      console.log(`Failed to update cart with error: ${error}`);
      throw error;
    }
  }

  async updateProductFromCart(cid, pid, quantity) {
    try {
      const updatedProductFromCart = await cartManager.updateProductFromCart(
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
      const deletedCart = await cartManager.deleteCart(cid);
      return deletedCart;
    } catch (error) {
      console.log(`Failed to delete cart with error: ${error}`);
      throw error;
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const deletedProductFromCart = await cartManager.deleteProductFromCart(
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
