import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext.jsx";
import { Link } from "react-router-dom";

const Home = () => {
  // get data from context
  const {
    bestSellers = [],
    loadingProducts,
    productsError,
  } = useContext(ShopContext);

  // limit how many to show on homepage if you want
  const bestSellersToShow = bestSellers.slice(0, 8);

  return (
    <div className="w-full bg-pink-100 overflow-x-hidden">
      {/* Hero Section */}
      <div className="w-full flex items-center justify-center">
        <div className="w-full min-h-[30vh] sm:min-h-[30vh] md:h-[25vw] text-center bg-gradient-to-r from-[#FBEAEC] via-white to-[#FBEAEC] py-12 sm:py-16 md:py-20 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-amber-900 mb-3 sm:mb-4">
            AQUALIFE
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-amber-900 mb-6 sm:mb-8 tracking-wide px-4">
            CUSTOM MADE TO FIT YOUR EMOTIONS
          </p>
          <div className="flex gap-3 sm:gap-4 justify-center flex-wrap px-4">
            <Link
              to="/collection"
              className="bg-amber-900 text-white px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-amber-800 transition-colors no-underline"
            >
              SHOP NOW
            </Link>
            <Link
              to="/"
              className="bg-transparent border-2 border-amber-900 text-amber-900 px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-amber-900 hover:text-white transition-colors no-underline"
            >
              HOME
            </Link>
          </div>
        </div>
      </div>

      {/* Best Seller Section */}
      <div className="w-full py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-serif text-gray-800 mb-4 sm:mb-6 md:mb-8 px-2">
            Best Sellers
          </h2>

          {loadingProducts && (
            <p className="text-gray-600 px-2 mb-4">Loading products…</p>
          )}

          {productsError && (
            <p className="text-red-600 px-2 mb-4">
              {productsError}
            </p>
          )}

          {!loadingProducts && !productsError && bestSellersToShow.length === 0 && (
            <p className="text-gray-600 px-2">
              No best-seller products yet. Please check back later.
            </p>
          )}

          {!loadingProducts && !productsError && bestSellersToShow.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {bestSellersToShow.map((product) => {
                const key = product._id || product.id;
                const linkId = product._id || product.id;

                // choose first image from backend structure
                let img =
                  (Array.isArray(product.images) && product.images[0]) ||
                  (Array.isArray(product.image) && product.image[0]) ||
                  product.image ||
                  "";

                return (
                  <Link
                    key={key}
                    to={`/product/${linkId}`}
                    className="no-underline"
                  >
                    <div className="bg-pink-200 rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-square overflow-hidden">
                        {img ? (
                          <img
                            src={img}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 rounded-lg sm:rounded-xl transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl text-amber-900 bg-pink-100">
                            {product.name?.[0] || "P"}
                          </div>
                        )}
                      </div>
                      <div className="p-2 sm:p-3 md:p-4">
                        <h3 className="font-medium text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm md:text-base line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-700 font-medium text-sm sm:text-base">
                          ₹{product.price}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-pink-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
          <div className="p-4 sm:p-6">
            <div className="text-pink-400 text-3xl sm:text-4xl mb-3 sm:mb-4">
              ♡
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">
              Handmade with Love
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm px-2">
              Each piece is crafted with care and attention to detail
            </p>
          </div>
          <div className="p-4 sm:p-6">
            <div className="text-pink-400 text-3xl sm:text-4xl mb-3 sm:mb-4">
              ✓
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">
              Quality Guaranteed
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm px-2">
              Premium materials and craftsmanship in every product
            </p>
          </div>
          <div className="p-4 sm:p-6">
            <div className="text-pink-400 text-3xl sm:text-4xl mb-3 sm:mb-4">
              ★
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">
              Custom Orders
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm px-2">
              Personalize your items to match your emotions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
