import React, { useState } from "react";
import { Package, DollarSign, Image, Plus, Trash2, Check } from "lucide-react";
import axios from "axios";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";

const sizeOptions = ["S", "M", "L", "XL"];

const Add = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    sizes: [],
    bestSeller: false,
    featured: false,
    newArrival: false,
  });

  // each slot: { file: File, preview: string } | null
  const [images, setImages] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageChange = (index, file) => {
    setImages((prev) => {
      const updated = [...prev];

      // revoke old preview URL if it exists
      if (updated[index]?.preview) {
        URL.revokeObjectURL(updated[index].preview);
      }

      if (file) {
        const preview = URL.createObjectURL(file);
        updated[index] = { file, preview };
      } else {
        updated[index] = null;
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedImages = images.filter(Boolean);
    if (selectedImages.length === 0) {
      alert("Please upload at least one product image.");
      return;
    }

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.subCategory
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (formData.sizes.length === 0) {
      alert("Please select at least one size.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("subCategory", formData.subCategory);
    data.append("sizes", JSON.stringify(formData.sizes));
    data.append("bestSeller", String(formData.bestSeller));
    data.append("featured", String(formData.featured));
    data.append("newArrival", String(formData.newArrival));

    // image1, image2, image3, image4 for multer.fields
    selectedImages.forEach((imgObj, index) => {
      data.append(`image${index + 1}`, imgObj.file);
    });

    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/products/add`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: localStorage.getItem("token"),
        },
      });

      console.log("Product added:", res.data);
      alert("Product added successfully ✅");

      // clear previews from memory
      images.forEach((img) => {
        if (img?.preview) URL.revokeObjectURL(img.preview);
      });

      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        subCategory: "",
        sizes: [],
        bestSeller: false,
        featured: false,
        newArrival: false,
      });
      setImages([null, null, null, null]);
    } catch (err) {
      console.error("Error adding product:", err);
      alert(
        err?.response?.data?.message ||
          "Failed to add product. Check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
          Add New Product
        </h2>
        <p className="text-gray-600">
          Create a new product listing for your store
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-amber-900" />
              Basic Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                    placeholder="e.g. Wall Decor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sub Category *
                  </label>
                  <input
                    type="text"
                    value={formData.subCategory}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subCategory: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                    placeholder="e.g. Canvas Art"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 resize-none"
                  placeholder="Write a detailed product description..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Pricing & Sizes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-amber-900" />
              Pricing & Sizes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                  placeholder="2499"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Available Sizes *
              </label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                      formData.sizes.includes(size)
                        ? "bg-amber-900 text-white border-amber-900"
                        : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Image className="w-5 h-5 mr-2 text-amber-900" />
              Product Images (4 max, 1 required)
            </h3>

            <div className="space-y-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {img?.preview ? (
                      <img
                        src={img.preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center text-white text-sm">
                        <Plus className="w-5 h-5" />
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {img?.file
                          ? img.file.name
                          : `Image ${idx + 1}${idx === 0 ? " *" : ""}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {img?.file
                          ? `${(img.file.size / 1024).toFixed(1)} KB`
                          : "PNG / JPG, up to 5MB"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-xs px-2 py-1 rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-100">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageChange(
                            idx,
                            e.target.files?.[0] || null
                          )
                        }
                      />
                    </label>
                    {img && (
                      <button
                        type="button"
                        onClick={() => handleImageChange(idx, null)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Status */}
          <div className="bg-gradient-to-br from-amber-900 to-amber-700 rounded-xl shadow-sm p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Product Status</h3>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded"
                  checked={formData.bestSeller}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bestSeller: e.target.checked,
                    })
                  }
                />
                <span className="text-sm">Best Seller</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      featured: e.target.checked,
                    })
                  }
                />
                <span className="text-sm">Featured Product</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded"
                  checked={formData.newArrival}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newArrival: e.target.checked,
                    })
                  }
                />
                <span className="text-sm">New Arrival</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition font-bold flex items-center justify-center space-x-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              <span>{loading ? "Publishing..." : "Publish Product"}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-white text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition font-bold border-2 border-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Add;
