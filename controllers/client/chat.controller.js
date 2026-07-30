const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");
const chatSocket = require("../../sockets/client/chat.socket");

const isRoomAdmin = (role) => ["superAdmin", "supperAdmin", "admin"].includes(role);
const isRoomSuperAdmin = (role) => ["superAdmin", "supperAdmin"].includes(role);

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  chatSocket(req, res);

  const roomChat = await RoomChat.findOne({
    _id: roomChatId,
    deleted: false,
  });

  const myInfo = roomChat.users.find((item) => item.user_id === res.locals.user.id);
  const memberIds = roomChat.users.map((item) => item.user_id);
  const members = await User.find({
    _id: { $in: memberIds },
    deleted: false,
  }).select("fullName avatar statusOnline");

  for (const member of members) {
    const infoInRoom = roomChat.users.find((item) => item.user_id === member.id);
    member.roleInRoom = infoInRoom ? infoInRoom.role : "user";
  }

  const friendIds = (res.locals.user.friendList || []).map((item) => item.user_id);
  const usersCanAdd = await User.find({
    _id: {
      $in: friendIds,
      $nin: memberIds,
    },
    deleted: false,
    status: "active",
  }).select("fullName avatar");

  const chats = await Chat.find({
    room_chat_id: roomChatId,
    deleted: false,
  });

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");
    chat.infoUser = infoUser;
  }

  res.render("client/pages/chat/index", {
    pageTitle: roomChat.title || "Chat",
    chats: chats,
    roomChatId: roomChatId,
    roomChat: roomChat,
    members: members,
    usersCanAdd: usersCanAdd,
    isRoomAdmin: isRoomAdmin(myInfo.role),
    isRoomSuperAdmin: isRoomSuperAdmin(myInfo.role),
  });
};

// [POST] /chat/:roomChatId
module.exports.sendMessage = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  const content = (req.body.content || "").trim();
  const wantsJson =
    req.xhr ||
    req.get("x-requested-with") === "XMLHttpRequest" ||
    req.accepts(["html", "json"]) === "json";

  if (!content) {
    if (wantsJson) {
      return res.status(400).json({
        success: false,
        message: "Noi dung tin nhan dang rong.",
      });
    }

    return res.redirect(`/chat/${roomChatId}`);
  }

  const chat = new Chat({
    user_id: res.locals.user.id,
    content: content,
    images: [],
    room_chat_id: roomChatId,
  });

  await chat.save();

  if (global._io) {
    global._io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
      userId: res.locals.user.id,
      fullName: res.locals.user.fullName,
      content: content,
      images: [],
    });
  }

  if (wantsJson) {
    return res.json({
      success: true,
      message: {
        userId: res.locals.user.id,
        fullName: res.locals.user.fullName,
        content: content,
        images: [],
      },
    });
  }

  return res.redirect(`/chat/${roomChatId}`);
};
