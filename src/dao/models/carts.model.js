import mongoose from "mongoose";

const cartsCollection = "carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

cartSchema.pre("findOne", function () {
  this.populate("products.productId");
});

const cartModel = mongoose.model(cartsCollection, cartSchema);

export default cartModel;
