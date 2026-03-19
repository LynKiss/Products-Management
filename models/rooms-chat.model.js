const mongoose = require("mongoose");
const roomChatSchema = new mongoose.Schema(
    {
        title: String,
        avatar: String,
        typeRoom: String,
        status: String,// ví dụ như chỉ có trưởng được chat , khóa phòng vv...
        user: [
            {
                user_id: String,
                role: String
            }
        ],
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    },
);
const RoomChat = mongoose.model("RoomChat", roomChatSchema, "rooms-chat");

module.exports = RoomChat;
