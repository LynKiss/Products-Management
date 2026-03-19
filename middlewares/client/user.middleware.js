const User = require("../../models/user.model");
module.exports.infoUser = async (req, res, next) => {
  if (req.cookies.tokenUser) {
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
      status: "active",
    }).select("-password");
    if (user) {
      if (user.statusOnline !== "online") {
        await User.updateOne(
          { _id: user.id },
          { statusOnline: "online" }
        );

        _io.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
          userId: user.id,
          status: "online"
        });

        user.statusOnline = "online";
      }
      res.locals.user = user;
    }
  }
  next();
};
