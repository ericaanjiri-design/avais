import express from "express";
import authAdmin from "../middlewares/authAdmin.js";
import authUser from "../middlewares/authUser.js";

// Import the correct function names from orderController.js
import {
  getAllOrders,           // Changed from allOrders
  placeOrderCOD,          // Changed from placedOrderCOD
  placeOrderStripe,
  updateOrderStatus,      // Changed from updateStatus
  getUserOrders,          // Changed from userOrders
  getOrderDetails,
  createPaymentIntent,    // If you need this
  cancelOrder,            // If you need this
  getOrderStatistics      // If you need this
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Admin routes
orderRouter.post('/list', authAdmin, getAllOrders);          // Fixed: getAllOrders
orderRouter.post('/status', authAdmin, updateOrderStatus);   // Fixed: updateOrderStatus
orderRouter.get('/admin/:orderId', authAdmin, getOrderDetails);  // Changed path to avoid conflict
orderRouter.get('/statistics', authAdmin, getOrderStatistics);   // If you need statistics

// User routes
orderRouter.post('/cod', authUser, placeOrderCOD);           // Fixed: placeOrderCOD
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/payment-intent', authUser, createPaymentIntent); // If you need payment intent
orderRouter.post('/userorders', authUser, getUserOrders);    // Fixed: getUserOrders
orderRouter.get('/user/:orderId', authUser, getOrderDetails); // Changed path to avoid conflict
orderRouter.post('/cancel', authUser, cancelOrder);          // If you need cancel order
orderRouter.get('/details/:orderId', authUser, getOrderDetails); // Alternative path

export default orderRouter;