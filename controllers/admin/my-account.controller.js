// [GET] /admin/my-account
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");
const { prefixAdmin } = require("../../config/system");
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: " Trang thông tin cá nhân",
  });
};
// [GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
  res.render("admin/pages/my-account/edit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
  });
};
// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;
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
      await Account.updateOne({ _id: id }, req.body);
      req.flash("success", `Cập nhật thành công !`);
    } catch (error) {
      req.flash("error", `Cập nhật thất bại !`);
    }
  }
  res.redirect(`${prefixAdmin}/my-account`);
};
