import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  Plus,
  Home,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  Users,
  XCircle,
} from "lucide-react";

const Navbar = ({setToken}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
    { id: "orders", label: "Orders", icon: ShoppingCart, path: "/orders" },
    { id: "products", label: "Products", icon: Package, path: "/list" },
    { id: "add", label: "Add Product", icon: Plus, path: "/add" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <h1
              className="text-2xl lg:text-3xl font-bold tracking-tight"
              style={{ color: "#8B4513" }}
            >
              AQUALIFE
            </h1>
            <span className="hidden md:inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-semibold rounded-full">
              ADMIN
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                      isActive
                        ? "bg-amber-900 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-48 lg:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent"
              />
            </div>

            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-amber-900 to-amber-700 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                  A
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-gray-800">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">admin@aqualife.com</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-500">
                      admin@aqualife.com
                    </p>
                  </div>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Profile Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700">
                    <Bell className="w-4 h-4" />
                    <span className="text-sm">Notifications</span>
                  </button>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
  onClick={() => {
    setShowProfile(false);        // optional: close dropdown
    setToken("");                 // clear token in state
    // if you also store it there
    // optional: redirect to login with useNavigate
  }}
  className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center space-x-3 text-red-600"
>
  <XCircle className="w-4 h-4" />
  <span className="text-sm">Logout</span>
</button>

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => setShowMobileMenu(false)}
                    className={({ isActive }) =>
                      `w-full px-4 py-3 rounded-lg transition-all flex items-center space-x-3 ${
                        isActive
                          ? "bg-amber-900 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;