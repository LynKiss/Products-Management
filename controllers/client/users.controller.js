const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket")
// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
    // SOCKET
    usersSocket(res);
    // END SOCKET
    const userId = res.locals.user.id;

    const myUser = await User.findOne({
        _id: userId
    });
    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;
    const users = await User.find({
        $and: [
            { _id: { $ne: userId } },
            { _id: { $nin: requestFriends } },
            { _id: { $nin: acceptFriends } }
        ],

        status: "active",
        deleted: false
    }).select("id avatar fullName");

    res.render("client/pages/users/not-friend.pug", {
        pageTitle: "Danh sách người dùng",
        users: users
    });
};

// [GET] /user/request
module.exports.register = async (req, res) => {
  res.render("client/pages/user/request", {
    pageTitle: "Lời mời đã gửi",
  });
};