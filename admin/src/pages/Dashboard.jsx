import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Plus,
  Download,
} from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const token = localStorage.getItem("token") || "";

  // 🔹 Fetch all orders (same endpoint as Admin Orders)
  useEffect(() => {
    const fetchAllOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${backendURL}/api/order/allorders`, {
          headers: { token },
        });

        if (res.data.success && Array.isArray(res.data.orders)) {
          const normalized = res.data.orders.map((order) => ({
            ...order,
            status: (order.status || "processing").toLowerCase(),
            paymentMethod: order.paymentMethod || "COD",
          }));
          setOrders(normalized);
        }
      } catch (err) {
        console.error("DASHBOARD FETCH ALL ORDERS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [backendURL, token]);

  // 🔹 Derived stats from orders
  const totalOrders = orders.length;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

  // unique customers (by userId)
  const customerIds = new Set(
    orders.map((o) =>
      typeof o.userId === "object" && o.userId?._id
        ? o.userId._id.toString()
        : o.userId?.toString()
    )
  );
  const totalCustomers = customerIds.size;

  // unique products (by product/productId inside items)
  const productIds = new Set();
  orders.forEach((order) => {
    if (Array.isArray(order.items)) {
      order.items.forEach((it) => {
        const pid =
          it.productId?.toString() ||
          it.product?._id?.toString() ||
          it.productId ||
          it.product;
        if (pid) productIds.add(pid);
      });
    }
  });
  const totalProducts = productIds.size;

  // helper: format rupees
  const formatCurrency = (num) => "₹" + (num || 0).toLocaleString("en-IN");

  // 🔹 Stats array (values now dynamic, change % still placeholder)
  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: "+12.5%", // placeholder
      icon: DollarSign,
      color: "green",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString("en-IN"),
      change: "+8.2%", // placeholder
      icon: ShoppingCart,
      color: "blue",
    },
    {
      label: "Total Products",
      value: totalProducts.toLocaleString("en-IN"),
      change: "+3.1%", // placeholder
      icon: Package,
      color: "purple",
    },
    {
      label: "Total Customers",
      value: totalCustomers.toLocaleString("en-IN"),
      change: "+15.3%", // placeholder
      icon: Users,
      color: "orange",
    },
  ];

  // 🔹 Recent orders from real data (latest 5)
  const statusLabel = (status) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "Processing";

  const recentOrders = [...orders]
    .sort((a, b) => {
      const da = new Date(a.date || a.createdAt || 0).getTime();
      const db = new Date(b.date || b.createdAt || 0).getTime();
      return db - da; // latest first
    })
    .slice(0, 5)
    .map((order) => {
      const customerName =
        order.address?.fullName ||
        order.userId?.name ||
        `User ${order.userId?._id || ""}`;

      const dateObj = new Date(order.date || order.createdAt || 0);

      return {
        id: order._id,
        customer: customerName,
        amount: formatCurrency(order.amount),
        status: statusLabel(order.status),
        time: dateObj.toLocaleString("en-IN"),
      };
    });

  const colorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Dashboard Overview
        </h2>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-green-600 text-sm font-semibold">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
            <button
              onClick={() => navigate("/orders")}
              className="text-amber-900 text-sm font-semibold hover:text-amber-700"
            >
              View All
            </button>
          </div>

          {loading ? (
            <p className="text-gray-600 text-sm">Loading orders...</p>
          ) : recentOrders.length === 0 ? (
            <p className="text-gray-600 text-sm">No recent orders yet.</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    {/* ✅ Customer Name on Top (Bold, High Opacity) */}
                    <p className="font-semibold text-gray-900">
                      {order.customer}
                    </p>

                    {/* ✅ Order ID Below (Lower Opacity) */}
                    <p className="text-sm text-gray-500 opacity-70">
                      {order.id}
                    </p>
                  </div>

                  <div className="text-right mr-4">
                    <p className="font-bold text-gray-800">{order.amount}</p>
                    <p className="text-xs text-gray-500">{order.time}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-amber-900 to-amber-700 rounded-xl shadow-sm p-6 text-black">
          <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/add")}
              className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm p-4 rounded-lg transition flex items-center space-x-3"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add New Product</span>
            </button>

            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm p-4 rounded-lg transition flex items-center space-x-3"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">View Orders</span>
            </button>

            <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm p-4 rounded-lg transition flex items-center space-x-3">
              <Download className="w-5 h-5" />
              <span className="font-medium">Export Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
