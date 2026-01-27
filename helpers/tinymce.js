const path = require("path");

module.exports = (app) => {
  app.use(
    "/tinymce",
    require("express").static(
      path.join(__dirname, "..", "node_modules", "tinymce"),
    ),
  );
};
