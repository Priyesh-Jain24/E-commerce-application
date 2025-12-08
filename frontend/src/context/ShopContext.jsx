// src/context/ShopContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets.js";
import { featured } from "../assets/featured.js";
import toast from "react-hot-toast";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  // ✅ Load from localStorage
  const [cartItems, setCartItems] = useState(
    () => JSON.parse(localStorage.getItem("cartItems")) || []
  );
  const [orders, setOrders] = useState(
    () => JSON.parse(localStorage.getItem("orders")) || []
  );

  const currency = "₹";
  const delivery_fee = 10;

  // ✅ Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const makeKey = (id, size) => `${id}-${size || "default"}`;

  // ✅ ADD TO CART
  const addToCart = (product, quantity = 1, size = null) => {
    if (!product) return;
    const id = product._id || product.id;
    if (!id) return;

    setCartItems((prev) => {
      const key = makeKey(id, size);
      const index = prev.findIndex((item) => item.key === key);

      if (index !== -1) {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          quantity: updated[index].quantity + quantity,
        };
        toast.success("Cart updated ✅");
        return updated;
      }

      let img = product.image;
      if (Array.isArray(product.image)) img = product.image[0];
      if (Array.isArray(product.images)) img = product.images[0];

      toast.success("Added to cart 🛒");

      return [
        ...prev,
        {
          key,
          id,
          size,
          name: product.name,
          price: product.price,
          image: img,
          quantity,
        },
      ];
    });
  };

  // ✅ UPDATE QUANTITY
  const updateCartQuantity = (id, size, newQuantity) => {
    const key = makeKey(id, size);
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: newQuantity } : item
        )
        .filter((item) => item.quantity > 0)
    );
    toast.success("Cart updated ✅");
  };

  // ✅ REMOVE FROM CART
  const removeFromCart = (id, size) => {
    const key = makeKey(id, size);
    setCartItems((prev) => prev.filter((item) => item.key !== key));
    toast.error("Removed from cart ❌");
  };

  // ✅ CLEAR CART AFTER ORDER
  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared 🧹");
  };

  // ✅ CREATE ORDER FROM CHECKOUT
  const addOrder = (order) => {
    setOrders((prev) => [order, ...prev]); // newest first
    toast.success("Order placed successfully 🎉");
  };

  // ✅ DERIVED VALUES
  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value = {
    products,
    featured,
    currency,
    delivery_fee,

    // cart
    cartItems,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,

    // orders
    orders,
    addOrder,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
