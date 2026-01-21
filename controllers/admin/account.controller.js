const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const { prefixAdmin } = require("../../config/system");
const systemConfig = require("../../config/system");
const md5 = require("md5");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Account.find(find).select("-password-token");
  for (const record of records) {
    const role = await Role.findOne({ deleted: false, _id: record.role_id });
    record.role = role; // gắn thêm cái role vừa lấy từ db vào record (obj)
  }
  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sách tài khoản",

    records: records,
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({ deleted: false });
  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo tài khoản",
    roles: roles,
  });
};
// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExits = await Account.findOne({
    deleted: false,
    email: req.body.email,
  });
  if (emailExits) {
    req.flash("error", `tài khoản có email này đã tồn tại !`);
    res.redirect(`${prefixAdmin}/accounts/create`);
  } else {
    req.body.password = md5(req.body.password);

    const records = new Account(req.body);
    await records.save();

    res.redirect(`${prefixAdmin}/accounts`);
  }
};
// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let find = {
      deleted: false,
      _id: id,
    };
    const data = await Account.findOne(find);
    const roles = await Role.find({ deleted: false });
    res.render("admin/pages/accounts/edit", {
      pageTitle: "Sửa tài khoản",
      data: data,
      roles: roles,
    });
  } catch (error) {}
};
// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const emailExits = await Account.findOne({
    _id: { $ne: id }, // tìm không bằng id này ( loại bỏ trường hợp)
    deleted: false,
    email: req.body.email,
  });
  if (emailExits) {
    req.flash("error", `tài khoản có email này đã tồn tại !`);
    res.redirect(`${prefixAdmin}/accounts/create`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    try {
      const id = req.params.id;
      await Account.updateOne({ _id: id }, req.body);
      req.flash("success", `Cập nhật thành công !`);
    } catch (error) {
      req.flash("error", `Cập nhật thất bại !`);
    }
  }
  res.redirect(`${prefixAdmin}/accounts`);
};
