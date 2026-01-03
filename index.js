const express = require("express");
require("dotenv").config();
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const database = require("./config/database");
const systemConfig = require("./config/system");
database.connect();
app = express();
const port = process.env.PORT;

app.set("views", "./views"); // cấu hình pug
app.set("view engine", "pug");
app.use(express.static("public")); // Sử dụng được những file tĩnh trong này có thể public ra bên ngoài
// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
route(app);
routeAdmin(app);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
