const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    fieldSize: 10 * 1024 * 1024, // 10MB cho text fields
  },
});
const validate = require("../../validates/admin/product-category.validate");
const controller = require("../../controllers/admin/product-category.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost,
);
router.get("/detail/:id", controller.detail);
module.exports = router;
