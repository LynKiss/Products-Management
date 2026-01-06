const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");
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
  //Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue; // tự lấy key tương ứng với value
  } else {
    sort.position = "desc";
  }
  //End sort
  const products = await Product.find(find)
    .sort(sort) // desc là giảm dần asc là tăng dần
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
  req.flash("success", "Cập nhật trạng thái sản phẩm thành công");

  res.redirect(req.get("Referrer") || "/");
};
// [PATCH] /admin/products/change-multi/:status/:id
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length}sản phẩm thành công !`
      );
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length}sản phẩm thành công !`
      );
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        { deleted: "true", deletedAt: new Date() } // Xóa mềm nhiều
      );
      req.flash("success", `Xóa ${ids.length}sản phẩm thành công !`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-"); //Lấy ra chuỗi string xong cắt thành mảng cách nhau bằng dấu "-"
        position = parseInt(position);

        // Validate position is a valid number
        if (isNaN(position)) {
          continue; // Skip invalid entries
        }

        await Product.updateOne(
          { _id: id },
          {
            position: position,
          }
        );
      }
      break;
    default:
      break;
  }
  res.redirect(req.get("Referrer") || "/");
};
// [DELETE] /admin/products/delete/:id
module.exports.deletetItem = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  // await Product.deleteOne({ _id: id });   // Xóa cứng  ( có thể dùng chức năng thùng rác)
  await Product.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() } // Lưu thời gian xóa
  ); // Xóa mềm  ( Khôi phục thì cập nhật lại thành false )
  req.flash("success", `Xóa sản phẩm id :${id} thành công !`);

  res.redirect(req.get("Referrer") || "/");
};
// [GET] /admin/products/Create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create.pug", {
    pageTitle: "Trang thêm sản phẩm",
  });
};
// [POST] /admin/products/Create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1; // nếu không truyền vào vị trí thì tự động đếm bản ghi trong db và tăng 1
  } else {
    req.body.position = parseInt(req.body.position); // Nếu nhập thì chuyển sang int
  }
  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }
  const product = new Product(req.body); // Tạo 1 model sản phẩm
  await product.save(); // Lưu vào database
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};
// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find); // find thì là trả về nhiều bản ghi findOne là 1
    console.log(product);
    res.render("admin/pages/products/edit.pug", {
      pageTitle: "Trang chỉnh sửa sản phẩm",
      product: product,
    });
  } catch (error) {
    res.redirect(` ${systemConfig.prefixAdmin}/products`);
    req.flash("error", `Không tồn tại sản phẩm này !`);
  }
};
// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  try {
    await Product.updateOne(
      {
        _id: req.params.id,
      },
      req.body
    );
    req.flash("success", `Cập nhật thành công !`);
  } catch (error) {
    req.flash("error", `Cập nhật thất bại !`);
  }
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};
// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find); // find thì là trả về nhiều bản ghi findOne là 1
    console.log(product);
    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(` ${systemConfig.prefixAdmin}/products`);
    req.flash("error", `Không tồn tại sản phẩm này !`);
  }
};
