const mongoose = require("mongoose");
module.exports.connect = async () => {
  try {
    console.log("MONGO_URL:", process.env.MONGO_URL || "UNDEFINED");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connect database thành công !");
  } catch (error) {
    console.error("Database connect error:", error.message);
    console.log("connect database thất bại !");
  }
};
