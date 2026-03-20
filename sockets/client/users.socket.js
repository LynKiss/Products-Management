const User = require("../../models/user.model")
const RoomChat = require("../../models/rooms-chat.model")
module.exports = (res) => {
    _io.once("connection", (socket) => {
        // Chức năng gửi yêu cầu 
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            // myUserId : id của B
            // userId : id của A
            // Thêm id của A vào acceptFriends của B
            const exitsIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })

            if (!exitsIdAinB) {
                await User.updateOne({
                    _id: userId
                }, {
                    $push: { acceptFriends: myUserId }
                }
                );
            }
            // Thêm id của B vào requestFriends của A
            const exitsIdBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if (!exitsIdBinA) {
                await User.updateOne(
                    { _id: myUserId },
                    { $push: { requestFriends: userId } }
                )
            }
            // Lấy độ dài acceptFriends của B trả về cho B
            const infoUserB = await User.findOne({
                _id: userId
            })
            const lengthAcceptFriends = infoUserB.acceptFriends.length
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            })
            const infoUserA = await User.findOne({
                _id: myUserId
            }).select("_id avatar fullName")
            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userId: userId,
                infoUserA: infoUserA,
                lengthAcceptFriends: lengthAcceptFriends
            })
        });

        // Chức năng hủy gửi yêu cầu
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // myUserId : id của B
            // userId : id của A

            // Xóa id của A vào acceptFriends của B
            const exitsIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })

            if (exitsIdAinB) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: { acceptFriends: myUserId }
                }
                );
            }
            // Xóa id của B vào requestFriends của A
            const exitsIdBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if (exitsIdBinA) {
                await User.updateOne(
                    { _id: myUserId },
                    { $pull: { requestFriends: userId } }
                )
            }
            // Lấy độ dài acceptFriends của B trả về cho B
            const infoUserB = await User.findOne({
                _id: userId
            })
            const lengthAcceptFriends = infoUserB.acceptFriends.length
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            })

            // Lấy Id của A trả về cho B
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_ACCEPT_FRIEND", {
                userIdB: userId,
                userIdA: myUserId
            })
        });

        // Chức năng từ chối kết bạn
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // myUserId : id của B
            // userId : id của A

            // Xóa id của A vào acceptFriends của B
            const exitsIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })

            if (exitsIdAinB) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: { acceptFriends: userId }
                }
                );
            }
            // Xóa id của B vào requestFriends của A
            const exitsIdBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            if (exitsIdBinA) {
                await User.updateOne(
                    { _id: userId },
                    { $pull: { requestFriends: myUserId } }
                )
            }
        });

        // Chức năng chấp nhận kết bạn
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // myUserId : id của B
            // userId : id của A

            // Check xem có tồn tại trong danh sách của nhau không 
            const exitsIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            const exitsIdBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })

            //Tạo phòng chat chung cho 2 người 
            let roomChat;
            if (exitsIdAinB && exitsIdBinA) {

                const dataRoom = {
                    typeRoom: "friend",
                    users: [
                        {
                            user_id: userId,
                            role: "superAdmin"
                        },
                        {
                            user_id: myUserId,
                            role: "superAdmin"
                        }
                    ],

                }
                roomChat = new RoomChat(dataRoom);
                await roomChat.save();

            }


            // Xóa id của A vào acceptFriends của B


            if (exitsIdAinB) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: {
                        acceptFriends: userId
                    }
                }
                );
            }
            // Xóa id của B vào requestFriends của A

            if (exitsIdBinA) {
                await User.updateOne(
                    { _id: userId },
                    {
                        $push: {
                            friendList: {
                                user_id: myUserId,
                                room_chat_id: roomChat.id
                            }
                        },
                        $pull: {
                            requestFriends: myUserId
                        }
                    }
                )
            }
        });

    });
}
