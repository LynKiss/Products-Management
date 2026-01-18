const { prefixAdmin } = require("../../config/system");
const ProductCategory = require("../../models/product-category");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);
  const Newrecord = createTreeHelper.tree(records);
  res.render("admin/pages/products-category/index", {
    pageTitle: "Trang danh mục sản phẩm ",
    records: Newrecord,
  });
};
// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);
  const Newrecord = createTreeHelper.tree(records); // truyền vào arr và cả parenId ở create tree để tạo ra thằng con trong thằng cha
  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục sản phẩm ",
    records: Newrecord,
  });
};
// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (!req.body.position || req.body.position == "") {
    const countProductCategory = await ProductCategory.countDocuments();
    req.body.position = countProductCategory + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  const productCategory = new ProductCategory(req.body);
  await productCategory.save();
  res.redirect(`${prefixAdmin}/products-category`);
};
