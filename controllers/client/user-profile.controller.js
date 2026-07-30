const md5 = require("md5");
const User = require("../../models/user.model");

// [GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/profile-info.pug", {
    pageTitle: "Thong tin tai khoan",
  });
};

// [GET] /user/edit
module.exports.edit = async (req, res) => {
  res.render("client/pages/user/edit.pug", {
    pageTitle: "Cap nhat thong tin",
  });
};

// [PATCH] /user/edit
module.exports.editPatch = async (req, res) => {
  const userId = res.locals.user.id;
  const email = (req.body.email || "").trim().toLowerCase();

  const emailExist = await User.findOne({
    _id: { $ne: userId },
    email: email,
    deleted: false,
  });

  if (emailExist) {
    req.flash("error", "Email da ton tai !");
    return res.redirect("back");
  }

  const dataUpdate = {
    fullName: req.body.fullName,
    email: email,
    phone: req.body.phone,
  };

  if (req.body.avatar) {
    dataUpdate.avatar = req.body.avatar;
  }

  await User.updateOne({ _id: userId }, dataUpdate);
  req.flash("success", "Cap nhat thong tin thanh cong !");
  res.redirect("/user/info");
};

// [GET] /user/change-password
module.exports.changePassword = async (req, res) => {
  res.render("client/pages/user/change-password.pug", {
    pageTitle: "Doi mat khau",
  });
};

// [PATCH] /user/change-password
module.exports.changePasswordPatch = async (req, res) => {
  const userId = res.locals.user.id;
  const oldPassword = req.body.oldPassword || "";
  const newPassword = req.body.newPassword || "";
  const confirmPassword = req.body.confirmPassword || "";

  const user = await User.findOne({
    _id: userId,
    deleted: false,
  });

  if (!user || user.password !== md5(oldPassword)) {
    req.flash("error", "Mat khau cu khong chinh xac !");
    return res.redirect("back");
  }

  if (newPassword !== confirmPassword) {
    req.flash("error", "Xac nhan mat khau khong khop !");
    return res.redirect("back");
  }

  await User.updateOne(
    { _id: userId },
    {
      password: md5(newPassword),
    },
  );

  req.flash("success", "Doi mat khau thanh cong !");
  res.redirect("/user/info");
};
