import React, { useState, useContext } from "react";
import { MapPin, CreditCard, Truck, CheckCircle } from "lucide-react";
import { ShopContext } from "../context/ShopContext.jsx";
import razorpayLogo from "../assets/razorpay.webp";
import stripeLogo from "../assets/stripelogo.png";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ✅ Get items, currency and order helpers from context
  const { cartItems, currency, addOrder, clearCart } = useContext(ShopContext);

  // totals based on real cart items
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // keep free shipping for now
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      navigate("/collection");
      return;
    }

    // build order object
    const newOrder = {
      id: "ORD-" + Date.now(), // simple unique id
      date: new Date().toISOString(),
      status: "processing",
      total,
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      trackingNumber: null,
      shippingInfo,
      paymentMethod,
      currency,
    };

    addOrder(newOrder);   // ✅ save order into context
    clearCart();          // ✅ empty the cart
    navigate("/orders");  // ✅ go to My Orders page
  };

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
        <h1 className="text-4xl font-serif text-gray-800 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 ${
                step >= 1 ? "text-gray-800" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-gray-700 text-white" : "bg-gray-300"
                }`}
              >
                {step > 1 ? <CheckCircle className="w-5 h-5" /> : "1"}
              </div>
              <span className="hidden sm:inline font-medium">Shipping</span>
            </div>
            <div
              className={`w-12 h-0.5 ${
                step >= 2 ? "bg-gray-700" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex items-center gap-2 ${
                step >= 2 ? "text-gray-800" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-gray-700 text-white" : "bg-gray-300"
                }`}
              >
                2
              </div>
              <span className="hidden sm:inline font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-gray-700" />
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Shipping Information
                  </h2>
                </div>

                <form onSubmit={handleShippingSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.fullName}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-700 focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-700 focus:outline-none"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      required
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          address: e.target.value,
                        })
                      }
                      rows="3"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-700 focus:outline-none resize-none"
                      placeholder="House No., Street, Area"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-700 focus:outline-none"
                        placeholder="Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.state}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            state: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-700 focus:outline-none"
                        placeholder="Maharashtra"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.pincode}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            pincode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-700 focus:outline-none"
                        placeholder="400001"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gray-700 text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* Shipping Summary */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Delivering to:
                      </h3>
                      <p className="text-gray-700">{shippingInfo.fullName}</p>
                      <p className="text-gray-600 text-sm">
                        {shippingInfo.address}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {shippingInfo.city}, {shippingInfo.state} -{" "}
                        {shippingInfo.pincode}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {shippingInfo.phone}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-gray-700 text-sm hover:text-gray-900"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-6 h-6 text-gray-700" />
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-4 mb-6">
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-gray-700 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <img
                          src={razorpayLogo}
                          alt="Razorpay"
                          className="h-6 mb-2"
                        />
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-gray-700 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <img
                          src={stripeLogo}
                          alt="Stripe"
                          className="h-6 mb-2"
                        />
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-gray-700 transition-colors">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-medium font-bold text-gray-800">
                          Cash on Delivery
                        </p>
                      </div>
                    </label>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full bg-gray-700 text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary - Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6 pb-6 border-b">
                {cartItems.map((item) => (
                  <div key={item.key || item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-gray-700">
                        {currency}
                        {item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>
                    {currency}
                    {subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (18%)</span>
                  <span>
                    {currency}
                    {tax}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-800 mb-6">
                <span>Total</span>
                <span>
                  {currency}
                  {total}
                </span>
              </div>

              {/* Features */}
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-pink-400" />
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-pink-400" />
                  <span>Secure payment gateway</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-pink-400">♡</span>
                  <span>Easy returns within 7 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
