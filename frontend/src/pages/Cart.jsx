// src/pages/Cart.jsx
import React, { useContext, useState } from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { ShopContext } from "../context/ShopContext.jsx";
import { Link } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    updateCartQuantity,
    removeFromCart,
    currency,
    delivery_fee,
  } = useContext(ShopContext);

  const [promoCode, setPromoCode] = useState("");

  // derived totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 999 ? 0 : subtotal === 0 ? 0 : delivery_fee || 50;
  const discount = promoCode === "SPECIAL10" ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;
  const itemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // 🧺 Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-4" />
          <h2 className="text-3xl font-serif text-gray-800 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add some beautiful items to your cart
          </p>
          <Link
            to="/collection"
            className="inline-block bg-gray-700 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors no-underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <h1 className="text-4xl font-serif text-gray-800 mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-pink-100 rounded-lg shadow-sm overflow-hidden">
              {cartItems.map((item, idx) => (
                <div
                  key={item.key || `${item.id}-${item.size || "default"}`}
                  className={`p-6 ${
                    idx !== cartItems.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Image links to product page */}
                    <Link
                      to={`/product/${item.id}`}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    </Link>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        {/* Name + size link to product page */}
                        <Link
                          to={`/product/${item.id}`}
                          className="no-underline text-inherit"
                        >
                          <h3 className="font-semibold text-gray-800 hover:underline">
                            {item.name}
                          </h3>
                          {item.size && (
                            <p className="text-sm text-gray-600">
                              Size: {item.size}
                            </p>
                          )}
                        </Link>

                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.id,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-700 transition-colors text-sm"
                          >
                            −
                          </button>
                          <span className="font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.id,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-700 transition-colors text-sm"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-semibold text-gray-800">
                          {currency}
                          {item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/collection"
              className="inline-block mt-6 text-gray-700 hover:text-gray-900 transition-colors no-underline"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-pink-100 rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>
                    Subtotal ({itemsCount} item
                    {itemsCount !== 1 && "s"})
                  </span>
                  <span>
                    {currency}
                    {subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "FREE" : `${currency}${shipping}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>
                      -{currency}
                      {discount}
                    </span>
                  </div>
                )}
                {subtotal < 999 && subtotal > 0 && (
                  <p className="text-sm text-gray-600 bg-pink-50 p-3 rounded">
                    Add {currency}
                    {999 - subtotal} more for FREE shipping
                  </p>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total</span>
                  <span>
                    {currency}
                    {total}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full px-4 py-2 rounded-full border-2 border-gray-300 focus:border-gray-700 focus:outline-none text-sm mb-2"
                />
                <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-full text-sm hover:bg-gray-300 transition-colors">
                  Apply Code
                </button>
              </div>

              <Link
                to="/place-order"
                className="block w-full bg-gray-700 text-white text-center py-3 rounded-full font-medium hover:bg-gray-800 transition-colors no-underline"
              >
                Proceed to Checkout
              </Link>

              <div className="mt-6 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-pink-400">♡</span>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-400">♡</span>
                  <span>Easy returns within 7 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-400">♡</span>
                  <span>Free shipping on orders over ₹999</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
