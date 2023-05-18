import { Router } from "express";
import { uploader } from "../utils.js";

// import ProductManager from "../dao/fileManagers/ProductManager.js";
import ProductManager from "../dao/dbManagers/productManager.js";

const productManager = new ProductManager();
const router = Router();

/////////////////////////
///////GET METHODS///////
/////////////////////////

router.get("/", async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      category = null,
      available = null,
      sort = null,
    } = req.query;

    const products = await productManager.getProducts(
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

    if (isNaN(limit)) {
      return res.status(400).send({
        status: "error",
        error: `Limit ${limit} is not a valid value`,
      });
    }

    if (isNaN(page)) {
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

    res.status(200).send({
      status: "success",
      payload: products,
    });
  } catch (error) {
    console.log(`Cannot get products with mongoose ${error}`);
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const filteredProduct = await productManager.getProductById(pid);

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
  }
});

/////////////////////////
///////POST METHOD///////
/////////////////////////

router.post("/", uploader.array("thumbnails"), async (req, res) => {
  try {
    let { title, description, code, price, stock, category, thumbnails } =
      req.body;

    if (req.files) thumbnails = req.files;

    if (!req.files && !thumbnails) {
      return res.status(400).send({
        status: "error",
        error: `Thumbnails could not be saved`,
      });
    }

    const productObj = {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
    };

    const addedProduct = await productManager.addProduct(productObj);

    if (!addedProduct) {
      return res.status(400).send({
        status: "error",
        error: "Product couldn't be added.",
      });
    }

    res.status(201).send({ status: "Success", payload: addedProduct });
  } catch (error) {
    console.log(error);
  }
});

/////////////////////////
///////PUT METHOD////////
/////////////////////////

router.put("/:pid", async (req, res) => {
  try {
    const updateProd = req.body;
    const updateId = req.params.pid;

    if (!updateProd || !updateId) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    const updatedProduct = await productManager.updateProduct(
      updateId,
      updateProd
    );

    return res.status(200).send({
      status: "success",
      payload: updatedProduct,
    });
  } catch (error) {
    console.log(`Cannot update product with mongoose ${error}`);
  }
});

/////////////////////////
//////DELETE METHOD//////
/////////////////////////

router.delete("/:pid", async (req, res) => {
  try {
    const deleteId = req.params.pid;

    if (!deleteId) {
      return res.status(400).send({
        status: "error",
        error: "Incomplete values",
      });
    }

    let deletedProduct = await productManager.deleteProduct(deleteId);

    if (deletedProduct.deletedCount === 0) {
      return res.status(404).send({
        status: "error",
        error: `Could not delete product. No product found with ID ${deleteId} in the database`,
      });
    }

    return res.status(200).send({
      status: "success",
      payload: deletedProduct,
    });
  } catch (error) {
    console.log(`Cannot delete product with mongoose ${error}`);
  }
});

export default router;
