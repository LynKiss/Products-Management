const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const { prefixAdmin } = require("../../config/system");
const systemConfig = require("../../config/system");
const md5 = require("md5");

// [GET] /admin/account
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

// [GET] /admin/account/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({ deleted: false });
  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo tài khoản",
    roles: roles,
  });
};
// [POST] /admin/account/create
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
