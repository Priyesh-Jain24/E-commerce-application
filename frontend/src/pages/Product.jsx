import React, { useState, useContext } from "react";
import { Heart, ShoppingCart, Truck, RefreshCw, Shield } from "lucide-react";
import { ShopContext } from "../context/ShopContext.jsx";
import { useParams, Link } from "react-router-dom";

const Product = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [cartItems, setCartItems] = useState([]);

  const { id } = useParams();
  const { products } = useContext(ShopContext);
  

  const { addToCart } = useContext(ShopContext);
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize); // or just product, 1
};


  // find the single product
  const product = products?.find((p) => p._id === id || p.id?.toString() === id);

  const sizes = ["S", "M", "L", "XL"];

  // handle loading / not found
  if (!products) {
    return <div className="p-6">Loading...</div>;
  }

  if (!product) {
    return <div className="p-6">Product not found.</div>;
  }

  // images & other optional fields
  const images = product.images || product.image || [];
  const features = product.features || [];
  const rating = product.rating || 4.5;
  const reviews = product.reviews || 12;
  const originalPrice = product.originalPrice || product.price;

  // Get related products from the same category
  const relatedProducts = products
    ?.filter((p) => 
      p._id !== product._id && 
      p.id?.toString() !== id &&
      p.category === product.category
    )
    .slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-gray-800">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/collection" className="hover:text-gray-800">
            Collection
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </div>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden mb-8 shadow-sm max-w-md mx-auto">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`bg-white rounded-lg overflow-hidden cursor-pointer border-2 ${
                    selectedImage === idx ? "border-gray-700" : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${idx + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-serif text-gray-800 mb-2">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {"★".repeat(Math.floor(rating))}
                {"☆".repeat(5 - Math.floor(rating))}
              </div>
              <span className="text-sm text-gray-600">
                ({reviews} reviews)
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-800">
                ₹{product.price}
              </span>
              {originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{originalPrice}
                  </span>
                  <span className="bg-pink-200 text-pink-800 px-2 py-1 rounded text-sm font-medium">
                    {Math.round((1 - product.price / originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Select Size
              </h3>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full border-2 font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-gray-700 text-white border-gray-700"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-gray-700 transition-colors"
                >
                  −
                </button>
                <span className="font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-gray-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button onClick={handleAddToCart} className="flex-1 bg-gray-700 text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-pink-400 hover:text-pink-400 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Product Features
                </h3>
                <ul className="space-y-2">
                  {features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="text-pink-400 mt-1">♡</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Info Icons */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                <p className="text-xs text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                <p className="text-xs text-gray-600">Easy Returns</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                <p className="text-xs text-gray-600">Secure Payment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-300 pt-12">
            <h2 className="text-2xl font-serif text-gray-800 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Link
                  key={item._id || item.id}
                  to={`/product/${item._id || item.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-shadow">
                    <img
                      src={item.images?.[0] || item.image?.[0] || item.image}
                      alt={item.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1 group-hover:text-pink-600 transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-800">
                      ₹{item.price}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;