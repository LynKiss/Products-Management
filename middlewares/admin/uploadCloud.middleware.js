const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
module.exports.upload = (req, res, next) => {
  if (req.body && req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      try {
        let result = await streamUpload(req);
        req.body[req.file.fieldname] = result.secure_url; //req.file.fieldname chính là cái thumbnail nếu trong giao diện để cái khác thì sẽ dùng cái ý
        console.log(result);
        next();
      } catch (error) {
        console.error("Upload error:", error);
        req.flash("error", "Upload ảnh thất bại !");
        res.redirect(req.get("Referrer") || "/");
      }
    }
    upload(req);
  } else {
    next();
  }
};
