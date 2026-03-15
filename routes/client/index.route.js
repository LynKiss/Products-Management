const productRoutes = require("./products.route");
const homeRoutes = require("./home.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");
const categoryMiddleWare = require("../../middlewares/client/category.middleware");
const cartMiddleWare = require("../../middlewares/client/cart.middleware");
const userMiddleWare = require("../../middlewares/client/user.middleware");
const settingMiddleWare = require("../../middlewares/client/setting.middleware");
const authMiddleWare = require("../../middlewares/client/requireAuth.middleware");
module.exports = (app) => {
  app.use(categoryMiddleWare.category); // dùng cho toàn bộ trang web
  app.use(cartMiddleWare.cartId);
  app.use(userMiddleWare.infoUser);
  app.use(settingMiddleWare.settingGeneral);
  app.use("/", homeRoutes);
  app.use("/cart", cartRoutes);
  app.use("/search", searchRoutes);
  app.use("/products", productRoutes);
  app.use("/checkout", checkoutRoutes);
  app.use("/user", userRoutes);
  app.use("/chat", authMiddleWare.requireAuth, chatRoutes);
};
