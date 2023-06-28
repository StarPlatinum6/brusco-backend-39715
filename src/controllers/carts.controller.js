import { cartsService } from "../services/carts.service.js";
import { ticketsService } from "../services/tickets.service.js";

import CustomError from "../services/errors/CustomError.js";
import {
  ErrorCodes,
  ErrorMessages,
  ErrorNames,
} from "../services/errors/enums.js";
import { addToCartErrorInfo } from "../services/errors/info.js";

/////////////////////////
///////GET METHODS///////
/////////////////////////

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;

    if (!cid) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    const filteredCart = await cartsService.getCartById(cid);

    if (!filteredCart) {
      return res.status(404).send({
        status: "error",
        error: "Cart not found",
      });
    }

    return res.status(200).send({
      status: "success",
      payload: filteredCart,
    });
  } catch (error) {
    req.logger.error(`Cannot get cart with mongoose ${error}`);
    return res.status(500).send({
      status: "error",
      error: "Failed to get cart",
    });
  }
};

/////////////////////////
///////POST METHODS//////
/////////////////////////

export const createTicket = async (req, res) => {
  try {
    const { cid } = req.params;

    if (!cid) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    const newTicket = await ticketsService.createTicket(cid);

    if (!newTicket) {
      return res.status(404).send({
        status: "error",
        error: "Failed to create ticket",
      });
    }

    res.status(201).send({ status: "success", payload: newTicket });
  } catch (error) {
    req.logger.error(`Failed to create ticket with mongoose ${error}`);
    return res
      .status(500)
      .send({ status: "error", error: "Failed to create ticket" });
  }
};
export const createCart = async (req, res) => {
  try {
    const newCart = await cartsService.createCart();

    if (!newCart) {
      return res.status(404).send({
        status: "error",
        error: "Failed to create cart",
      });
    }

    res.status(201).send({ status: "success", payload: newCart });
  } catch (error) {
    req.logger.error(`Failed to create cart with mongoose ${error}`);
    return res
      .status(500)
      .send({ status: "error", error: "Failed to create cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!cid || !pid) {
      const error = CustomError.createError({
        name: ErrorNames.ADD_PRODUCT_TO_CART_ERROR,
        cause: addToCartErrorInfo({ cid, pid }),
        message: ErrorMessages.ADD_PRODUCT_TO_CART_ERROR_MESSAGE,
        code: ErrorCodes.MISSING_DATA_ERROR,
        status: 400,
      });
      return next(error);
    }

    const productAddedToCart = await cartsService.addToCart(cid, pid, quantity);

    if (!productAddedToCart) {
      return res.status(404).send({
        status: "error",
        error: "Failed to add product to cart",
      });
    }

    return res
      .status(201)
      .send({ status: "success", payload: productAddedToCart });
  } catch (error) {
    req.logger.error(`Cannot add to cart with mongoose ${error}`);
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

    if (!cid || !products) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    const updatedCart = await cartsService.updateCart(cid, products);

    if (!updatedCart) {
      return res.status(404).send({
        status: "error",
        error: "Failed to update cart",
      });
    }

    return res.status(200).send({
      status: "success",
      payload: updatedCart,
    });
  } catch (error) {
    req.logger.error(`Cannot update cart with mongoose ${error}`);
    return res
      .status(500)
      .send({ status: "error", error: "Failed to update cart" });
  }
};

export const updateProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    if (!cid || !pid) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    const updatedProductFromCart = await cartsService.updateProductFromCart(
      cid,
      pid,
      quantity
    );

    if (updatedProductFromCart.modifiedCount === 0) {
      return res.status(404).send({
        status: "error",
        error: "Product was not found in that cart",
      });
    }

    return res.status(200).send({
      status: "success",
      payload: updatedProductFromCart,
    });
  } catch (error) {
    req.logger.error(`Cannot update cart with mongoose ${error}`);
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

    if (!cid) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    const deletedCart = await cartsService.deleteCart(cid);

    if (!deletedCart) {
      return res.status(404).send({
        status: "error",
        error: "Cart not found",
      });
    }

    return res.status(200).send({
      status: "success",
      payload: deletedCart,
    });
  } catch (error) {
    req.logger.error(`Cannot delete cart with mongoose ${error}`);
    return res
      .status(500)
      .send({ status: "error", error: "Failed to delete cart" });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (!cid || !pid) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    const deletedProductFromCart = await cartsService.deleteProductFromCart(
      cid,
      pid
    );

    if (deletedProductFromCart.deletedCount === 0) {
      return res.status(404).send({
        status: "error",
        error: "Product was not found in that cart",
      });
    }

    return res.status(200).send({
      status: "success",
      payload: deletedProductFromCart,
    });
  } catch (error) {
    req.logger.error(`Cannot delete cart with mongoose ${error}`);
    return res
      .status(500)
      .send({ status: "error", error: "Failed to delete product from cart" });
  }
};
