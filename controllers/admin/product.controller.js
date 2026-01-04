const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
// [GET] /admin/products
module.exports.index = async (req, res) => {
  // Bộ lọc cắt sang helpers
  const filterStatus = filterStatusHelper(req.query);
  let find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  // Pagination
  const countProducts = await Product.countDocuments(find); // hàm tính số lượng sản phẩm trong mongodb
  let objectPagination = paginationHelper(
    {
      curruntPage: 1,
      limitItems: 4,
    },
    req.query,
    countProducts
  );
  const products = await Product.find(find)
    .limit(objectPagination.limitItems) // limit số sản phẩm mỗi trang
    .skip(objectPagination.skip); // bỏ qua số lượng sản phẩm này
  res.render("admin/pages/products/index", {
    pageTitle: "Trang danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination, // Truyền ra giao diện pagination
  });
};
// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  const result = await Product.updateOne({ _id: id }, { status: status });

  res.redirect("/admin/products");
};
