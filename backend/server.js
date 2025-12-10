import express from 'express';
import 'dotenv/config';
import cors from 'cors'; 
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';


const app= express();
const PORT = process.env.PORT || 3000;
connectDB();
connectCloudinary();

//middleware to log requests
app.use(cors());
app.use(express.json());

//api endpoint
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order',orderRouter)

//test route

app.get('/', (req, res) => {
    res.send("Server is running");
});

//start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
