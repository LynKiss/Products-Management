const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const chatSocket = require("../../sockets/client/chat.socket")

// [GET] /chat
module.exports.index = async (req, res) => {
  const roomChatId = req.params.roomChatId
  chatSocket(req , res);
  // Lấy data trong db 
  const chats = await Chat.find({
    room_chat_id: roomChatId,
    deleted: false
  })
  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id
    }).select("fullName")
    chat.infoUser = infoUser
  }
  //  End
  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
    roomChatId: roomChatId
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
        message: "Noi dung tin nhan dang rong."
      });
    }

    return res.redirect(`/chat/${roomChatId}`);
  }

  const chat = new Chat({
    user_id: res.locals.user.id,
    content: content,
    images: [],
    room_chat_id: roomChatId
  });

  await chat.save();

  if (global._io) {
    global._io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
      userId: res.locals.user.id,
      fullName: res.locals.user.fullName,
      content: content,
      images: []
    });
  }

  if (wantsJson) {
    return res.json({
      success: true,
      message: {
        userId: res.locals.user.id,
        fullName: res.locals.user.fullName,
        content: content,
        images: []
      }
    });
  }

  return res.redirect(`/chat/${roomChatId}`);
};
