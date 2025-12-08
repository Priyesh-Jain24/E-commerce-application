// src/pages/Orders.jsx
import React, { useState, useContext } from "react";
import { Package, Truck, CheckCircle, XCircle, Search } from "lucide-react";
import { ShopContext } from "../context/ShopContext.jsx";
import { Link } from "react-router-dom";

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // ✅ Get orders, currency, and addToCart from context
  const { orders, currency, addToCart } = useContext(ShopContext);

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesFilter =
      filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // ✅ Buy Again: add all items from this order back to cart
  const handleBuyAgain = (order) => {
    order.items.forEach((item) => {
      addToCart(
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
        },
        item.quantity
      );
    });
  };

  return (
    <div className="w-full bg-pink-50">
      <div className="w-full px-4 sm:px-8 py-8">
        <h1 className="text-4xl font-serif text-gray-800 mb-8">My Orders</h1>

        {/* Search and Filter */}
        <div className="bg-pink-100 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-pink-100 rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 mb-6">
              {orders.length === 0
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
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status || "processing");
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="bg-pink-100 rounded-lg shadow-sm overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on{" "}
                        {new Date(order.date).toLocaleDateString("en-IN", {
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
                        {order.total}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-4 ${
                          idx !== order.items.length - 1
                            ? "mb-4 pb-4 border-b"
                            : ""
                        }`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">
                            {item.name}
                          </h4>
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

                    {/* Tracking Info */}
                    {order.trackingNumber && (
                      <div className="mt-6 pt-6 border-t">
                        <div className="flex flex-wrap justify-between items-center gap-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              Tracking Number
                            </p>
                            <p className="font-medium text-gray-800">
                              {order.trackingNumber}
                            </p>
                          </div>
                          <button className="px-6 py-2 border-2 border-gray-700 text-gray-700 rounded-full hover:bg-gray-700 hover:text-white transition-colors">
                            Track Order
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {order.status === "delivered" && (
                        <>
                          <button
                            className="px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors"
                            onClick={() => handleBuyAgain(order)}
                          >
                            Buy Again
                          </button>
                          <button className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-full hover:border-gray-700 transition-colors">
                            Leave Review
                          </button>
                        </>
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
