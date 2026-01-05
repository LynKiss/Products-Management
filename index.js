const express = require("express");
var methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash"); // import thư viện thông báo
const cookieParser = require("cookie-parser"); // import thư viện thông báo
const session = require("express-session"); // import thư viện thông báo

require("dotenv").config();
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system");
database.connect();
app = express();

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded());

//flast
app.use(cookieParser("Lyn_Toast"));
app.use(
  session({
    secret: "Lyn_Toast",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 5 * 60 * 1000 },
  })
);

// Custom flash middleware (compatible với Express 5)
app.use((req, res, next) => {
  // Khởi tạo flash object trong session nếu chưa có
  if (!req.session.flash) {
    req.session.flash = {};
  }

  // Lưu flash messages hiện tại để hiển thị
  const currentFlash = req.session.flash;

  // Hàm flash message (gắn vào cả req và res để tương thích với code cũ)
  const flashMessage = (type, message) => {
    req.session.flash[type] = req.session.flash[type] || [];
    req.session.flash[type].push(message);
  };

  req.flash = flashMessage;
  res.locals.flash = flashMessage;

  // Lấy messages cho view (từ flash messages của request hiện tại)
  res.locals.messages = {
    success: currentFlash.success || [],
    error: currentFlash.error || [],
  };

  // Xóa flash messages SAU KHI đã đọc (để chỉ hiển thị 1 lần)
  req.session.flash = {};

  next();
});

//End flast
const port = process.env.PORT;
app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));
app.locals.prefixAdmin = systemConfig.prefixAdmin;
route(app);
routeAdmin(app);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
