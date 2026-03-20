const express = require("express");
var methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const moment = require("moment");
var path = require("path");

require("dotenv").config();
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system");
const User = require("./models/user.model");

// Helpers
const redirectBack = require("./helpers/redirect-back");
const sessionHelper = require("./helpers/session");
const tinymceHelper = require("./helpers/tinymce");

database.connect();
app = express();
// SocketIO
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const onlineUsers = new Map();
const offlineTimeouts = new Map();

const getTokenUserFromCookie = (cookieHeader = "") => {
  const cookies = cookieHeader.split(";").map((item) => item.trim());
  const tokenCookie = cookies.find((item) => item.startsWith("tokenUser="));

  if (!tokenCookie) return "";

  return decodeURIComponent(tokenCookie.split("=")[1] || "");
};

io.on("connection", async (socket) => {
  const tokenUser = getTokenUserFromCookie(socket.handshake.headers.cookie);

  if (!tokenUser) return;

  const user = await User.findOne({
    tokenUser: tokenUser,
    deleted: false,
    status: "active"
  }).select("id statusOnline");

  if (!user) return;

  if (offlineTimeouts.has(user.id)) {
    clearTimeout(offlineTimeouts.get(user.id));
    offlineTimeouts.delete(user.id);
  }

  const currentConnections = onlineUsers.get(user.id) || 0;
  onlineUsers.set(user.id, currentConnections + 1);

  if (currentConnections === 0) {
    await User.updateOne({
      _id: user.id
    }, {
      statusOnline: "online"
    });

    io.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
      userId: user.id,
      status: "online"
    });
  }

  socket.on("disconnect", () => {
    const activeConnections = onlineUsers.get(user.id) || 0;

    if (activeConnections <= 1) {
      onlineUsers.delete(user.id);
    } else {
      onlineUsers.set(user.id, activeConnections - 1);
    }

    const timeoutId = setTimeout(async () => {
      if (onlineUsers.has(user.id)) return;

      await User.updateOne({
        _id: user.id
      }, {
        statusOnline: "offline"
      });

      io.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
        userId: user.id,
        status: "offline"
      });

      offlineTimeouts.delete(user.id);
    }, 2000);

    offlineTimeouts.set(user.id, timeoutId);
  });
});
global._io = io; // gắn cho toàn bộ server sử dụng được biến này
// End SocketIO
// Middleware helpers
app.use(redirectBack);
sessionHelper(app);
tinymceHelper(app);

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded());
const port = process.env.PORT;
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`));
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

route(app); // route user
routeAdmin(app); // route admin
app.get(/.*/, (req, res) => {
  res.render("client/pages/errors/404.pug", {
    pageTitle: "404 Not Found",
  });
});
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
