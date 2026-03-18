const User = require("../../models/user.model")
module.exports = (res) => {
    _io.once("connection", (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;

            // Thêm id của A vào acceptFriend của B
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
            // Thêm id của B vào requestFriend của A
            const exitsIdBinA = await User.findOne({
                _id: myUserId,
                requestFriends: myUserId
            })
            if (!exitsIdBinA) {
                await User.updateOne(
                    { _id: myUserId },
                    { $push: { requestFriends: userId } }
                )
            }
        });
    });
}