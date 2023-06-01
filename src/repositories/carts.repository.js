export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getCartById = async (cartId) => {
    try {
      const filteredCart = await this.dao.getCartById(cartId);
      return filteredCart;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  createCart = async () => {
    try {
      const newCart = await this.dao.createCart();
      return newCart;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  addToCart = async (cartId, productId, quantity) => {
    try {
      let result = await this.dao.addToCart(cartId, productId, quantity);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  updateCart = async (cartId, products) => {
    try {
      const updatedCart = await this.dao.updateCart(cartId, products);
      return updatedCart;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  updateProductFromCart = async (cartId, productId, quantity) => {
    try {
      const updatedCartProduct = await this.dao.updateProductFromCart(
        cartId,
        productId,
        quantity
      );
      return updatedCartProduct;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  deleteCart = async (cartId) => {
    try {
      const deletedCart = await this.dao.deleteCart(cartId);
      return deletedCart;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  deleteProductFromCart = async (cartId, productId) => {
    try {
      const updatedCart = await this.dao.deleteProductFromCart(
        cartId,
        productId
      );
      return updatedCart;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
