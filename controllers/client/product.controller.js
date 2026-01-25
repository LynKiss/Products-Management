const productsHelper = require("../../helpers/products");
const productCategoryHelper = require("../../helpers/product-category");
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category");
// [GET] /products
module.exports.index = async (req, res) => {
  const product = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });
  const newProducts = productsHelper.priceNewProducts(product);

  res.render("client/pages/products/index.pug", {
    pageTitle: " Trang sản phẩm",
    products: newProducts,
  });
};

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugProduct,
      status: "active",
    };
    const product = await Product.findOne(find); // find thì là trả về nhiều bản ghi findOne là 1
    if (product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        deleted: false,
        status: "active",
      });
      product.category = category;
    }
    product.priceNew = productsHelper.priceNewProduct(product);
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`);
    req.flash("error", `Không tồn tại sản phẩm này !`);
  }
};
// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({
      slug: req.params.slugCategory,
      status: "active",
      deleted: false,
    });

    if (!category) {
      return res.redirect("/products");
    }

    const listSubCategory = await productCategoryHelper.getSubCategory(
      category.id,
    );
    const listSubCategoryId = listSubCategory.map((item) => item.id);
    const products = await Product.find({
      product_category_id: { $in: [category.id, ...listSubCategoryId] },
      deleted: false,
      status: "active",
    }).sort({ position: "desc" });

    const newProducts = productsHelper.priceNewProducts(products);

    res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: newProducts,
    });
  } catch (error) {
    console.error("Error in productsCategory:", error);
    res.redirect("/products");
  }
};
