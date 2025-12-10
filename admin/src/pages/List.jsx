import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";
import {
  Plus,
  Box,
  TrendingUp,
  AlertCircle,
  Tag,
  Package,
  Edit,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const List = () => {
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("latest"); // latest | priceLow | priceHigh | nameAZ

  // ====== FETCH PRODUCTS FROM BACKEND ======
  const fetchList = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await axios.get(`${backendUrl}/api/products/list`, {
        headers: token ? { token } : {},
      });

      if (res.data.success) {
        setList(res.data.products || []);
      } else {
        setError("Failed to fetch product list.");
        console.error("Failed to fetch product list");
      }
    } catch (err) {
      console.error("Error fetching product list:", err);
      setError(
        err?.response?.data?.message ||
          "Error fetching products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // ====== DELETE PRODUCT ======
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${backendUrl}/api/products/remove`,
        { id },
        {
          headers: {
            token: token || "",
          },
        }
      );

      console.log("Delete response:", res.data);

      setList((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(
        err?.response?.data?.message ||
          "Failed to delete product. Check console for details."
      );
    }
  };

  // ====== EDIT PRODUCT (navigate to edit page) ======
  const handleEdit = (id) => {
    // Create a page like /pages/Edit.jsx and route /edit/:id in App.jsx
    navigate(`/edit/${id}`);
  };

  // ====== DERIVED STATS (from backend data) ======
  const totalProducts = list.length;
  const bestSellerCount = list.filter((p) => p.bestSeller).length;
  const newArrivalCount = list.filter((p) => p.newArrival).length;
  const categoryCount = new Set(list.map((p) => p.category)).size;

  // ====== CATEGORY OPTIONS (dynamic) ======
  const categoryOptions = [
    "All",
    ...Array.from(
      new Set(list.map((p) => p.category).filter(Boolean))
    ),
  ];

  // ====== FILTER + SORT DATA ======
  const filteredAndSortedList = (() => {
    // 1) Filter by category
    const filtered =
      selectedCategory === "All"
        ? list
        : list.filter((p) => p.category === selectedCategory);

    // 2) Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === "priceLow") {
        return Number(a.price) - Number(b.price);
      }
      if (sortOption === "priceHigh") {
        return Number(b.price) - Number(a.price);
      }
      if (sortOption === "nameAZ") {
        return (a.name || "").localeCompare(b.name || "");
      }
      // latest by date (default)
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da; // newest first
    });

    return sorted;
  })();

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Products Catalog
          </h2>
          <p className="text-gray-600">
            Manage your product inventory and pricing
          </p>
        </div>
        <button
          onClick={() => navigate("/add")}
          className="bg-amber-900 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition flex items-center space-x-2 shadow-md w-full lg:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add New Product</span>
        </button>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="mb-4 text-sm text-gray-600">Loading products…</div>
      )}
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
          <Box className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
          <p className="text-sm text-gray-600">Total Products</p>
        </div>
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
          <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {bestSellerCount}
          </p>
          <p className="text-sm text-gray-600">Best Sellers</p>
        </div>
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
          <AlertCircle className="w-8 h-8 text-orange-600 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {newArrivalCount}
          </p>
          <p className="text-sm text-gray-600">New Arrivals</p>
        </div>
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
          <Tag className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {categoryCount}
          </p>
          <p className="text-sm text-gray-600">Categories</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition ${
                viewMode === "grid"
                  ? "bg-amber-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Box className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition ${
                viewMode === "list"
                  ? "bg-amber-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Package className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 text-sm"
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            {/* Sort Options */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 text-sm"
            >
              <option value="latest">Sort By: Latest</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="nameAZ">Name: A → Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!loading && filteredAndSortedList.length === 0 && !error && (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
          No products found. Click{" "}
          <button
            className="text-amber-900 font-semibold underline"
            onClick={() => navigate("/add")}
          >
            Add New Product
          </button>{" "}
          to create one.
        </div>
      )}

      {/* Products Grid / List */}
      {filteredAndSortedList.length > 0 && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredAndSortedList.map((product) => {
            const mainImage = product.images?.[0];

            return (
              <div
                key={product._id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                {/* Image / Thumbnail */}
                <div
                  className={`flex items-center justify-center bg-gray-100 ${
                    viewMode === "grid" ? "h-56" : "w-32 h-32"
                  }`}
                >
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 h-full w-full flex items-center justify-center text-3xl font-bold text-amber-900">
                      {product.name?.[0] || "P"}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {product.category}
                        {product.subCategory && ` • ${product.subCategory}`}
                      </p>
                      {product.sizes?.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Sizes: {product.sizes.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-2">
                      <span className="text-amber-900 font-bold text-xl block">
                        ₹{product.price}
                      </span>
                      {product.bestSeller && (
                        <span className="mt-1 inline-block text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-900 font-semibold">
                          Best Seller
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                    <span>
                      Added:{" "}
                      {product.date
                        ? new Date(product.date).toLocaleDateString()
                        : "—"}
                    </span>
                    <span>Images: {product.images?.length || 0}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="flex-1 bg-amber-900 text-white py-2.5 rounded-lg hover:bg-amber-800 transition flex items-center justify-center space-x-2 font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-4 bg-red-50 text-red-600 py-2.5 rounded-lg hover:bg-red-100 transition flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default List;
