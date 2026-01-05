const mongoose = require("mongoose");
var slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title", // sinh ra chuỗi url khi load trang web trên đường link sẽ hiển thị cái này
      unique: true, // Tránh bị trùng url (bật )
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true, // Tự thêm thời gian tạo và update
  }
);
const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
