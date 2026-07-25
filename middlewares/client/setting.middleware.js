const SettingGeneral = require("../../models/settings-general.model");

const defaultSettingGeneral = {
  websiteName: "Products Management",
  logo: "/image/logo.png",
  copyright: "",
};

module.exports.settingGeneral = async (req, res, next) => {
  try {
    const settingGeneral = await SettingGeneral.findOne({}).lean();

    res.locals.settingGeneral = {
      ...defaultSettingGeneral,
      ...(settingGeneral || {}),
    };

    next();
  } catch (error) {
    next(error);
  }
};
