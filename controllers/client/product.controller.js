const Product = require("../../models/product.model");
// [GET] /products
module.exports.index = async (req, res) => {
  const product = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });
  const newProducts = product.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });

  res.render("client/pages/products/index.pug", {
    pageTitle: " Trang sản phẩm",
    products: newProducts,
  });
};
