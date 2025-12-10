// admin/src/pages/Orders.jsx
import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Clock,
  Truck,
  DollarSign,
  Filter,
  Download,
  Calendar,
  Package,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  CreditCard,
} from "lucide-react";
import axios from "axios";

const AdminOrders = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const token = localStorage.getItem("token") || "";

  const statusOptions = ["processing", "shipped", "delivered", "cancelled"];

  // 🔹 Fetch all orders for admin
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

        console.log("ADMIN ALL ORDERS RESPONSE:", res.data);

        if (res.data.success && Array.isArray(res.data.orders)) {
          const normalized = res.data.orders.map((order) => ({
            ...order,
            status: (order.status || "processing").toLowerCase(),
            paymentMethod: order.paymentMethod || "COD",
          }));
          setOrders(normalized);
        }
      } catch (err) {
        console.error("ADMIN FETCH ALL ORDERS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [backendURL, token]);

  // 🔹 Call backend to update status
  const handleStatusChange = async (orderId, newStatus) => {
    if (!token) return;

    setUpdatingOrderId(orderId);
    try {
      const res = await axios.post(
        `${backendURL}/api/order/status`,
        { orderId, status: newStatus },
        {
          headers: { token },
        }
      );

      console.log("UPDATE STATUS RESPONSE:", res.data);

      if (res.data.success && res.data.order) {
        const updated = res.data.order;

        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? {
                  ...o,
                  status: (updated.status || newStatus).toLowerCase(),
                }
              : o
          )
        );
      } else {
        alert(res.data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("ADMIN UPDATE STATUS ERROR:", err);
      alert("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // 🔹 Status helpers
  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return Clock;
      case "shipped":
        return Truck;
      case "delivered":
        return CheckCircle;
      case "cancelled":
        return AlertCircle;
      default:
        return Package;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // 🔹 STEP 1: hide unpaid Razorpay orders (admin side)
  const visibleOrders = orders.filter((order) => {
    const method = (order.paymentMethod || "").toUpperCase();

    // ❌ hide Razorpay orders where payment is not done
    if (method === "RAZORPAY" && !order.payment) {
      return false;
    }

    // ✅ show all COD orders, and paid Razorpay
    return true;
  });

  // 🔹 Derived stats (based on visibleOrders)
  const totalOrders = visibleOrders.length;
  const processingCount = visibleOrders.filter(
    (o) => o.status === "processing"
  ).length;
  const shippedCount = visibleOrders.filter((o) => o.status === "shipped")
    .length;
  const deliveredCount = visibleOrders.filter(
    (o) => o.status === "delivered"
  ).length;
  const revenue = visibleOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

  // 🔹 Status ranks for sorting
  const statusRank = {
    processing: 1,
    shipped: 2,
    delivered: 3,
    cancelled: 4,
  };

  // 🔹 STEP 2: filter + sort visible orders
  const filteredAndSortedOrders = visibleOrders
    .filter((order) => {
      if (selectedFilter === "all") return true;
      return order.status === selectedFilter;
    })
    .sort((a, b) => {
      const sa = statusRank[a.status] || 999;
      const sb = statusRank[b.status] || 999;
      if (sa !== sb) return sa - sb;

      const da = new Date(a.date || a.createdAt || 0).getTime();
      const db = new Date(b.date || b.createdAt || 0).getTime();
      return db - da;
    });

  const filters = ["all", "processing", "shipped", "delivered", "cancelled"];

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-700 text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Orders Management
        </h2>
        <p className="text-gray-600">
          Track and manage all customer orders (only paid Razorpay + COD)
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Total Orders</p>
            <ShoppingCart className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-gray-800">
            {totalOrders}
          </p>
          <p className="text-xs text-green-600 mt-1">
            Excludes unpaid Razorpay
          </p>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Processing</p>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-yellow-600">
            {processingCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">Awaiting shipment</p>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Shipped</p>
            <Truck className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-purple-600">
            {shippedCount}
          </p>
          <p className="text-xs text-gray-500 mt-1">In transit</p>
        </div>

        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm">Revenue</p>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-green-600">
            ₹{revenue}
          </p>
          <p className="text-xs text-green-600 mt-1">Gross order value</p>
        </div>
      </div>

      {/* Filters + actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition capitalize ${
                  selectedFilter === filter
                    ? "bg-amber-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                const statusLabel =
                  order.status.charAt(0).toUpperCase() +
                  order.status.slice(1);

                const itemCount = Array.isArray(order.items)
                  ? order.items.reduce(
                      (sum, it) => sum + (it.quantity || 0),
                      0
                    )
                  : 0;

                const isPaid = !!order.payment;

                const address = order.address || order.userId?.address || {};

                const line1 =
                  address.street ||
                  address.line1 ||
                  address.houseNo ||
                  address.house ||
                  "";

                const line2 = [
                  address.area,
                  address.landmark,
                  address.city,
                  address.state,
                ]
                  .filter(Boolean)
                  .join(", ");

                const pincode = address.pincode || address.zip || address.zipCode;

                const customerName =
                  order.address?.fullName ||
                  order.userId?.name ||
                  `User ${order.userId?._id || ""}`;

                const customerContact =
                  order.address?.phone ||
                  order.userId?.phone ||
                  order.userId?.mobile ||
                  "";

                return (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {order._id}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {order.paymentMethod || "COD"} •{" "}
                          {isPaid ? "Paid" : "Unpaid"}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {customerName}
                        </p>
                        {customerContact && (
                          <p className="text-xs text-gray-500">
                            {customerContact}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {line1 || line2 || pincode ? (
                        <div className="text-xs text-gray-700 space-y-0.5">
                          {line1 && <p>{line1}</p>}
                          {line2 && <p className="text-gray-500">{line2}</p>}
                          {pincode && (
                            <p className="text-gray-500">PIN: {pincode}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">
                          No address
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(
                          order.date || order.createdAt || 0
                        ).toLocaleDateString("en-IN")}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {itemCount}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ₹{order.amount}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                          isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>

                    {/* Status badge + dropdown */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`px-3 py-1.5 inline-flex items-center space-x-1 text-xs font-semibold rounded-lg border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{statusLabel}</span>
                        </span>

                        <select
                          className="mt-1 block w-full text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-900 focus:border-amber-900"
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          disabled={updatingOrderId === order._id}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt.charAt(0).toUpperCase() + opt.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2 items-center">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-amber-900 hover:bg-amber-50 rounded-lg transition"
                          title="Edit Order"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {updatingOrderId === order._id && (
                          <span className="text-xs text-gray-500">
                            Updating...
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {filteredAndSortedOrders.length} of {totalOrders} orders
            (unpaid Razorpay hidden)
          </p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white transition">
              Previous
            </button>
            <button className="px-4 py-2 bg-amber-900 text-white rounded-lg text-sm font-medium hover:bg-amber-800 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
