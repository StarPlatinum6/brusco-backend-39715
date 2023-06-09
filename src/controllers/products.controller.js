import { productsService } from "../services/products.service.js";

import CustomError from "../services/errors/CustomError.js";
import ErrorCodes from "../services/errors/enums.js";
import { addProductErrorInfo } from "../services/errors/info.js";

/////////////////////////
///////GET METHODS///////
/////////////////////////

export const getProducts = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      category = null,
      available = null,
      sort = null,
    } = req.query;

    if (isNaN(limit) || limit <= 0) {
      return res.status(400).send({
        status: "error",
        error: `Limit ${limit} is not a valid value`,
      });
    }

    if (isNaN(page) || page <= 0) {
      return res.status(400).send({
        status: "error",
        error: `Page ${page} is not a valid value`,
      });
    }

    if (isNaN(sort) && sort !== null) {
      return res.status(400).send({
        status: "error",
        error: `Sort value ${sort} is not a valid value`,
      });
    }

    const products = await productsService.getProducts(
      page,
      limit,
      category,
      available,
      sort
    );

    if (!products)
      return res.status(404).send({
        status: "error",
        error: `No products found`,
      });

    res.status(200).send({
      status: "success",
      payload: products,
    });
  } catch (error) {
    console.log(`Cannot get products with mongoose ${error}`);
    return res.status(500).send({
      status: "error",
      error: "Failed to get products",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const pid = req.params.pid;

    if (!pid) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    const filteredProduct = await productsService.getProductById(pid);

    if (!filteredProduct || filteredProduct == 0)
      return res.status(404).send({
        status: "error",
        error: `Product with ID ${pid} was not found`,
      });

    return res.status(200).send({
      status: "success",
      payload: filteredProduct,
    });
  } catch (error) {
    console.log(`Cannot get product with mongoose ${error}`);
    return res.status(500).send({
      status: "error",
      error: `Failed to get product with id ${pid}`,
    });
  }
};

export const mockingProducts = async (req, res) => {
  try {
    const productsMock = await productsService.mockingProducts();

    if (!productsMock)
      return res.status(404).send({
        status: "error",
        error: "Failed to get products mock",
      });

    return res.status(200).send({
      status: "success",
      payload: productsMock,
    });
  } catch (error) {
    console.log(`Cannot get products mock, error: ${error}`);
    return res.status(500).send({
      status: "error",
      error: "Failed to get products mock",
    });
  }
};

/////////////////////////
///////POST METHOD///////
/////////////////////////

export const addProduct = async (req, res, next) => {
  try {
    const { title, description, code, price, stock, category } = req.body;
    let { thumbnails } = req.body;

    if (req.files) thumbnails = req.files;

    if (!req.files && !thumbnails) {
      return res.status(400).send({
        status: "error",
        error: `Failed to save thumbnails`,
      });
    }

    if (!title || !description || !code || !price || !stock || !category) {
      const error = CustomError.createError({
        name: "Add product error",
        cause: addProductErrorInfo({
          title,
          description,
          code,
          price,
          stock,
          category,
        }),
        message: "Error trying to create new product",
        code: ErrorCodes.MISSING_DATA_ERROR,
        status: 400,
      });
      return next(error);
    }

    const addedProduct = await productsService.addProduct(
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails
    );

    if (!addedProduct) {
      return res.status(404).send({
        status: "error",
        error: "Failed to add product",
      });
    }

    res.status(201).send({ status: "success", payload: addedProduct });
  } catch (error) {
    console.log(`Cannot add product with mongoose ${error}`);
    return res.status(500).send({
      status: "error",
      error: "Failed to add product",
    });
  }
};

/////////////////////////
///////PUT METHOD////////
/////////////////////////

export const updateProduct = async (req, res) => {
  try {
    const updateProd = req.body;
    const updateId = req.params.pid;

    if (!updateProd || !updateId) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    const updatedProduct = await productsService.updateProduct(
      updateId,
      updateProd
    );

    if (!updatedProduct) {
      return res.status(404).send({
        status: "error",
        error: "Failed to update product",
      });
    }

    return res.status(200).send({
      status: "success",
      payload: updatedProduct,
    });
  } catch (error) {
    console.log(`Cannot update product with mongoose ${error}`);
    return res.status(500).send({
      status: "error",
      error: "Failed to update product",
    });
  }
};

/////////////////////////
//////DELETE METHOD//////
/////////////////////////

export const deleteProduct = async (req, res) => {
  try {
    const deleteId = req.params.pid;

    if (!deleteId) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    const deletedProduct = await productsService.deleteProduct(deleteId);

    if (!deletedProduct || deletedProduct.deletedCount === 0) {
      return res.status(404).send({
        status: "error",
        error: `Failed to delete product with ID ${deleteId}`,
      });
    }

    return res.status(200).send({
      status: "success",
      payload: deletedProduct,
    });
  } catch (error) {
    console.log(`Cannot delete product with mongoose ${error}`);
    return res.status(500).send({
      status: "error",
      error: "Failed to delete product",
    });
  }
};
