const productRoutes = require("./products.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const categoryMiddleWare = require("../../middlewares/client/category.middleware");
const cartMiddleWare = require("../../middlewares/client/cart.middleware");
module.exports = (app) => {
  app.use(categoryMiddleWare.category); // dùng cho toàn bộ trang web
  app.use(cartMiddleWare.cartId);
  app.use("/", homeRoutes);
  app.use("/cart", cartRoutes);
  app.use("/search", searchRoutes);
  app.use("/products", productRoutes);
};
