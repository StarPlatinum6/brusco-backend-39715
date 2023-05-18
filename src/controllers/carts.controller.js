// // import CartManager from "../dao/fileManagers/cartManager.js";
// import CartManager from "../dao/dbManagers/cartManager.js";

// const cartManager = new CartManager();

import { cartsService } from "../services/carts.service.js";

/////////////////////////
///////GET METHODS///////
/////////////////////////

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const filteredCart = await cartsService.getCartById(cid);
    return res.status(200).send({
      status: "success",
      payload: filteredCart,
    });
  } catch (error) {
    if (
      error.message === "Cart not found" ||
      error.message === "Incomplete values"
    ) {
      return res.status(404).send({
        status: "error",
        error: `${error.message}`,
      });
    }
    console.log(`Cannot get cart with mongoose ${error}`);
    return res
      .status(500)
      .send({ status: "error", error: "Failed to get cart" });
  }
};

/////////////////////////
///////POST METHODS//////
/////////////////////////

export const createCart = async (req, res) => {
  try {
    const newCart = await cartsService.createCart();
    res.status(201).send({ status: "Success", payload: newCart });
  } catch (error) {
    console.log(`Failed to create cart with mongoose ${error}`);

    if (error.message === "Failed to create cart") {
      return res.status(404).send({
        status: "error",
        message: { error: "Failed to create cart" },
      });
    }
    return res
      .status(500)
      .send({ status: "error", error: "Failed to create cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const productAddedToCart = await cartsService.addToCart(cid, pid, quantity);
    return res
      .status(201)
      .send({ status: "Success", payload: productAddedToCart });
  } catch (error) {
    console.log(`Cannot add to cart with mongoose ${error}`);
    if (
      error.message === "Incomplete values" ||
      error.message === "Failed to add product to cart"
    ) {
      return res.status(404).send({
        status: "error",
        error: `${error.message}`,
      });
    }
    return res
      .status(500)
      .send({ status: "error", error: "Failed to add product to cart" });
  }
};

/////////////////////////
///////PUT METHODS///////
/////////////////////////

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const products = req.body;

    const updatedCart = await cartsService.updateCart(cid, products);

    return res.status(200).send({
      status: "success",
      payload: updatedCart,
    });
  } catch (error) {
    console.log(`Cannot update cart with mongoose ${error}`);

    if (error.message === "Incomplete values") {
      return res.status(400).send({
        status: "error",
        message: { error: "Incomplete values" },
      });
    }

    if (error.message === "Could not update cart. No cart found") {
      return res.status(404).send({
        status: "error",
        message: {
          error: "Could not update cart. No cart found",
        },
      });
    }

    return res
      .status(500)
      .send({ status: "error", error: "Failed to update cart" });
  }
};

export const updateProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    let updatedProductFromCart = await cartsService.updateProductFromCart(
      cid,
      pid,
      quantity
    );

    return res.status(200).send({
      status: "success",
      payload: updatedProductFromCart,
    });
  } catch (error) {
    console.log(`Cannot update cart with mongoose ${error}`);
    if (error.message === "Incomplete values") {
      return res.status(400).send({
        status: "error",
        message: { error: "Incomplete values" },
      });
    }

    if (error.message === "Product was not found in that cart") {
      return res.status(404).send({
        status: "error",
        message: {
          error: "Product was not found in that cart",
        },
      });
    }

    return res
      .status(500)
      .send({ status: "error", error: "Failed to update cart" });
  }
};

/////////////////////////
//////DELETE METHODS/////
/////////////////////////

export const deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const deletedCart = await cartsService.deleteCart(cid);

    return res.status(200).send({
      status: "success",
      payload: deletedCart,
    });
  } catch (error) {
    console.log(`Cannot delete cart with mongoose ${error}`);

    if (error.message === "Incomplete values") {
      return res.status(400).send({
        status: "error",
        message: { error: "Incomplete values" },
      });
    }

    if (error.message === "Cart not found") {
      return res.status(404).send({
        status: "error",
        message: {
          error: "Cart not found",
        },
      });
    }

    return res
      .status(500)
      .send({ status: "error", error: "Failed to delete cart" });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const deletedProductFromCart = await cartsService.deleteProductFromCart(
      cid,
      pid
    );

    return res.status(200).send({
      status: "success",
      payload: deletedProductFromCart,
    });
  } catch (error) {
    console.log(`Cannot delete cart with mongoose ${error}`);

    if (error.message === "Incomplete values") {
      return res.status(400).send({
        status: "error",
        message: { error: "Incomplete values" },
      });
    }

    if (error.message === "Product was not found in that cart") {
      return res.status(404).send({
        status: "error",
        message: {
          error: "Product was not found in that cart",
        },
      });
    }

    return res
      .status(500)
      .send({ status: "error", error: "Failed to delete product from cart" });
  }
};
