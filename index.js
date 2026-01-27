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

// Helpers
const redirectBack = require("./helpers/redirect-back");
const sessionHelper = require("./helpers/session");
const tinymceHelper = require("./helpers/tinymce");

database.connect();
app = express();

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

route(app);
routeAdmin(app);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
