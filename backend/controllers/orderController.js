import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import razorpay from 'razorpay'
import crypto from "crypto";

const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
})
//place order using COD
// controllers/orderController.js
const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address, paymentMethod } = req.body;

    console.log("✅ PLACE ORDER BODY:", { userId, amount, paymentMethod });

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data",
      });
    }

    // ✅ Normalize items to GUARANTEE images is array
    const safeItems = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      price: item.price,

      // ✅ FORCE images to always be array in DB
      images: Array.isArray(item.images) ? item.images : [],
    }));

    const orderData = {
      userId,
      items: safeItems,     // ✅ now contains full image arrays
      amount,
      address,
      paymentMethod: paymentMethod || "COD",
      payment: false,
      date: Date.now(),
      status: "processing",
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // ✅ Clear backend cart completely
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.json({
      success: true,
      message: "Order placed",
      order: newOrder,
    });
  } catch (err) {
    console.error("❌ PLACE ORDER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Order failed",
    });
  }
};

//place order using Razorpay
// controllers/orderController.js
const placeOrderRazorpay = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated (userId missing).",
      });
    }

    const { items, amount, address, currency = "INR" } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: "No items in order.",
      });
    }

    // create local order (payment = false)
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "RAZORPAY",
      payment: false,
      date: Date.now(),
    };

    const newOrder = await orderModel.create(orderData);

    const options = {
      amount: Math.round(amount * 100),
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(), // just for your reference
    };

    const razorOrder = await razorpayInstance.orders.create(options);

    // save Razorpay order id on our order
    newOrder.razorpayOrderId = razorOrder.id;
    await newOrder.save();

    return res.json({
      success: true,
      order: razorOrder,  // Razorpay order
      dbOrder: newOrder,  // MongoDB order
    });
  } catch (error) {
    console.error("RAZORPAY PLACE ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to place order with Razorpay",
    });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const userId = req.userId;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing Razorpay payment details",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET; // 👈 matches your .env
    if (!secret) {
      console.error("❌ RAZORPAY_KEY_SECRET is not set in env");
      return res.status(500).json({
        success: false,
        message: "Payment configuration error on server",
      });
    }

    // 🔹 1) Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed",
      });
    }

    // 🔹 2) Mark our order as PAID
    const order = await orderModel.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, userId }, // match on both for safety
      {
        payment: true,
        razorpayPaymentId: razorpay_payment_id,
        status: "processing", // or "paid"/"confirmed"
      },
      { new: true }
    );

    if (!order) {
      console.error("❌ Order not found for razorpay_order_id:", razorpay_order_id);
      return res.status(404).json({
        success: false,
        message: "Order not found for this payment",
      });
    }

    // 🔹 3) CLEAR CART in DB
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    console.log("✅ Payment verified, cart cleared for user:", userId);

    // 🔹 4) Respond success so frontend can also clear local cart
    return res.json({
      success: true,
      message: "Payment verified & order confirmed",
      order,
    });
  } catch (error) {
    console.error("RAZORPAY VERIFY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

//all Orders for admin panel
const allOrder = async (req, res) => {
  try {
    const orders = await orderModel
      .find({
        $or: [
          { paymentMethod: "COD" },                  // ✅ ALL COD orders
          { paymentMethod: "RAZORPAY", payment: true } // ✅ ONLY PAID Razorpay
        ]
      })
      .populate("userId", "name email phone address")
      .populate({
        path: "items.productId",
        select: "name image images",
      })
      .sort({ date: -1 });

    return res.json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error("ALL ORDER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch filtered orders",
    });
  }
};




const userOrder = async (req, res) => {
  try {
    const userId = req.userId;   // ✅ set by authUser

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const orders = await orderModel
      .find({ userId })
      .sort({ date: -1 }); // latest first

    return res.json({ success: true, orders });
  } catch (err) {
    console.error("ORDER HISTORY ERROR", err);
    return res.status(500).json({
      success: false,
      message: "Order history failed",
    });
  }
};

//update order status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    console.log("UPDATE STATUS BODY:", { orderId, status });

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "orderId and status are required",
      });
    }

    const allowedStatuses = ["processing", "shipped", "delivered", "cancelled"];
    const normalizedStatus = status.toLowerCase();

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status: normalizedStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    console.log("✅ ORDER STATUS UPDATED:", {
      id: updatedOrder._id,
      status: updatedOrder.status,
    });

    return res.json({
      success: true,
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

export {placeOrder,placeOrderRazorpay,verifyRazorpayPayment,allOrder,userOrder,updateStatus}