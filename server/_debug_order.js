import "./loadEnv.js";
import mongoose from "mongoose";
import orderModel from "./models/orderModel.js";
import productModel from "./models/productModel.js";
import userModel from "./models/userModel.js";

console.log("models:", {
  User: !!mongoose.models.User,
  Users: !!mongoose.models.Users,
  Product: !!mongoose.models.Product,
  Order: !!mongoose.models.Order,
});

await mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
});
console.log("connected");

async function getAllOrdersLike() {
  const query = {};
  const totalOrders = await orderModel.countDocuments(query);
  const orders = await orderModel
    .find(query)
    .populate({ path: "items.product", select: "name images offerPrice" })
    .populate("userId", "name email phone")
    .sort({ createdAt: -1 })
    .skip(0)
    .limit(20)
    .lean();
  const [pendingCount, deliveredCount, revenueResult] = await Promise.all([
    orderModel.countDocuments({ status: "Order Placed" }),
    orderModel.countDocuments({ status: "Delivered" }),
    orderModel.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);
  return { totalOrders, orders: orders.length, pendingCount, deliveredCount, revenueResult };
}

try {
  const result = await getAllOrdersLike();
  console.log("OK:", JSON.stringify(result));
} catch (e) {
  console.error("REPRO ERROR:", e.message);
  console.error(e.stack);
} finally {
  process.exit(0);
}
