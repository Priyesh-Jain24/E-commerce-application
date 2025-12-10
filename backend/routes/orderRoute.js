import express from 'express'
import {placeOrder,placeOrderRazorpay,allOrder,userOrder,verifyRazorpayPayment,updateStatus} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';


const orderRouter=express.Router();

orderRouter.get('/allorders',adminAuth,allOrder)
orderRouter.post('/status',adminAuth,updateStatus)


//payemnt
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)
orderRouter.post('/verify',authUser,verifyRazorpayPayment)

//user
orderRouter.post('/userorders',authUser,userOrder)



export default orderRouter;