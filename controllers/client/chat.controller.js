// [GET] /chat
module.exports.index = async (req, res) => {
  _io.on("connection", (socket) => {
    console.log("a user connected");
  });
  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
  });
};
