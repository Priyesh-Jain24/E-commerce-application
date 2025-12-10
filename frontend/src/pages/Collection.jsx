import React, { useState, useContext, useEffect, useMemo } from "react";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { ShopContext } from "../context/ShopContext.jsx";
import { Link, useSearchParams } from "react-router-dom";

const Collection = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { products, loadingProducts, productsError } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // ---------- SEARCH FROM URL ----------
  useEffect(() => {
    const search = searchParams.get("search");
    if (search) {
      setSearchQuery(search);
      setSearchInput(search);
    } else {
      setSearchQuery("");
      setSearchInput("");
    }
  }, [searchParams]);

  // ---------- DYNAMIC CATEGORIES FROM BACKEND ----------
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });

    const arr = Array.from(set).map((cat) => ({
      id: cat.toLowerCase(),
      name: cat
        .toString()
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    }));

    return [{ id: "all", name: "All Products" }, ...arr];
  }, [products]);

  // ---------- SEARCH HANDLERS ----------
  const handleSearch = (term) => {
    const value = typeof term === "string" ? term : searchInput;

    if (value.trim()) {
      setSearchQuery(value.trim());
      setSearchInput(value.trim());
      setSearchParams({ search: value.trim() });
    } else {
      clearSearch();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
    setSearchParams({});
  };

  // ---------- FILTER + SORT LOGIC ----------
  const filteredProducts = products
    .filter((product) => {
      // search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const name = (product.name || "").toLowerCase();
        const category = (product.category || "").toLowerCase();
        const subCategory = (product.subCategory || "").toLowerCase();
        const description = (product.description || "").toLowerCase();

        return (
          name.includes(query) ||
          category.includes(query) ||
          subCategory.includes(query) ||
          description.includes(query)
        );
      }
      return true;
    })
    .filter((product) => {
      // category filter (using backend category)
      if (selectedCategory === "all") return true;

      const cat = (product.category || "").toLowerCase();
      return cat === selectedCategory;
    })
    .filter((product) => {
      // price filter
      const price = Number(product.price) || 0;
      if (priceRange === "all") return true;
      if (priceRange === "under500") return price < 500;
      if (priceRange === "500-1000") return price >= 500 && price <= 1000;
      if (priceRange === "above1000") return price > 1000;
      return true;
    });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = Number(a.price) || 0;
    const priceB = Number(b.price) || 0;

    if (sortBy === "price-low") return priceA - priceB;
    if (sortBy === "price-high") return priceB - priceA;
    if (sortBy === "newest") {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    }
    // "featured" – keep original order
    return 0;
  });

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-gray-800 mb-2">
            Our Collection
          </h1>
          <p className="text-gray-600">
            Explore our handcrafted products made with love
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-3xl w-full mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-200 via-rose-200 to-amber-200 opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-300 pointer-events-none" />

              <div className="relative flex items-center bg-white/80 backdrop-blur-sm rounded-full border-2 border-gray-200 group-focus-within:border-gray-700 shadow-sm group-focus-within:shadow-md transition-all duration-300">
                <span className="pl-3 sm:pl-4 pr-2 flex items-center">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-focus-within:text-gray-700 transition-colors" />
                </span>

                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for bags, mugs, keychains..."
                  className="w-full bg-transparent px-1 sm:px-2 py-2.5 sm:py-3 pr-28 rounded-full text-sm sm:text-base text-gray-800 placeholder:text-gray-400 focus:outline-none"
                />

                <div className="absolute right-2 flex items-center gap-1 sm:gap-2">
                  {searchInput && (
                    <button
                      onClick={clearSearch}
                      className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                    </button>
                  )}
                  <button
                    onClick={() => handleSearch()}
                    className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-gray-800 hover:bg-gray-900 rounded-full transition-colors flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    <span className="hidden sm:inline text-xs font-medium text-white">
                      Search
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick suggestions */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
              <span className="text-[11px] sm:text-xs text-gray-400 mr-1">
                Popular:
              </span>
              {["Bags", "Mug", "Keychain", "Art"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleSearch(tag)}
                  className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-pink-50 border border-pink-100 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Search query display */}
          {searchQuery && (
            <div className="mt-4 flex items-center gap-2">
              <p className="text-sm text-gray-600">
                Searching for:{" "}
                <span className="font-semibold text-gray-800">
                  "{searchQuery}"
                </span>
              </p>
              <button
                onClick={clearSearch}
                className="text-xs text-gray-600 hover:text-gray-900 underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-pink-100 rounded-lg p-6 shadow-sm sticky top-4">
              <h3 className="font-semibold text-gray-800 mb-4">Filters</h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Category
                </h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(cat.id)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Price Range
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === "all"}
                      onChange={() => setPriceRange("all")}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">All Prices</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === "under500"}
                      onChange={() => setPriceRange("under500")}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Under ₹500</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === "500-1000"}
                      onChange={() => setPriceRange("500-1000")}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">₹500 - ₹1000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === "above1000"}
                      onChange={() => setPriceRange("above1000")}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Above ₹1000</span>
                  </label>
                </div>
              </div>

              <button className="w-full bg-gray-700 text-white py-2 rounded-full hover:bg-gray-800 transition-colors text-sm">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Loading & Error */}
            {loadingProducts && (
              <p className="mb-4 text-sm text-gray-600">Loading products…</p>
            )}
            {productsError && (
              <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
                {productsError}
              </p>
            )}

            {/* Sort & Filter Bar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{sortedProducts.length} products</p>

              <div className="flex gap-4 items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-full border-2 border-gray-300 bg-white text-sm focus:outline-none focus:border-gray-700"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>

                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-full text-sm hover:border-gray-700"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* No results message */}
            {sortedProducts.length === 0 && !loadingProducts && !productsError && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No products found{" "}
                  {searchQuery && `matching "${searchQuery}"`}
                </p>
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="mt-4 px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors"
                  >
                    View all products
                  </button>
                )}
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => {
                let img =
                  (Array.isArray(product.images) && product.images[0]) ||
                  (Array.isArray(product.image) && product.image[0]) ||
                  product.image ||
                  "";

                return (
                  <Link
                    key={product._id || product.id}
                    to={`/product/${product._id || product.id}`}
                    className="no-underline"
                  >
                    <div className="bg-pink-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-square overflow-hidden">
                        {img ? (
                          <img
                            src={img}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl text-amber-900 bg-pink-50">
                            {product.name?.[0] || "P"}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-700 font-medium">
                          ₹{product.price}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-800">Filters</h3>
              <X
                onClick={() => setShowFilters(false)}
                className="cursor-pointer"
              />
            </div>

            {/* Category - Mobile */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Category
              </h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category-mobile"
                      checked={selectedCategory === cat.id}
                      onChange={() => setSelectedCategory(cat.id)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price - Mobile */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Price Range
              </h4>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="price-mobile"
                    checked={priceRange === "all"}
                    onChange={() => setPriceRange("all")}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">All Prices</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="price-mobile"
                    checked={priceRange === "under500"}
                    onChange={() => setPriceRange("under500")}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Under ₹500</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="price-mobile"
                    checked={priceRange === "500-1000"}
                    onChange={() => setPriceRange("500-1000")}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">₹500 - ₹1000</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="price-mobile"
                    checked={priceRange === "above1000"}
                    onChange={() => setPriceRange("above1000")}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Above ₹1000</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(false)}
              className="w-full bg-gray-700 text-white py-3 rounded-full hover:bg-gray-800 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
