import express from "express";
import { addToCart, getCart, clearCart, removeFromCart } from "../controllers/cartController.js";
import authUser  from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", authUser, addToCart);
cartRouter.get("/get", authUser, getCart);
cartRouter.delete("/clear", authUser, clearCart);
cartRouter.delete("/remove", authUser, removeFromCart);

export default cartRouter;