// src/pages/Orders.jsx
import React, { useState, useContext, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  CreditCard,
} from "lucide-react";
import { ShopContext } from "../context/ShopContext.jsx";
import { Link } from "react-router-dom";
import axios from "axios";

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  // ✅ From context
  const {
    orders,
    setOrders, // make sure this is in ShopContext value
    currency,
    addToCart,
    backendURL,
    token,
  } = useContext(ShopContext);

  // 🔹 Fetch user orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post(
          `${backendURL}/api/order/userorders`,
          {},
          { headers: { token } }
        );

        console.log("✅ USER ORDERS RESPONSE:", res.data);

        if (res.data.success && Array.isArray(res.data.orders)) {
          // normalize + ensure default status & paymentMethod
          const normalizedOrders = res.data.orders.map((order) => ({
            ...order,
            status: order.status || "processing",
            paymentMethod: order.paymentMethod || "COD",
          }));

          setOrders(normalizedOrders);
        }
      } catch (err) {
        console.error("❌ FETCH ORDERS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [backendURL, token, setOrders]);

  // 🔹 Status display config
  const getStatusInfo = (status) => {
    const statusMap = {
      processing: {
        icon: Package,
        color: "text-blue-600",
        bg: "bg-blue-100",
        label: "Processing",
      },
      shipped: {
        icon: Truck,
        color: "text-purple-600",
        bg: "bg-purple-100",
        label: "Shipped",
      },
      delivered: {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-100",
        label: "Delivered",
      },
      cancelled: {
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-100",
        label: "Cancelled",
      },
    };
    return statusMap[status] || statusMap.processing;
  };

  // 🔹 STEP 1: hide unpaid Razorpay orders
  const visibleOrders = (orders || []).filter((order) => {
    const method = (order.paymentMethod || "").toUpperCase();

    // ❌ if payment method is Razorpay and payment NOT done → hide from UI
    if (method === "RAZORPAY" && !order.payment) {
      return false;
    }

    // ✅ COD orders & paid Razorpay orders are visible
    return true;
  });

  // 🔹 STEP 2: Search + filter on visibleOrders only
  const filteredOrders = visibleOrders.filter((order) => {
    const idStr = (order._id || "").toString();
    const lowerSearch = searchQuery.toLowerCase();

    const matchesSearch =
      idStr.toLowerCase().includes(lowerSearch) ||
      (order.items || []).some((item) =>
        (item.name || "").toLowerCase().includes(lowerSearch)
      );

    const matchesFilter =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // 🔹 Sort by status then by date (latest first)
  const statusRank = {
    processing: 1,
    shipped: 2,
    delivered: 3,
    cancelled: 4,
  };

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const sa = statusRank[a.status] || 999;
    const sb = statusRank[b.status] || 999;

    if (sa !== sb) return sa - sb;

    const da = new Date(a.date || a.createdAt || 0).getTime();
    const db = new Date(b.date || b.createdAt || 0).getTime();

    return db - da; // latest first
  });

  // 🔹 Buy Again → add all items back to cart
  const handleBuyAgain = (order) => {
    (order.items || []).forEach((item) => {
      const productId = item.productId || item.id;
      const size = item.size || "M";

      if (!productId) return;

      addToCart(productId, size);
    });
  };

  // 🔄 Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-pink-50">
      <div className="w-full px-4 sm:px-8 py-8">
        <h1 className="text-4xl font-serif text-gray-800 mb-8">My Orders</h1>

        {/* 🔍 Search & Filter */}
        <div className="bg-pink-100 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-700 focus:outline-none"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-700 focus:outline-none"
            >
              <option value="all">All Orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* 🧺 Empty state */}
        {sortedOrders.length === 0 ? (
          <div className="bg-pink-100 rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 mb-6">
              {visibleOrders.length === 0
                ? "You haven't placed any orders yet."
                : "Try adjusting your search or filters."}
            </p>
            <Link
              to="/collection"
              className="inline-block bg-gray-700 text-pink-100 px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors no-underline"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status || "processing");
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order._id}
                  className="bg-pink-100 rounded-lg shadow-sm overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Order ID: {order._id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on{" "}
                        {new Date(
                          order.date || order.createdAt || Date.now()
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bg}`}
                      >
                        <StatusIcon
                          className={`w-4 h-4 ${statusInfo.color}`}
                        />
                        <span
                          className={`text-sm font-medium ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {currency}
                        {order.amount}
                      </span>
                    </div>
                  </div>

                  {/* Payment mode */}
                  <div className="px-6 py-3 flex items-center gap-2 text-sm bg-white border-b">
                    <CreditCard className="w-4 h-4 text-gray-700" />
                    <span>
                      Payment Method:{" "}
                      <strong>{order.paymentMethod || "COD"}</strong>
                    </span>
                    {order.paymentMethod === "RAZORPAY" && (
                      <span className="ml-2 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        Online Paid
                      </span>
                    )}
                  </div>

                  {/* Items */}
                  <div className="p-6">
                    {(order.items || []).map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-4 ${
                          idx !== order.items.length - 1
                            ? "mb-4 pb-4 border-b"
                            : ""
                        }`}
                      >
                        <img
                          src={
                            item.image || // for older local orders
                            (Array.isArray(item.images) && item.images[0]) ||
                            ""
                          }
                          alt={item.name || "Product"}
                          className="w-20 h-20 object-cover rounded-lg bg-white"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">
                            {item.name || "Product"}
                          </h4>
                          {item.size && (
                            <p className="text-sm text-gray-600">
                              Size: {item.size}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-gray-700 font-medium mt-1">
                            {currency}
                            {item.price}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {order.status === "delivered" && (
                        <button
                          className="px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors"
                          onClick={() => handleBuyAgain(order)}
                        >
                          Buy Again
                        </button>
                      )}
                      {order.status === "processing" && (
                        <button className="px-6 py-2 border-2 border-red-300 text-red-600 rounded-full hover:bg-red-50 transition-colors">
                          Cancel Order
                        </button>
                      )}
                      <button className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-full hover:border-gray-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
