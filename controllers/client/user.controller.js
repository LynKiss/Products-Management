const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password");
const generateHepler = require("../../helpers/generate");
const sendMailHepler = require("../../helpers/sendMail");
const md5 = require("md5");
const fs = require("fs");
const path = require("path");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register.pug", {
    pageTitle: "Đăng ký tài khoản",
  });
};
// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login.pug", {
    pageTitle: "Đăng nhập tài khoản",
  });
};
// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({ email: req.body.email });
  if (existEmail) {
    req.flash("error", `Email đã tồn tại !`);
    res.redirect(`back`);
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};
// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", `Email không tồn tại !`);
    res.redirect("/");
  }
  if (md5(password) != user.password) {
    req.flash("error", `Mật khẩu không chính xác!`);
    res.redirect("/");
  }
  if (user.status == "inactive") {
    req.flash("error", `Tài khoản đang bị khỏa !`);
    res.redirect("/");
  }
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};
// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};
// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgotPassword.pug", {
    pageTitle: "Quên mật khẩu",
  });
};
// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const otp = generateHepler.generateRandomNumber(8);
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    req.flash("error", `Email không tồn tại !`);
    res.redirect(`back`);
    return;
  }
  //Lưu thông tin vào db ( có thể tạo thêm 1 bảng để lưu time mới reset otp)
  const objectFogotPassword = {
    email: email,
    otp: otp,
    expiresAt: Date.now(),
  };
  const forgotPassword = new ForgotPassword(objectFogotPassword);
  await forgotPassword.save();
  //Nếu tồn tại user gửi opt qua email ( thêm kiểm tra nếu có email rồi thì không cho gửi otp liên tục)
  const subject = "Mã OTP xác minh lấy lại mật khẩu ";
  // đọc file html template
  const templatePath = path.join(__dirname, "../../templates/otp-email.html");
  let html = fs.readFileSync(templatePath, "utf8");
  // thay OTP vào template
  html = html.replace("{{OTP}}", otp);
  sendMailHepler.sendMail(email, subject, html);
  res.redirect(`/user/password/otp?email=${email}`);
};
// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password.pug", {
    pageTitle: "Nhập mã otp",
    email: email,
  });
};
// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    req.flash("error", `OTP không chính xác !`);
    res.redirect(`back`);
    return;
  }
  const user = await User.findOne({ email: email });
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/user/password/reset");
};
// [GET] /user/password/reset
module.exports.otpPasswordReset = async (req, res) => {
  res.render("client/pages/user/reset-password.pug", {
    pageTitle: "Đổi mật khẩu",
  });
};
// [POST] /user/password/reset
module.exports.otpPasswordResetPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;
  await User.updateOne(
    { tokenUser: tokenUser },
    {
      password: md5(password),
    },
  );
  res.redirect("/");
};
