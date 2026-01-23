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
  }),
);
app.use((req, res, next) => {
  if (!req.session.flash) {
    req.session.flash = {};
  }
  const currentFlash = req.session.flash;
  const flashMessage = (type, message) => {
    req.session.flash[type] = req.session.flash[type] || [];
    req.session.flash[type].push(message);
  };

  req.flash = flashMessage;
  res.locals.flash = flashMessage;
  res.locals.messages = {
    success: currentFlash.success || [],
    error: currentFlash.error || [],
  };
  req.session.flash = {};
  next();
});
//End flast
//TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce")),
);
//End TinyMCE
const port = process.env.PORT;
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.use(express.static(`${__dirname}/public`));
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
route(app);
routeAdmin(app);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
