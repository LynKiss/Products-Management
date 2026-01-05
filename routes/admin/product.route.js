const express = require("express");
const router = express.Router();
const multer = require("multer");
const storageMuler = require("../../helpers/storage");
const upload = multer({ storage: storageMuler() });
const controller = require("../../controllers/admin/product.controller");
router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deletetItem);
router.get("/create", controller.create); // Phương thức trả về giao diện
router.post("/create", upload.single("thumbnail"), controller.createPost); // upload.single("thumbnail") upload ảnh

module.exports = router;
