const cookieParser = require("cookie-parser");
const session = require("express-session");

module.exports = (app) => {
  app.use(cookieParser("Lyn_Toast"));
  app.use(
    session({
      secret: "Lyn_Toast",
      resave: true,
      saveUninitialized: true,
      cookie: { maxAge: 5 * 60 * 1000 },
    }),
  );

  // Flash messages
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
};
