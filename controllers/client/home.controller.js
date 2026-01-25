const productsHelper = require("../../helpers/products");
const Product = require("../../models/product.model");
// [GET] /
module.exports.index = async (req, res) => {
  const newProductsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(3);
  const newProducts = productsHelper.priceNewProducts(newProductsFeatured);
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(3);
  const newProductsNew = productsHelper.priceNewProducts(productsNew);
  // Đổi giảm giá tiền nếu có lấy theo positon tại vì bình thường có thể thay đổi vị trí

  res.render("client/pages/home/index.pug", {
    pageTitle: " Trang chủ ",
    productsFeatured: newProducts,
    productsNew: newProductsNew,
  });
};
