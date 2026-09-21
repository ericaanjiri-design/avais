import "./loadEnv.js";
import mongoose from "mongoose";
import orderModel from "./models/orderModel.js";
import productModel from "./models/productModel.js";
import userModel from "./models/userModel.js";
import { getAllOrders } from "./controllers/orderController.js";

await mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
});
console.log("connected");
console.log("models:", {
  User: !!mongoose.models.User,
  Users: !!mongoose.models.Users,
  Product: !!mongoose.models.Product,
  Order: !!mongoose.models.Order,
});

let captured = [];
const origError = console.error;
console.error = (...args) => { captured.push(args.join(" ")); };

const sent = {};
const res = {
  status(code) { sent.code = code; return this; },
  json(obj) { sent.obj = obj; return this; },
};

try {
  await getAllOrders({ query: {} }, res);
} catch (e) {
  captured.push("UNCAUGHT: " + e.stack);
} finally {
  console.error = origError;
}

console.log("RESPONSE CODE:", sent.code);
console.log("RESPONSE BODY:", JSON.stringify(sent.obj));
console.log("CAPTURED STDERR:", captured.join("\n") || "(none)");
process.exit(0);
