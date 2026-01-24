const { prefixAdmin } = require("../../config/system");
const ProductCategory = require("../../models/product-category");
const createTreeHelper = require("../../helpers/createTree");
const systemConfig = require("../../config/system");

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
  // const permissions = res.locals.role.permissions;
  // if (permissions.include("products-category_create")) {
  // } else {
  //   return;
  // }  // Kiểm tra xem có quyền sử dụng chức năng tránh dùng posman gắn token vào
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
// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    };

    const data = await ProductCategory.findOne(find);
    const records = await ProductCategory.find({
      deleted: false,
    });
    const Newrecord = createTreeHelper.tree(records);
    res.render("admin/pages/products-category/edit", {
      pageTitle: data.title,
      data: data,
      records: Newrecord,
    });
  } catch (error) {
    res.redirect(` ${systemConfig.prefixAdmin}/products-category`);
    req.flash("error", `Không tồn tại danh mục này !`);
  }
};
// [GET] /admin/product-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const productCategory = await ProductCategory.findOne(find); // find thì là trả về nhiều bản ghi findOne là 1
    res.render("admin/pages/products-category/detail", {
      pageTitle: productCategory.title,
      product: productCategory,
    });
  } catch (error) {
    res.redirect(` ${systemConfig.prefixAdmin}/products-category`);
    req.flash("error", `Không tồn tại danh mục này !`);
  }
};
