const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/room-chat.controller");
router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.createPost);
router.patch("/add-users/:roomChatId", controller.addUsers);
router.patch("/change-role/:roomChatId/:userId", controller.changeRole);
router.delete("/delete/:roomChatId", controller.deleteRoom);

module.exports = router;
