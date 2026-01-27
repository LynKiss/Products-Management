const mongoose = require("mongoose");
const oderSchema = new mongoose.Schema(
  {
    // user_id: String,
    cart_id: String,
    userInfo: {
      fullName: String,
      phone: String,
      address: String,
    },
    products: [
      {
        product_id: String,
        price: Number,
        discountPercentage: Number,
        quantity: Number,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);

const Oder = mongoose.model("Oder", oderSchema, "oders");

module.exports = Oder;
