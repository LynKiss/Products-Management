const md5 = require("md5");
const User = require("../../models/user.model");
const { prefixAdmin } = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");

// [GET] /admin/users
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  if (req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i");
    find.$or = [{ fullName: regex }, { email: regex }];
  }

  const users = await User.find(find).sort({ createdAt: "desc" });

  res.render("admin/pages/users/index.pug", {
    pageTitle: "Quan ly user",
    users: users,
    filterStatus: filterStatusHelper(req.query),
    keyword: req.query.keyword || "",
  });
};

// [GET] /admin/users/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/users/create.pug", {
    pageTitle: "Them user",
  });
};

// [POST] /admin/users/create
module.exports.createPost = async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const emailExist = await User.findOne({
    email: email,
    deleted: false,
  });

  if (emailExist) {
    req.flash("error", "Email da ton tai !");
    return res.redirect("back");
  }

  const user = new User({
    fullName: req.body.fullName,
    email: email,
    password: md5(req.body.password),
    phone: req.body.phone,
    avatar: req.body.avatar,
    status: req.body.status,
    requestFriends: [],
    acceptFriends: [],
    friendList: [],
    statusOnline: "offline",
  });

  await user.save();
  req.flash("success", "Tao user thanh cong !");
  res.redirect(`${prefixAdmin}/users`);
};

// [GET] /admin/users/edit/:id
module.exports.edit = async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "User khong ton tai !");
    return res.redirect(`${prefixAdmin}/users`);
  }

  res.render("admin/pages/users/edit.pug", {
    pageTitle: "Sua user",
    userEdit: user,
  });
};

// [PATCH] /admin/users/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  const email = (req.body.email || "").trim().toLowerCase();
  const emailExist = await User.findOne({
    _id: { $ne: id },
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
    status: req.body.status,
  };

  if (req.body.password) {
    dataUpdate.password = md5(req.body.password);
  }

  if (req.body.avatar) {
    dataUpdate.avatar = req.body.avatar;
  }

  await User.updateOne({ _id: id }, dataUpdate);
  req.flash("success", "Cap nhat user thanh cong !");
  res.redirect(`${prefixAdmin}/users`);
};

// [PATCH] /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  await User.updateOne(
    { _id: req.params.id },
    {
      status: req.params.status,
    },
  );

  req.flash("success", "Cap nhat trang thai user thanh cong !");
  res.redirect(req.get("Referrer") || `${prefixAdmin}/users`);
};

// [DELETE] /admin/users/delete/:id
module.exports.deleteItem = async (req, res) => {
  await User.updateOne(
    { _id: req.params.id },
    {
      deleted: true,
      deletedAt: new Date(),
    },
  );

  req.flash("success", "Xoa user thanh cong !");
  res.redirect(req.get("Referrer") || `${prefixAdmin}/users`);
};
