const Cart = require("../../models/cart-model");

// [POST] /cart/:productId
module.exports.index = async (req, res) => {
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
