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

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active",
    };
    const product = await Product.findOne(find); // find thì là trả về nhiều bản ghi findOne là 1
    console.log(product);
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`);
    req.flash("error", `Không tồn tại sản phẩm này !`);
  }
};
