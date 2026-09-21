import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Initialize Stripe with environment variable
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

// Configuration from environment
const config = {
  deliveryCharges: 10,
  taxPercentage: 0.02,
  freeDeliveryThreshold: 50, // Free delivery for orders above $50
  currency: 'usd',
  
  // Status flow
  statusFlow: [
    "Order Placed",
    "Processing",
    "Packing",
    "Shipped",
    "Out for Delivery",
    "Delivered"
  ],
  
  // Cancellation window in hours
  cancellationWindow: 24,
  
  // App environment
  isDevelopment: process.env.APP_ENV === 'development',
  isProduction: process.env.APP_ENV === 'production'
};

// -------------------------------------------------------------
// VALIDATION HELPERS
// -------------------------------------------------------------
const validateOrderItems = async (items) => {
  const validationErrors = [];
  const validatedItems = [];
  
  for (const item of items) {
    if (!item.product || !item.quantity || item.quantity < 1) {
      validationErrors.push(`Invalid item data: ${JSON.stringify(item)}`);
      continue;
    }
    
    const product = await productModel.findById(item.product);
    if (!product) {
      validationErrors.push(`Product not found: ${item.product}`);
      continue;
    }
    
    if (product.stock !== undefined && product.stock !== null && product.stock < item.quantity) {
      validationErrors.push(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
      continue;
    }
    
    validatedItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.offerPrice,
      name: product.name,
      image: product.images?.[0] || ''
    });
  }
  
  return { validatedItems, validationErrors };
};

const calculateOrderAmount = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxAmount = subtotal * config.taxPercentage;
  
  // Check for free delivery
  const deliveryCharges = subtotal > config.freeDeliveryThreshold ? 0 : config.deliveryCharges;
  
  const totalAmount = subtotal + taxAmount + deliveryCharges;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    deliveryCharges,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    freeDeliveryEligible: subtotal > config.freeDeliveryThreshold
  };
};

// -------------------------------------------------------------
// CREATE STRIPE PAYMENT INTENT
// -------------------------------------------------------------
export const createPaymentIntent = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;

    // Validate request
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Cart is empty. Please add products to place an order." 
      });
    }

    if (!address || !address.street || !address.city || !address.zipCode) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a complete shipping address." 
      });
    }

    // Validate items and check stock
    const { validatedItems, validationErrors } = await validateOrderItems(items);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some items have issues",
        errors: validationErrors
      });
    }

    // Calculate amount
    const amountDetails = calculateOrderAmount(validatedItems);
    
    // Create payment intent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amountDetails.totalAmount * 100), // Convert to cents
      currency: config.currency,
      metadata: {
        userId: userId.toString(),
        items: JSON.stringify(validatedItems.map(item => ({
          product: item.product.toString(),
          quantity: item.quantity
        }))),
        address: JSON.stringify(address),
        appEnv: process.env.APP_ENV || 'development',
        store: 'MyTS Store'
      },
      description: `Order from MyTS Store`,
      shipping: {
        name: address.name || 'Customer',
        address: {
          line1: address.street,
          city: address.city,
          postal_code: address.zipCode,
          country: address.country || 'US'
        }
      }
    });

    // Log in development mode
    if (config.isDevelopment) {
      console.log(`💰 Stripe Payment Intent Created: ${paymentIntent.id}`);
      console.log(`🔑 Client Secret: ${paymentIntent.client_secret}`);
    }

    return res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY, // Send to frontend
      amount: amountDetails.totalAmount,
      paymentIntentId: paymentIntent.id,
      currency: paymentIntent.currency,
      testMode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_'),
      orderSummary: {
        subtotal: amountDetails.subtotal,
        tax: amountDetails.taxAmount,
        delivery: amountDetails.deliveryCharges,
        total: amountDetails.totalAmount,
        freeDelivery: amountDetails.freeDeliveryEligible
      }
    });

  } catch (error) {
    console.error("Stripe Payment Intent Error:", error.message);
    
    // Handle Stripe specific errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ 
        success: false, 
        message: `Payment failed: ${error.message}` 
      });
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payment request." 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: "Error creating payment. Please try again." 
    });
  }
};

// -------------------------------------------------------------
// PLACE ORDER USING CASH ON DELIVERY (COD)
// -------------------------------------------------------------
export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;

    // Validate request
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Cart is empty. Please add products to place an order." 
      });
    }

    if (!address || !address.street || !address.city || !(address.zipcode || address.zipCode)) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a complete shipping address." 
      });
    }

    // Validate items and check stock - skip stock check if stock field not used
    const { validatedItems, validationErrors } = await validateOrderItems(items);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot place order due to item issues",
        errors: validationErrors
      });
    }

    // Calculate amount
    const amountDetails = calculateOrderAmount(validatedItems);

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create order
    const order = await orderModel.create({
      userId,
      items: validatedItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      })),
      amount: amountDetails.totalAmount,
      subtotal: amountDetails.subtotal,
      taxAmount: amountDetails.taxAmount,
      deliveryCharges: amountDetails.deliveryCharges,
      address,
      orderNumber,
      paymentMethod: "COD",
      status: "Order Placed",
      environment: process.env.APP_ENV
    });

    // Update product stock
    for (const item of validatedItems) {
      await productModel.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear user cart
    await userModel.findByIdAndUpdate(userId, { 
      $set: { cartData: {} } 
    });

    // Log in development
    if (config.isDevelopment) {
      console.log(` COD Order Placed: ${order._id} for user: ${userId}`);
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully via Cash on Delivery",
      orderId: order._id,
      orderNumber: order.orderNumber,
      orderDetails: {
        amount: amountDetails.totalAmount,
        estimatedDelivery: "5-7 business days",
        status: order.status,
        paymentMethod: "Cash on Delivery"
      }
    });

  } catch (error) {
    console.error("COD Order Error:", error.message);
    
    if (config.isDevelopment) {
      console.error("Full error:", error);
    }
    
    return res.status(500).json({ 
      success: false, 
      message: "Failed to place order. Please try again." 
    });
  }
};

// -------------------------------------------------------------
// PLACE ORDER USING STRIPE (AFTER PAYMENT CONFIRMATION)
// -------------------------------------------------------------
export const placeOrderStripe = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.userId;

    if (!paymentIntentId) {
      return res.status(400).json({ 
        success: false, 
        message: "Payment intent ID is required." 
      });
    }

    // Verify payment intent
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ 
        success: false, 
        message: `Payment not completed. Status: ${paymentIntent.status}` 
      });
    }

    // Verify metadata
    if (paymentIntent.metadata.userId !== userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: "Payment intent does not belong to this user." 
      });
    }

    const items = JSON.parse(paymentIntent.metadata.items);
    const shippingAddress = JSON.parse(paymentIntent.metadata.address);

    // Validate items and check stock
    const { validatedItems, validationErrors } = await validateOrderItems(items);
    
    if (validationErrors.length > 0) {
      // Refund payment if items are invalid
      try {
        await stripeClient.refunds.create({
          payment_intent: paymentIntentId,
          reason: 'requested_by_customer'
        });
        
        if (config.isDevelopment) {
          console.log(`💸 Refund issued for invalid items: ${paymentIntentId}`);
        }
      } catch (refundError) {
        console.error("Refund failed:", refundError.message);
      }
      
      return res.status(400).json({
        success: false,
        message: "Order cannot be completed. Payment has been refunded.",
        errors: validationErrors
      });
    }

    // Calculate amount
    const amountDetails = calculateOrderAmount(validatedItems);

    // Verify payment amount matches calculated amount
    const paidAmount = paymentIntent.amount / 100;
    if (Math.abs(paidAmount - amountDetails.totalAmount) > 0.01) {
      return res.status(400).json({ 
        success: false, 
        message: "Payment amount mismatch. Please contact support." 
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create order
    const order = await orderModel.create({
      userId,
      items: validatedItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      })),
      amount: amountDetails.totalAmount,
      subtotal: amountDetails.subtotal,
      taxAmount: amountDetails.taxAmount,
      deliveryCharges: amountDetails.deliveryCharges,
      address: shippingAddress,
      orderNumber,
      paymentMethod: "Stripe",
      paymentIntentId,
      stripePaymentId: paymentIntentId,
      stripeChargeId: paymentIntent.latest_charge,
      isPaid: true,
      paidAt: new Date(),
      status: "Order Placed",
      environment: process.env.APP_ENV
    });

    // Update product stock
    for (const item of validatedItems) {
      await productModel.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear user cart
    await userModel.findByIdAndUpdate(userId, { 
      $set: { cartData: {} } 
    });

    // Log in development
    if (config.isDevelopment) {
      console.log(`💰 Stripe Order Placed: ${order._id}`);
      console.log(`💳 Payment: ${paymentIntentId} - Amount: $${amountDetails.totalAmount}`);
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: order._id,
      orderNumber: order.orderNumber,
      orderDetails: {
        amount: amountDetails.totalAmount,
        paymentStatus: "Paid",
        transactionId: paymentIntentId,
        status: order.status,
        paymentMethod: "Credit Card"
      }
    });

  } catch (error) {
    console.error("Stripe Order Placement Error:", error.message);
    
    if (config.isDevelopment) {
      console.error("Full error:", error);
    }
    
    // Handle specific Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payment information." 
      });
    }
    
    if (error.code === 'resource_missing') {
      return res.status(404).json({ 
        success: false, 
        message: "Payment intent not found." 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: "Failed to process order. Please contact support if payment was deducted." 
    });
  }
};

// -------------------------------------------------------------
// WEBHOOK FOR STRIPE PAYMENTS
// -------------------------------------------------------------
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // For development without webhook secret
    if (!process.env.STRIPE_WEBHOOK_SECRET && config.isDevelopment) {
      console.warn("⚠️ Running without webhook secret verification (development mode)");
      console.log("Webhook event:", JSON.stringify(req.body, null, 2));
      event = req.body;
    } else {
      event = stripeClient.webhooks.constructEvent(
        req.rawBody || req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log webhook events
  console.log(`🔔 Webhook received: ${event.type} (${process.env.APP_ENV})`);

  // Handle payment events
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`✅ Payment succeeded: ${paymentIntent.id}`);
      
      try {
        // Update order status if exists
        await orderModel.findOneAndUpdate(
          { paymentIntentId: paymentIntent.id },
          { 
            isPaid: true,
            paidAt: new Date(),
            status: "Order Placed",
            stripePaymentId: paymentIntent.id,
            stripeChargeId: paymentIntent.latest_charge
          },
          { new: true }
        );
        console.log(`📦 Order updated for payment ${paymentIntent.id}`);
      } catch (error) {
        console.error("Failed to update order from webhook:", error.message);
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log(`❌ Payment failed: ${failedPayment.id} - ${failedPayment.last_payment_error?.message}`);
      break;
      
    case 'charge.refunded':
      const refund = event.data.object;
      console.log(`💸 Refund processed: ${refund.id} for ${refund.payment_intent}`);
      
      try {
        await orderModel.findOneAndUpdate(
          { stripePaymentId: refund.payment_intent },
          { 
            status: "Refunded",
            refundedAt: new Date(),
            refundId: refund.id
          }
        );
      } catch (error) {
        console.error("Failed to update refund status:", error.message);
      }
      break;
      
    case 'checkout.session.completed':
      console.log("Checkout session completed");
      break;
  }

  res.json({ 
    received: true, 
    environment: process.env.APP_ENV,
    mode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'test' : 'live'
  });
};

// -------------------------------------------------------------
// USER ORDERS (frontend user dashboard)
// -------------------------------------------------------------
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10, status } = req.query;

    const query = { userId };
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Count total orders for pagination
    const totalOrders = await orderModel.countDocuments(query);
    
    const orders = await orderModel
      .find(query)
      .populate({
        path: "items.product",
        select: "name images offerPrice"
      })
      .select("-paymentIntentId -stripePaymentId -stripeChargeId") // Exclude sensitive data
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalOrders,
        pages: Math.ceil(totalOrders / limit)
      }
    });
  } catch (error) {
    console.error("Get User Orders Error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch orders." 
    });
  }
};

// -------------------------------------------------------------
// ADMIN — GET ALL ORDERS
// -------------------------------------------------------------
export const getAllOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      paymentMethod,
      startDate,
      endDate,
      search 
    } = req.query;

    const query = {};

    // Apply filters
    if (status && status !== 'all') {
      query.status = status;
    }

    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Search by order ID, order number, or customer email
    if (search) {
      query.$or = [
        { _id: search },
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'userId.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Count total for pagination
    const totalOrders = await orderModel.countDocuments(query);

    const orders = await orderModel
      .find(query)
      .populate({
        path: "items.product",
        select: "name images offerPrice"
      })
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean(); // Convert to plain objects for performance

    // Calculate summary stats
    const [pendingCount, deliveredCount, revenueResult] = await Promise.all([
      orderModel.countDocuments({ status: "Order Placed" }),
      orderModel.countDocuments({ status: "Delivered" }),
      orderModel.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    return res.json({
      success: true,
      orders,
      summary: {
        total: totalOrders,
        pending: pendingCount,
        delivered: deliveredCount,
        totalRevenue: revenueResult[0]?.total || 0
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalOrders,
        pages: Math.ceil(totalOrders / limit)
      }
    });

  } catch (error) {
    console.error("Get All Orders Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders."
    });
  }
};

// -------------------------------------------------------------
// UPDATE ORDER STATUS (ADMIN)
// -------------------------------------------------------------
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, notes } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ 
        success: false, 
        message: "Order ID and status are required." 
      });
    }

    const validStatuses = [
      "Order Placed",
      "Processing",
      "Packing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status. Valid statuses: " + validStatuses.join(", ") 
      });
    }

    const updateData = { status };
    
    // Add status change timestamp
    if (status === "Shipped") {
      updateData.shippedAt = new Date();
    } else if (status === "Delivered") {
      updateData.deliveredAt = new Date();
    } else if (status === "Cancelled") {
      updateData.cancelledAt = new Date();
      
      // If order is cancelled, restore product stock
      const order = await orderModel.findById(orderId);
      if (order && order.items.length > 0) {
        for (const item of order.items) {
          await productModel.findByIdAndUpdate(
            item.product,
            { $inc: { stock: item.quantity } }
          );
        }
        
        // Initiate refund if paid via Stripe
        if (order.paymentMethod === "Stripe" && order.isPaid && order.stripePaymentId) {
          try {
            const refund = await stripeClient.refunds.create({
              payment_intent: order.stripePaymentId,
              reason: 'requested_by_customer'
            });
            
            updateData.refundId = refund.id;
            updateData.refundedAt = new Date();
            
            if (config.isDevelopment) {
              console.log(`💸 Refund created: ${refund.id} for order ${orderId}`);
            }
          } catch (refundError) {
            console.error("Refund failed:", refundError.message);
          }
        }
      }
    }

    // Add admin notes if provided
    if (notes) {
      updateData.adminNotes = notes;
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate("userId", "email name");

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found." 
      });
    }

    // TODO: Send notification to user about status change

    return res.json({ 
      success: true, 
      message: "Order status updated successfully.",
      order 
    });

  } catch (error) {
    console.error("Update Status Error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to update order status." 
    });
  }
};

// -------------------------------------------------------------
// GET SINGLE ORDER DETAILS
// -------------------------------------------------------------
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;
    const isAdmin = req.admin || false;

    const order = await orderModel
      .findById(orderId)
      .populate({
        path: "items.product",
        select: "name images offerPrice description category"
      })
      .populate("userId", "name email phone address")
      .lean(); // Convert to plain object

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found." 
      });
    }

    // Check authorization
    if (!isAdmin && order.userId._id.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. You can only view your own orders." 
      });
    }

    // Calculate item details and totals
    const itemsWithTotals = order.items.map(item => ({
      ...item,
      total: item.quantity * item.price,
      product: item.product || null
    }));

    const orderDetails = {
      ...order,
      items: itemsWithTotals,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      summary: {
        subtotal: order.subtotal || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        tax: order.taxAmount || 0,
        delivery: order.deliveryCharges || 0,
        total: order.amount
      }
    };

    return res.json({ 
      success: true, 
      order: orderDetails 
    });

  } catch (error) {
    console.error("Get Order Details Error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch order details." 
    });
  }
};

// -------------------------------------------------------------
// CANCEL ORDER (USER)
// -------------------------------------------------------------
export const cancelOrder = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    const userId = req.userId;

    if (!orderId) {
      return res.status(400).json({ 
        success: false, 
        message: "Order ID is required." 
      });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found." 
      });
    }

    // Check authorization
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only cancel your own orders." 
      });
    }

    // Check if order can be cancelled
    const nonCancellableStatuses = ["Shipped", "Out for Delivery", "Delivered"];
    if (nonCancellableStatuses.includes(order.status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Order cannot be cancelled as it is already ${order.status.toLowerCase()}.` 
      });
    }

    // Check cancellation window (24 hours)
    const orderAge = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60);
    if (orderAge > config.cancellationWindow) {
      return res.status(400).json({ 
        success: false, 
        message: "Cancellation window (24 hours) has passed." 
      });
    }

    // Update order status
    const updateData = {
      status: "Cancelled",
      cancelledAt: new Date(),
      cancellationReason: reason || "Requested by user",
      cancelledBy: "user"
    };

    // Restore product stock
    for (const item of order.items) {
      await productModel.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    // Initiate refund if paid via Stripe
    if (order.paymentMethod === "Stripe" && order.isPaid && order.stripePaymentId) {
      try {
        const refund = await stripeClient.refunds.create({
          payment_intent: order.stripePaymentId,
          reason: 'requested_by_customer'
        });
        
        updateData.refundId = refund.id;
        updateData.refundedAt = new Date();
        
        if (config.isDevelopment) {
          console.log(`💸 User refund created: ${refund.id} for order ${orderId}`);
        }
      } catch (refundError) {
        console.error("Refund failed:", refundError.message);
      }
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );

    return res.json({ 
      success: true, 
      message: "Order cancelled successfully.",
      order: updatedOrder
    });

  } catch (error) {
    console.error("Cancel Order Error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to cancel order." 
    });
  }
};

// -------------------------------------------------------------
// GET ORDER STATISTICS (ADMIN)
// -------------------------------------------------------------
export const getOrderStatistics = async (req, res) => {
  try {
    const { period = 'month' } = req.query; // day, week, month, year
    
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    const stats = await orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: "Cancelled" }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
          averageOrderValue: { $avg: "$amount" }
        }
      }
    ]);

    const statusCounts = await orderModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const paymentMethodStats = await orderModel.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          total: { $sum: "$amount" }
        }
      }
    ]);

    return res.json({
      success: true,
      statistics: {
        period,
        ...stats[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 },
        statusDistribution: statusCounts,
        paymentMethods: paymentMethodStats,
        environment: process.env.APP_ENV
      }
    });

  } catch (error) {
    console.error("Get Statistics Error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch statistics." 
    });
  }
};