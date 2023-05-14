import { Router } from "express";

// import CartManager from "../dao/fileManagers/cartManager.js";
import CartManager from "../dao/dbManagers/cartManager.js";

const cartManager = new CartManager();
const router = Router();

/////////////////////////
///////GET METHODS///////
/////////////////////////

router.get("/:cid", async (req, res) => {
  try {
    let cid = req.params.cid;
    let filteredCart = await cartManager.getCartById(cid);

    if (!filteredCart || !cid)
      return res.status(404).send({
        status: "error",
        message: { error: `Incomplete values` },
      });

    return res.status(200).send({
      status: "success",
      payload: filteredCart,
    });
  } catch (error) {
    console.log(`Cannot get cart with mongoose ${error}`);
  }
});

/////////////////////////
///////POST METHODS//////
/////////////////////////

router.post("/", async (req, res) => {
  try {
    let newCart = await cartManager.createCart();
    res.status(201).send({ status: "Success", payload: newCart });
  } catch (error) {
    console.log(error);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const { quantity } = req.body;

    if (!cartId || !productId)
      return res.status(404).send({
        status: "error",
        message: { error: `Incomplete values` },
      });

    const productAddedToCart = await cartManager.addToCart(
      cartId,
      productId,
      quantity
    );

    return res
      .status(201)
      .send({ status: "Success", payload: productAddedToCart });
  } catch (error) {
    console.log(`Cannot add to cart with mongoose ${error}`);
  }
});

export default router;
