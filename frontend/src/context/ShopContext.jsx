// src/context/ShopContext.jsx
import React, { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export const ShopContext = createContext();

const safeParse = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const ShopContextProvider = ({ children }) => {
  // cart + orders from localStorage (UI only)
  const [cartItems, setCartItems] = useState(() => safeParse("cartItems", []));
  const [orders, setOrders] = useState(() => safeParse("orders", []));

  // auth token - load from localStorage so navbar sees it
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const currency = "₹";
  const delivery_fee = 10;

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState("");

  // ===== FETCH ALL PRODUCTS FROM BACKEND =====
  const getProducts = async () => {
    try {
      setLoadingProducts(true);
      setProductsError("");

      const response = await axios.get(`${backendURL}/api/products/list`);
      const data = response.data || {};

      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.warn("Unexpected products response:", data);
        setProducts([]);
      }

      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setProductsError(
        error?.response?.data?.message ||
          "Error fetching products. Please try again."
      );
      return { success: false, products: [] };
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // ✅ persist cart + orders
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // ✅ keep token in localStorage in one place
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const makeKey = (id, size) => `${id}-${size || "default"}`;

  // ========= CART LOGIC (API-BASED) =========

  /**
   * ADD one quantity of given itemId + size
   *  - calls POST /api/cart/add
   *  - then updates cartItems for UI
   *  - used by Product.jsx and Cart.jsx ('+' button)
   */
  const addToCart = async (itemId, size) => {
    try {
      if (!token) {
        toast.error("Please login to add items to your cart.");
        return;
      }

      const res = await axios.post(
        `${backendURL}/api/cart/add`,
        { itemId, size },
        {
          headers: {
            "Content-Type": "application/json",
            token,
          },
        }
      );

      console.log("ADD TO CART RESPONSE (context):", res.data);

      if (!res.data?.success) {
        toast.error(res.data?.message || "Failed to add item to cart");
        return;
      }

      // ✅ Update local UI state
      setCartItems((prev) => {
        const key = makeKey(itemId, size);
        const existingIndex = prev.findIndex((it) => it.key === key);

        // find product details from products array
        const product =
          products.find(
            (p) =>
              p._id === itemId || p.id?.toString() === itemId.toString()
          ) || {};

        const id = product._id || product.id || itemId;
        const price = product.price || 0;

        let img = product.image || "";
        if (Array.isArray(product.image)) img = product.image[0];
        if (Array.isArray(product.images)) img = product.images[0];

        if (existingIndex !== -1) {
          // increase quantity
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + 1,
          };
          return updated;
        }

        // new cart line
        return [
          ...prev,
          {
            key,
            id,
            size,
            name: product.name || "Product",
            price,
            image: img,
            quantity: 1,
          },
        ];
      });

      toast.success("Added to cart 🛒");
    } catch (err) {
      console.error("ADD TO CART ERROR (frontend):", err);
      const msg =
        err?.response?.data?.message ||
        "Something went wrong while adding the item.";
      toast.error(msg);
    }
  };

  /**
   * REMOVE one quantity of given itemId + size
   *  - calls DELETE /api/cart/remove
   *  - then updates cartItems for UI
   *  - used by Cart.jsx ('-' button & trash icon)
   */
  const removeFromCart = async (itemId, size) => {
    try {
      if (!token) {
        toast.error("Please login to manage your cart.");
        return;
      }

      const res = await axios.delete(`${backendURL}/api/cart/remove`, {
        headers: { token },
        data: { itemId, size }, // body for DELETE
      });

      console.log("REMOVE FROM CART RESPONSE (context):", res.data);

      if (!res.data?.success) {
        toast.error(res.data?.message || "Failed to remove item from cart");
        return;
      }

      setCartItems((prev) => {
        const keyToMatch = makeKey(itemId, size);

        const updated = prev.reduce((acc, item) => {
          if (item.key !== keyToMatch) {
            // not the one we are changing
            acc.push(item);
            return acc;
          }

          // this is the one we are removing one from
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
          // if quantity was 1, we drop it completely

          return acc;
        }, []);

        return updated;
      });

      toast.success("Item removed from cart ❌");
    } catch (err) {
      console.error("REMOVE FROM CART ERROR (frontend):", err);
      const msg =
        err?.response?.data?.message ||
        "Something went wrong while removing the item.";
      toast.error(msg);
    }
  };

  /**
   * Local-only quantity update.
   * If you want full sync with backend, replace this with an API.
   */
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

  // Local clear (you can later add a backend /api/cart/clear)
  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared 🧹");
  };

  // Local add order (you also place order with backend separately)
  const addOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
    toast.success("Order placed successfully 🎉");
  };

  // ========= DERIVED VALUES =========
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // “Featured” now = best-seller products from backend
  const bestSellers = products.filter((p) => p.bestSeller);

  const value = {
    // products
    products,
    bestSellers,
    loadingProducts,
    productsError,
    refreshProducts: getProducts,

    // pricing
    currency,
    delivery_fee,

    // cart
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartCount,
    cartSubtotal,

    // backend + auth
    backendURL,
    token,
    setToken,

    // orders
    orders,
    setOrders,   // ✅ so Orders.jsx can set from API
    addOrder,
  };

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
