const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      expireAt: 180, //sau  s nó hết hạn ( xóa hỏi mongodb )
    },
  },
  {
    timestamps: true,
  },
);
const ForgotPassword = mongoose.model(
  "ForgotPassword",
  forgotPasswordSchema,
  "forgot-password",
);

module.exports = ForgotPassword;
