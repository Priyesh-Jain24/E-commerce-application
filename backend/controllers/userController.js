import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};


const loginUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    let { email, password } = req.body;

    email = typeof email === "string" ? email.trim().toLowerCase() : "";
    password = typeof password === "string" ? password : "";

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. Find user
    const user = await userModel.findOne({ email });

    // Use same generic message to avoid user enumeration
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. Check password
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in .env");
      return res.status(500).json({
        success: false,
        message: "Server configuration error. Please try again later.",
      });
    }

    // 5. Create token
    const token = createToken(user._id);

    // 6. Send response (don’t send password back)
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    const isDev = process.env.NODE_ENV !== "production";

    return res.status(500).json({
      success: false,
      message: "Error logging in user",
      ...(isDev && { error: error.message }),
    });
  }
};



const registerUser = async (req, res) => {
  try {
    // 0. Basic body check
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    // Destructure + trim
    let { name, email, password } = req.body;

    name = typeof name === "string" ? name.trim() : "";
    email = typeof email === "string" ? email.trim().toLowerCase() : "";
    password = typeof password === "string" ? password : "";

    console.log("REGISTER BODY (sanitized):", {
      name,
      email,
      // ❌ never log password
    });

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // 2. Check if user already exists
    const exist = await userModel.findOne({ email });
    if (exist) {
      // 409 = Conflict
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // 3. Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // 4. Validate password strength (basic)
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // 5. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Save user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    // 7. Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in .env");
      return res.status(500).json({
        success: false,
        message: "Server configuration error. Please try again later.",
      });
    }

    // 8. Create JWT
    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    // Don't leak internal error details in production
    const isDev = process.env.NODE_ENV !== "production";

    return res.status(500).json({
      success: false,
      message: "Error registering user",
      ...(isDev && { error: error.message }),
    });
  }
};



const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        {
          email,
          role: "admin"   // ✅ role-based auth
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }   // ✅ expires in 1 day
      );

      return res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        token,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error logging in admin",
      error: error.message,
    });
  }
};


export { loginUser, registerUser, adminLogin };
