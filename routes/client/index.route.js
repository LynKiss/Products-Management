const productRoutes = require("./products.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const categoryMiddleWare = require("../../middlewares/client/category.middleware");
module.exports = (app) => {
  app.use(categoryMiddleWare.category); // dùng cho toàn bộ trang web
  app.use("/", homeRoutes);
  app.use("/search", searchRoutes);
  app.use("/products", productRoutes);
};
