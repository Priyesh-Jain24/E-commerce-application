// backend/controllers/cartController.js
import userModel from "../models/userModel.js";

// helper: safely get cartData as an object


// POST /api/cart/add
// body: { itemId, size }
// controllers/cartController.js

// controllers/cartController.js


// controllers/cartController.js

export const addToCart = async (req, res) => {
  try {
    const userId = req.userId; // set by auth middleware
    const { itemId, size } = req.body;

    console.log("ADD TO CART REQ BODY:", { userId, itemId, size });

    if (!userId || !itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "userId, itemId and size are required",
      });
    }

    // ensure user exists
    const userExists = await userModel.findById(userId).select("_id");
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // build the dynamic path: cartData.<itemId>.<size>
    const cartPath = `cartData.${itemId}.${size}`;

    // atomically increment quantity
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $inc: { [cartPath]: 1 },
      },
      {
        new: true,     // return updated document
        upsert: false, // don't create user document here
      }
    );

    console.log("✅ CART UPDATED:", updatedUser.cartData);

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: updatedUser.cartData,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add to cart",
    });
  }
};






// GET /api/cart/get

export const getCart = async (req, res) => {
  try {
    // userId now comes from auth middleware
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId missing in request",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartData =
      user.cartData && typeof user.cartData === "object"
        ? user.cartData
        : {};

    return res.status(200).json({
      success: true,
      cart: cartData,
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};



export const removeFromCart = async (req, res) => {
  try {
    // ✅ userId comes from authUser middleware
    const userId = req.userId;
    const { itemId, size } = req.body;

    console.log("REMOVE FROM CART REQ BODY:", { userId, itemId, size });

    if (!userId || !itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "userId, itemId and size are required",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("CART BEFORE REMOVE:", user.cartData);

    // cartData should be an object: { itemId: { size: qty } }
    let cartData =
      user.cartData &&
      typeof user.cartData === "object" &&
      !Array.isArray(user.cartData)
        ? user.cartData
        : {};

    if (!cartData[itemId] || !cartData[itemId][size]) {
      return res.status(400).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // 🔽 Decrease quantity / delete size / delete product
    if (cartData[itemId][size] > 1) {
      cartData[itemId][size] -= 1;
    } else {
      // remove this size
      delete cartData[itemId][size];

      // if this product has no sizes left, remove the product key
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }

    // ✅ assign back & ensure Mongoose tracks the change
    user.cartData = cartData;
    user.markModified("cartData"); // important when using plain Object
    await user.save();

    console.log("✅ CART AFTER REMOVE:", user.cartData);

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: cartData,
    });
  } catch (error) {
    console.error("REMOVE FROM CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove from cart",
    });
  }
};



// DELETE /api/cart/clear
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId missing in request",
      });
    }

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart: {},
    });
  } catch (error) {
    console.error("CLEAR CART ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};
