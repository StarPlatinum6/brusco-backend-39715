import { cartModel } from "../../dao/models/carts.model.js";

export default class CartManager {
  constructor() {}

  getCarts = async () => {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (error) {
      console.log(error);
    }
  };

  getCartById = async (cartId) => {
    try {
      const filteredCart = await cartModel.find({ _id: cartId });
      return filteredCart;
    } catch (error) {
      console.log(error);
    }
  };

  createCart = async () => {
    try {
      const newCart = await cartModel.create({
        products: [],
      });
      return newCart;
    } catch (error) {
      console.log(error);
    }
  };

  addToCart = async (cartId, productId, quantity) => {
    try {
      let cartFound = await cartModel.findOne({ _id: cartId });

      const productIdInCart = cartFound.products.findIndex(
        (product) => product.productId === productId
      );

      if (productIdInCart !== -1) {
        const updatedCart = await cartModel.updateOne(
          { _id: cartId, products: { $elemMatch: { productId: productId } } },
          { $inc: { "products.$.quantity": 1 } }
        );
        return updatedCart;
      } else {
        const productAddToCart = {
          productId: productId,
          quantity: quantity ? quantity : 1,
        };
        const updatedCart = await cartModel.updateOne(
          { _id: cartId },
          { $push: { products: productAddToCart } }
        );
        return updatedCart;
      }
    } catch (error) {
      console.log(error);
    }
  };
}
