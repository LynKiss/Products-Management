const mongoose = require("mongoose");
const settingGeneralSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: Number,
    email: String,
    address: String,
    copyright: String,
  },
  {
    timestamps: true,
  },
);
const SettingGeneral = mongoose.model(
  "SettingGeneral",
  settingGeneralSchema,
  "setting-general",
);

module.exports = SettingGeneral;
