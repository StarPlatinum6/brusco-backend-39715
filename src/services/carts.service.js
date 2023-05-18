// import CartManager from "../dao/fileManagers/cartManager.js";
import CartManager from "../dao/dbManagers/cartManager.js";

const cartManager = new CartManager();

class CartService {
  constructor() {}

  async getCartById(cid) {
    try {
      if (!cid) {
        throw new Error("Incomplete values");
      }

      const filteredCart = await cartManager.getCartById(cid);

      if (!filteredCart) {
        throw new Error("Cart not found");
      }

      return filteredCart;
    } catch (error) {
      console.log(`Failed to get cart with error: ${error}`);
      throw error;
    }
  }

  async createCart() {
    try {
      const newCart = await cartManager.createCart();

      if (!newCart) {
        throw new Error("Failed to create cart");
      }

      return newCart;
    } catch (error) {
      console.log(`Failed to create cart with error: ${error}`);
      throw error;
    }
  }

  async addToCart(cid, pid, quantity) {
    try {
      if (!cid || !pid) {
        throw new Error("Incomplete values");
      }

      const productAddedToCart = await cartManager.addToCart(
        cid,
        pid,
        quantity
      );

      if (!productAddedToCart) {
        throw new Error("Failed to add product to cart");
      }

      return productAddedToCart;
    } catch (error) {
      console.log(`Failed to add to cart with error: ${error}`);
      throw error;
    }
  }

  async updateCart(cid, products) {
    try {
      if (!cid || !products) {
        throw new Error("Incomplete values");
      }

      const updatedCart = await cartManager.updateCart(cid, products);

      if (updatedCart.modifiedCount === 0) {
        throw new Error("Could not update cart. No cart found");
      }

      return updatedCart;
    } catch (error) {
      console.log(`Failed to update cart with error: ${error}`);
      throw error;
    }
  }

  async updateProductFromCart(cid, pid, quantity) {
    try {
      if (!cid || !pid) {
        throw new Error("Incomplete values");
      }

      const updatedProductFromCart = await cartManager.updateProductFromCart(
        cid,
        pid,
        quantity
      );

      if (updatedProductFromCart.modifiedCount === 0) {
        throw new Error("Product was not found in that cart");
      }

      return updatedProductFromCart;
    } catch (error) {
      console.log(`Failed to update product from cart with error: ${error}`);
      throw error;
    }
  }

  async deleteCart(cid) {
    try {
      if (!cid) {
        throw new Error("Incomplete values");
      }

      const deletedCart = await cartManager.deleteCart(cid);

      if (!deletedCart) {
        throw new Error("Cart not found");
      }

      return deletedCart;
    } catch (error) {
      console.log(`Failed to delete cart with error: ${error}`);
      throw error;
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      if (!cid || !pid) {
        throw new Error("Incomplete values");
      }

      const deletedProductFromCart = await cartManager.deleteProductFromCart(
        cid,
        pid
      );

      if (deletedProductFromCart.deletedCount === 0) {
        throw new Error("Product was not found in that cart");
      }

      return deletedProductFromCart;
    } catch (error) {
      console.log(`Failed to delete product from cart with error: ${error}`);
      throw error;
    }
  }
}

export const cartsService = new CartService();
