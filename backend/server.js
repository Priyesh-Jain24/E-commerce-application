import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ DB & Cloudinary
connectDB();
connectCloudinary();

// ✅ CORS (SECURE)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://frontend.vercel.app",
  "https://admin.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
