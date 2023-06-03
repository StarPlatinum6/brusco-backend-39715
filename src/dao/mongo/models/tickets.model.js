import mongoose from "mongoose";

const ticketsCollection = "tickets";

const ticketSchema = new mongoose.Schema({
  products: [
    {
      _id: false,
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
  code: {
    type: String,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    required: true,
  },
  ammount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

ticketSchema.pre("findOne", function () {
  this.populate("products.productId");
});

ticketSchema.pre("find", function () {
  this.populate("products.productId");
});

export const ticketModel = mongoose.model(ticketsCollection, ticketSchema);
