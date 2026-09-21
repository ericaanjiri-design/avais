import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import toast from "react-hot-toast";

const MyOrders = () => {
  const { currency, user } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch user orders securely
  const loadOrderData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/userorders`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();

      if (data?.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('❌ Error loading orders:', error);
      toast.error('Failed to load your orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch on mount and when user changes
  useEffect(() => {
    loadOrderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ✅ Format amount safely
  const formatAmount = (amount) => {
    if (typeof amount !== 'number') {
      try {
        amount = parseFloat(amount) || 0;
      } catch {
        amount = 0;
      }
    }
    return amount.toFixed(2);
  };

  // ✅ Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toDateString();
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="max-padd-container py-16 pt-28 bg-white min-h-screen">
      <Title title1="My Orders" title2="List" titleStyles="pb-10" />

      {/* 🔹 Loading State */}
      {loading && (
        <p className="text-center text-gray-500 animate-pulse">Loading orders...</p>
      )}

      {/* 🔹 Empty State */}
      {!loading && orders.length === 0 && (
        <p className="text-center text-gray-600">No orders found.</p>
      )}

      {/* 🔹 Orders List */}
      {!loading &&
        orders.map((order) => (
          <div
            key={order._id || Math.random()}
            className="bg-white p-4 mt-6 rounded-md shadow-sm border border-gray-200"
          >
            {/* 🔸 Order Items */}
            {Array.isArray(order.items) &&
              order.items.map((item, idx) => {
                const product = item?.product
                const imageSrc = product?.images?.[0] || product?.image?.[0] || product?.image || '/placeholder.png'
                const name = product?.name || item?.name || 'Unnamed Product'
                const price = item?.price || product?.offerPrice || product?.price || 0

                return (
                  <div
                    key={idx}
                    className="flex items-start gap-4 mb-4 border-b border-gray-100 pb-3 last:border-none"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 flex justify-center items-center border rounded bg-gray-50">
                      <img
                        src={imageSrc}
                        alt={name}
                        className="max-h-20 max-w-20 object-contain"
                        onError={(e) => (e.target.src = "/placeholder.png")}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 capitalize">{name}</h5>
                      <div className="flex flex-wrap gap-4 text-sm mt-1 text-gray-600">
                        <p>Price: {currency}{formatAmount(price)}</p>
                        <p>Quantity: {item?.quantity ?? 1}</p>
                        {item?.size && <p>Size: {item.size}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* 🔸 Order Summary */}
            <div className="border-t border-gray-200 pt-3 mt-2 text-sm text-gray-700">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                {/* Left Column */}
                <div className="flex flex-col gap-1">
                  <p>
                    <span className="font-medium">Order ID:</span>{" "}
                    <span className="text-gray-500 text-xs break-all">
                      {order._id || "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Payment Status:</span>{" "}
                    {order.isPaid ? "Paid" : "Pending"}
                  </p>
                  <p>
                    <span className="font-medium">Method:</span>{" "}
                    {order.paymentMethod || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <span className="flex items-center gap-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-500"
                            : order.status === "Cancelled"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      {order.status || "Processing"}
                    </span>
                  </p>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-1 sm:text-right">
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {formatDate(order.createdAt)}
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span>{" "}
                    {currency}
                    {formatAmount(order.amount ?? 0)}
                  </p>
                </div>
              </div>

              {/* 🔸 Track Order Button */}
              <div className="mt-3">
                <button
                  onClick={() =>
                    toast.success(`Tracking order: ${order._id || "N/A"}`)
                  }
                  className="btn-dark py-1 px-3 text-xs rounded-sm"
                >
                  Track Order
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MyOrders;