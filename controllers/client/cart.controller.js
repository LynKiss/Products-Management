const Cart = require("../../models/cart-model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
// [GET] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({ _id: cartId });
  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
      }).select("title thumbnail slug price discountPercentage");
      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
      item.productInfo = productInfo;
      item.totalPrice = productInfo.priceNew * item.quantity;
    }
  }
  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0,
  );
  res.render("client/pages/cart/index", {
    pageTitle: " Giỏ hàng ",
    cartDetail: cart,
  });
};

// [POST] /cart/:productId
module.exports.addCart = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId,
  });
  const exitsProductInCart = cart.products.find(
    (item) => item.product_id == productId,
  );
  if (exitsProductInCart) {
    const quantityNew = quantity + exitsProductInCart.quantity;
    await Cart.updateOne(
      { _id: cartId, "products.product_id": productId },
      {
        $set: {
          "products.$.quantity": quantityNew,
        },
      },
    );
  } else {
    const objCart = {
      product_id: productId,
      quantity: quantity,
    };
    await Cart.updateOne(
      {
        _id: cartId,
      },
      { $push: { products: objCart } },
    );
  }

  req.flash("success", `Thêm vào giỏ hàng thành công !`);
  res.redirect(`/products`);
};
