const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/checkout.controller");
router.get("/", controller.index);
router.post("/order", controller.oder);
router.get("/success/:oderId", controller.success);
module.exports = router;
