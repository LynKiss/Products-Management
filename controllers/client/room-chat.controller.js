const RoomChat = require("../../models/rooms-chat.model");
const User = require("../../models/user.model");

const isRoomAdmin = (role) => ["superAdmin", "supperAdmin", "admin"].includes(role);
const isRoomSuperAdmin = (role) => ["superAdmin", "supperAdmin"].includes(role);

// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const rooms = await RoomChat.find({
    typeRoom: "group",
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
    role: "superAdmin"
  })

  const roomChats = new RoomChat(dataRoom);
  await roomChats.save()
  res.redirect(`/chat/${roomChats.id}`);

};

// [PATCH] /rooms-chat/add-users/:roomChatId
module.exports.addUsers = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  const userId = res.locals.user.id;
  const usersId = req.body.usersId
    ? (Array.isArray(req.body.usersId) ? req.body.usersId : [req.body.usersId])
    : [];

  const room = await RoomChat.findOne({
    _id: roomChatId,
    deleted: false,
  });

  if (!room) {
    req.flash("error", "Phong chat khong ton tai !");
    return res.redirect("/rooms-chat");
  }

  const myInfo = room.users.find((item) => item.user_id === userId);

  if (!myInfo || !isRoomAdmin(myInfo.role)) {
    req.flash("error", "Ban khong co quyen them thanh vien !");
    return res.redirect(`/chat/${roomChatId}`);
  }

  const currentUserIds = room.users.map((item) => item.user_id);
  const newUsers = usersId
    .filter((id) => !currentUserIds.includes(id))
    .map((id) => ({
      user_id: id,
      role: "user",
    }));

  if (newUsers.length > 0) {
    await RoomChat.updateOne(
      { _id: roomChatId },
      {
        $push: {
          users: {
            $each: newUsers,
          },
        },
      },
    );
  }

  req.flash("success", "Them thanh vien thanh cong !");
  res.redirect(`/chat/${roomChatId}`);
};

// [PATCH] /rooms-chat/change-role/:roomChatId/:userId
module.exports.changeRole = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  const memberId = req.params.userId;
  const myUserId = res.locals.user.id;

  const room = await RoomChat.findOne({
    _id: roomChatId,
    deleted: false,
  });

  if (!room) {
    req.flash("error", "Phong chat khong ton tai !");
    return res.redirect("/rooms-chat");
  }

  const myInfo = room.users.find((item) => item.user_id === myUserId);

  if (!myInfo || !isRoomSuperAdmin(myInfo.role)) {
    req.flash("error", "Chi truong phong moi duoc cap quyen admin !");
    return res.redirect(`/chat/${roomChatId}`);
  }

  await RoomChat.updateOne(
    {
      _id: roomChatId,
      "users.user_id": memberId,
    },
    {
      "users.$.role": "admin",
    },
  );

  req.flash("success", "Cap quyen admin thanh cong !");
  res.redirect(`/chat/${roomChatId}`);
};

// [DELETE] /rooms-chat/delete/:roomChatId
module.exports.deleteRoom = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  const userId = res.locals.user.id;
  const room = await RoomChat.findOne({
    _id: roomChatId,
    deleted: false,
  });

  if (!room) {
    req.flash("error", "Phong chat khong ton tai !");
    return res.redirect("/rooms-chat");
  }

  const myInfo = room.users.find((item) => item.user_id === userId);

  if (!myInfo || !isRoomSuperAdmin(myInfo.role)) {
    req.flash("error", "Chi truong phong moi duoc xoa phong chat !");
    return res.redirect(`/chat/${roomChatId}`);
  }

  await RoomChat.updateOne(
    { _id: roomChatId },
    {
      deleted: true,
      deletedAt: new Date(),
    },
  );

  req.flash("success", "Xoa phong chat thanh cong !");
  res.redirect("/rooms-chat");
};
