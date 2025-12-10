// src/components/Navbar.jsx
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Instagram,
} from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.jsx";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [currentPromo, setCurrentPromo] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuRef = useRef(null);

  const navigate = useNavigate();

  // ⬇️ get auth, cartCount and backendURL from context
  const {
    cartCount = 0,
    token,
    setToken,
    backendURL,
    setCartItems,
    // optionally, if you sync cart items into context:
    // setCartItems,
  } = useContext(ShopContext);

  const isLoggedIn = Boolean(token);

  const promos = [
    "Free shipping all over india",
    "10% off on first order Use Code : Special10",
    "Hello cutie, Welcome to our store",
  ];

  const nextPromo = () => {
    setAnimate(false);
    setTimeout(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length);
      setAnimate(true);
    }, 150);
  };

  const prevPromo = () => {
    setAnimate(false);
    setTimeout(() => {
      setCurrentPromo((prev) => (prev - 1 + promos.length) % promos.length);
      setAnimate(true);
    }, 150);
  };

  useEffect(() => {
    const interval = setInterval(nextPromo, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // click outside user menu to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleSearchIconClick = () => {
    if (searchOpen && searchQuery.trim()) {
      handleSearch();
    } else {
      setSearchOpen((prev) => !prev);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleSearch();
    }
  };

  const handleLogout = () => {
    // clear token from context
    setToken("");

    // clear from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userInfo");

    console.log("USER LOGGED OUT");
    // close menu
    setShowUserMenu(false);

    // redirect
    navigate("/login");
  };

  // 🔹 When clicking the cart icon:
  //  - if not logged in, go to /login
  //  - if logged in, call GET /api/cart/get with token
  //    then navigate to /cart
// inside Navbar component
const handleCartClick = async () => {
  if (!token) {
    navigate("/login");
    return;
  }

  try {
    const res = await axios.get(`${backendURL}/api/cart/get`, {
      headers: {
        token, // 👈 this matches authUser
      },
    });

    console.log("GET CART RESPONSE:", res.data);

    navigate("/cart");
  } catch (err) {
    console.error("GET CART ERROR:", err);
    navigate("/cart"); // optional
  }
};


  const linkClass = `relative no-underline text-gray-700 hover:text-gray-900
   after:absolute after:left-0 after:-bottom-1 after:h-[2px]
   after:bg-gray-900 after:transition-all after:duration-300
   hover:after:w-full after:w-0`;

  return (
    <div className="w-screen m-0 p-0">
      {/* TOP SOCIAL BAR - Hidden on mobile */}
      <div className="hidden md:flex w-full bg-pink-100 py-2 px-4 lg:px-20 justify-between items-center border-b m-0">
        <div className="flex gap-4">
          <Instagram className="w-5 h-5 cursor-pointer" />
          <svg
            className="w-5 h-5 cursor-pointer"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95 0-5.52-4.48-10-10-10z" />
          </svg>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-center overflow-hidden">
          <ChevronLeft
            className="w-4 h-4 cursor-pointer hover:scale-125 transition-transform duration-200"
            onClick={prevPromo}
          />
          <p
            className={`text-sm text-gray-700 transition-all duration-300 ease-in-out ${
              animate ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
            }`}
          >
            {promos[currentPromo]}
          </p>
          <ChevronRight
            className="w-4 h-4 cursor-pointer hover:scale-125 transition-transform duration-200"
            onClick={nextPromo}
          />
        </div>

        <div className="w-8" />
      </div>

      {/* PROMO BAR */}
      <div className="w-full bg-pink-100 py-2 md:py-3 border-b overflow-hidden">
        <div className="relative w-full overflow-hidden h-6">
          <div className="absolute flex gap-8 md:gap-12 items-center whitespace-nowrap text-xs md:text-sm text-gray-700 animate-marquee">
            <div className="flex items-center gap-2">
              <span>Free shipping all over india</span>
              <span className="text-pink-400">♡</span>
            </div>
            <div className="flex items-center gap-2">
              <span>10% off on first order Use Code : Special10</span>
              <span className="text-pink-400">♡</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Hello</span>
              <span className="text-pink-400">♡</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Get yours now</span>
              <span className="text-pink-400">♡</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Great deals</span>
              <span className="text-pink-400">♡</span>
            </div>
            <div className="flex items-center gap-2">
              <span>2-day delivery Guaranteed</span>
              <span className="text-pink-400">♡</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="w-full flex items-center justify-between py-4 md:py-5 px-4 sm:px-8 bg-pink-100 border-b m-0 relative z-30">
        <Link to="/" className="no-underline">
          <h1 className="text-xl md:text-2xl font-serif text-gray-800">
            AQUALIFE
          </h1>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex px-20 gap-8">
          <Link to="/contact" className={linkClass}>
            Contact
          </Link>
          <Link to="/collection" className={linkClass}>
            Collection
          </Link>
          <Link to="/about" className={linkClass}>
            About Us
          </Link>
          <Link to="/orders" className={linkClass}>
            My Orders
          </Link>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          {/* Currency Selector - Hidden on mobile */}
          <div className="hidden xl:flex items-center gap-2 text-sm text-gray-700">
            <span>India | INR ₹</span>
            <span className="text-xs">▼</span>
          </div>

          {/* Search Icon/Input */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search products..."
                  className="px-3 py-1 border-2 border-gray-300 rounded-full text-sm focus:outline-none focus:border-gray-700 w-40 md:w-60"
                  autoFocus
                />
                <Search
                  className="w-5 cursor-pointer text-gray-700 hover:text-gray-900"
                  onClick={handleSearchIconClick}
                />
                <X
                  className="w-4 cursor-pointer text-gray-500 hover:text-gray-900"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                />
              </div>
            ) : (
              <Search
                className="w-5 cursor-pointer text-gray-700 hover:text-gray-900"
                onClick={handleSearchIconClick}
              />
            )}
          </div>

          {/* User dropdown (click-based) */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="flex items-center justify-center"
            >
              <User className="w-5 cursor-pointer text-gray-700 hover:text-gray-900" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-10 w-40 bg-white shadow-xl border rounded-lg overflow-hidden z-[9999]">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Cart icon with badge */}
          <button
            type="button"
            onClick={handleCartClick}
            className="relative"
          >
            <ShoppingCart className="w-5 text-gray-700 hover:text-gray-900" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <Menu
            onClick={() => setVisible(true)}
            className="w-5 cursor-pointer lg:hidden text-gray-700"
          />
        </div>
      </div>

      {/* MOBILE SIDEBAR MENU */}
      <div
        className={`fixed top-0 right-0 h-screen bg-white transition-all duration-300 z-50 shadow-2xl ${
          visible ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <div className="flex flex-col text-gray-700 h-full">
          {/* Close Button */}
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-4 cursor-pointer border-b bg-pink-50"
          >
            <X className="h-5 w-5" />
            <p className="font-medium">Close Menu</p>
          </div>

          {/* Navigation Links */}
          <Link
            to="/contact"
            onClick={() => setVisible(false)}
            className="py-4 pl-6 border-b hover:bg-pink-50 transition-colors"
          >
            Contact
          </Link>
          <Link
            to="/collection"
            onClick={() => setVisible(false)}
            className="py-4 pl-6 border-b hover:bg-pink-50 transition-colors"
          >
            Collection
          </Link>
          <Link
            to="/about"
            onClick={() => setVisible(false)}
            className="py-4 pl-6 border-b hover:bg-pink-50 transition-colors"
          >
            About Us
          </Link>
          <Link
            to="/orders"
            onClick={() => setVisible(false)}
            className="py-4 pl-6 border-b hover:bg-pink-50 transition-colors"
          >
            My Orders
          </Link>

          {/* Additional Links */}
          <div className="mt-4 border-t pt-4">
            <Link
              to="/collection"
              onClick={() => setVisible(false)}
              className="py-3 pl-6 block hover:bg-pink-50 transition-colors text-sm text-gray-600"
            >
              All Products
            </Link>
            <Link
              to="/about"
              onClick={() => setVisible(false)}
              className="py-3 pl-6 block hover:bg-pink-50 transition-colors text-sm text-gray-600"
            >
              Delivery & Returns
            </Link>
            <Link
              to="/orders"
              onClick={() => setVisible(false)}
              className="py-3 pl-6 block hover:bg-pink-50 transition-colors text-sm text-gray-600"
            >
              Track your order
            </Link>
          </div>

          {/* Currency Selector in Sidebar */}
          <div className="mt-auto p-6 border-t bg-pink-50">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>India | INR ₹</span>
              <span className="text-xs">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {visible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setVisible(false)}
        />
      )}

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Navbar;
