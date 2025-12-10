// middleware/auth.js
import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    // try custom "token" header first
    let token = req.headers.token;

    // also support Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!token && authHeader) {
      token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : authHeader.trim();
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // store userId on req, NOT in body
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authUser;
