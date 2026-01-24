const ProductCategory = require("../../models/product-category");
const createTreeHelper = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
  const productsCategory = await ProductCategory.find({ deleted: false });
  const newProductsCategory = createTreeHelper.tree(productsCategory);
  res.locals.layoutProductsCategory = newProductsCategory;
  next();
};
