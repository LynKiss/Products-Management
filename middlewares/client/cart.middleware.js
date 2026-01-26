const Cart = require("../../models/cart-model");
module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Cart();
    await cart.save();
    const expiresCookies = 365 * 24 * 60 * 60 * 1000;
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresCookies), // sau này tối ưu khi đăng nhập mới lưu vào db tránh bị spam
      // có thể lưu sản phẩm trong giỏ hàng thay cho cart id thành 1 chuỗi json để lưu vào db
      // lưu ip của sản phẩm dùng js để xử lý tránh spam ( tạo thêm model thêm vào db , mỗi lần web load web lại kiểm tra ip đó)
    });
  } else {
    const cart = await Cart.findOne({
      _id: req.cookies.cartId,
    });
    cart.totalQuantity = cart.products.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    res.locals.miniCart = cart;
  }
  next();
};
