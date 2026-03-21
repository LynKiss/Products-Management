const RoomChat = require("../../models/rooms-chat.model");


// [GET] /room-chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const rooms = await RoomChat.find({
    "users.user_id": userId,
    deleted: false,
  }).select("title avatar");
  res.render("client/pages/room-chat/index.pug", {
    rooms: rooms,
    pageTitle: "Danh sách phòng",
  });
};
