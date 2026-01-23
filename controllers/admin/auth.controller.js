const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");
const { prefixAdmin } = require("../../config/system");
const systemConfig = require("../../config/system");
// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  if (req.cookies.token) {
    const user = await Account.findOne({ token: req.cookies.token });
    if (!user) {
      res.clearCookie("token");
      res.redirect(`${prefixAdmin}/auth/login`);
    } else {
      res.redirect(`${prefixAdmin}/dashboard`);
    }
  } else {
    res.render("admin/pages/auth/login", {
      pageTitle: "Trang đăng nhập",
    });
  }
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
    res.redirect(`${prefixAdmin}/auth/login`);
  }

  if (md5(password) != user.password) {
    req.flash("error", `Mật khẩu không chính xác!`);
    res.redirect(`${prefixAdmin}/auth/login`);
  }
  if (user.status != "active") {
    req.flash("error", `Tài khoản đã bị khóa !`);
    res.redirect(`${prefixAdmin}/auth/login`);
  }
  res.cookie("token", user.token);
  res.redirect(`${prefixAdmin}/dashboard`);
};
// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect(`${prefixAdmin}/auth/login`);
};
