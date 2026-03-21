const RoomChat = require("../../models/rooms-chat.model");
const User = require("../../models/user.model");


// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const rooms = await RoomChat.find({
    "users.user_id": userId,
    deleted: false,
  }).select("title avatar");
  res.render("client/pages/rooms-chat/index.pug", {
    rooms: rooms,
    pageTitle: "Danh sách phòng",
  });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendList = res.locals.user.friendList;
  for (const friend of friendList) {
    const infoFriend = await User.findOne({
      _id: friend.user_id,
      deleted: false
    }).select("fullName avatar")

    friend.infoFriend = infoFriend;
  };
  res.render("client/pages/rooms-chat/create.pug", {
    pageTitle: " Tạo phòng chat",
    friendList: friendList
  });
};
// [POST] /rooms-chat/createPost
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const usersId = req.body.usersId
    ? (Array.isArray(req.body.usersId) ? req.body.usersId : [req.body.usersId])
    : [];

  const dataRoom = {
    title: title,
    typeRoom: "group",
    users: []
  };
  for (const userId of usersId) {
    dataRoom.users.push({
      user_id: userId,
      role: "user"
    })
  }
  dataRoom.users.push({
    user_id: res.locals.user.id,
    role: "supperAdmin"
  })

  const roomChats = new RoomChat(dataRoom);
  await roomChats.save()
  res.redirect(`/chat/${roomChats.id}`);

};
