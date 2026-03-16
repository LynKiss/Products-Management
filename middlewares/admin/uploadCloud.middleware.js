const uploadToCloudinary = require("../../helpers/uploadToCloudinary")
module.exports.upload = async (req, res, next) => {
  if (req.body && req.file) {
    try {
      const cloudResult = await uploadToCloudinary(req.file.buffer);
      req.body[req.file.fieldname] = cloudResult.secure_url || cloudResult.url || cloudResult;
    } catch (error) {
      req.flash("error", "Upload ảnh thất bại !");
      return res.redirect(req.get("Referrer") || "/");
    }
  }
  next();
};
