import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
        quantity: { type: Number, required: true },
        size: { type: String },
        price: { type: Number },
        name: { type: String }
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Order Placed" },
    paymentMethod: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    paymentIntentId: { type: String } // For Stripe payments
  },
  { timestamps: true }
);

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default orderModel;
