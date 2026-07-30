const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const profileController = require("../../controllers/client/user-profile.controller");
const validate = require("../../validates/client/user.validate");
const authMiddleWara = require("../../middlewares/client/requireAuth.middleware");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
router.get("/register", controller.register);
router.post("/register", validate.registerPost, controller.registerPost);
router.get("/login", controller.login);
router.post("/login", validate.loginPost, controller.loginPost);
router.get("/logout", controller.logout);
router.post("/offline", controller.offline);
router.get("/password/forgot", controller.forgotPassword);
router.post(
  "/password/forgot",
  validate.forgotPassword,
  controller.forgotPasswordPost,
);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);
router.get("/password/reset", controller.otpPasswordReset);
router.post(
  "/password/reset",
  validate.forgotPasswordPost,
  controller.otpPasswordResetPost,
);
router.get("/info", authMiddleWara.requireAuth, profileController.info);
router.get("/edit", authMiddleWara.requireAuth, profileController.edit);
router.patch(
  "/edit",
  authMiddleWara.requireAuth,
  upload.single("avatar"),
  uploadCloud.upload,
  profileController.editPatch,
);
router.get(
  "/change-password",
  authMiddleWara.requireAuth,
  profileController.changePassword,
);
router.patch(
  "/change-password",
  authMiddleWara.requireAuth,
  profileController.changePasswordPatch,
);
module.exports = router;
