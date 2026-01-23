const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");
const { prefixAdmin } = require("../../config/system");
const systemConfig = require("../../config/system");
// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  res.render("admin/pages/auth/login", {
    pageTitle: "Trang đăng nhập",
  });
};
// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await Account.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", `tài khoản có email này không tồn tại !`);
    res.redirect(`${prefixAdmin}/auth`);
  }

  if (md5(password) != user.password) {
    req.flash("error", `Mật khẩu không chính xác!`);
    res.redirect(`${prefixAdmin}/auth`);
  }
  if (user.status != "active") {
    req.flash("error", `Tài khoản đã bị khóa !`);
    res.redirect(`${prefixAdmin}/auth`);
  }
  res.cookie("token", user.token);
  res.redirect(`${prefixAdmin}/dashboard`);
};
