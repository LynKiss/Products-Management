/**
 * Middleware để khôi phục hỗ trợ res.redirect('back') cho Express 5
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
module.exports = (req, res, next) => {
  const originalRedirect = res.redirect.bind(res);
  res.redirect = function (statusOrUrl, url) {
    if (statusOrUrl === "back") {
      const referer = req.get("Referrer") || "/";
      return originalRedirect.call(this, referer);
    }
    return originalRedirect.apply(this, arguments);
  };
  next();
};
