const systemConfig = require("../../config/system");
const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
module.exports = (app) => {
  const PATH_AADMIN = systemConfig.prefixAdmin;
  app.use(PATH_AADMIN + "/dashboard", dashboardRoutes);
  app.use(PATH_AADMIN + "/products", productRoutes);
};
