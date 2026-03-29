const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/chat.controller");
const chatMiddleware = require("../../middlewares/client/chat.middleware")
router.get("/:roomChatId", chatMiddleware.isAccess, controller.index);
router.post("/:roomChatId", chatMiddleware.isAccess, controller.sendMessage);

module.exports = router;
