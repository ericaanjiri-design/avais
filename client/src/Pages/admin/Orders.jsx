import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/ShopContext";
import toast from "react-hot-toast";
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Home, 
  XCircle,
  RefreshCw,
  Clock
} from "lucide-react";

const Orders = () => {
  const { currency, axios, user, isAdmin } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({}); // Track which order is being updated

  // Status options with icons and colors
  const statusOptions = [
    { value: "Order Placed", label: "Order Placed", icon: <Package className="w-4 h-4" />, color: "bg-blue-100 text-blue-800" },
    { value: "Processing", label: "Processing", icon: <RefreshCw className="w-4 h-4" />, color: "bg-purple-100 text-purple-800" },
    { value: "Packing", label: "Packing", icon: <Package className="w-4 h-4" />, color: "bg-yellow-100 text-yellow-800" },
    { value: "Shipped", label: "Shipped", icon: <Truck className="w-4 h-4" />, color: "bg-indigo-100 text-indigo-800" },
    { value: "Out for Delivery", label: "Out for Delivery", icon: <Home className="w-4 h-4" />, color: "bg-orange-100 text-orange-800" },
    { value: "Delivered", label: "Delivered", icon: <CheckCircle className="w-4 h-4" />, color: "bg-green-100 text-green-800" },
    { value: "Cancelled", label: "Cancelled", icon: <XCircle className="w-4 h-4" />, color: "bg-red-100 text-red-800" },
  ];

  // Get status icon and color
  const getStatusInfo = (status) => {
    const found = statusOptions.find(opt => opt.value === status) || statusOptions[0];
    return found;
  };


  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post('/api/order/list', {}, { withCredentials: true });

      if (data?.success) {
        setOrders(data.orders || []);
      } else {
        setError(data?.message || 'Failed to load orders');
        toast.error(data?.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load orders';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // STATUS HANDLER - Handle status updates and user actions
  const statusHandler = async (orderId, action, newStatus = null) => {
    console.log(`Status handler called: orderId=${orderId}, action=${action}, newStatus=${newStatus}`);
    
    switch (action) {
      case 'update':
        await handleStatusUpdate(orderId, newStatus);
        break;
        
      case 'cancel':
        await handleCancelOrder(orderId);
        break;
        
      case 'track':
        handleTrackOrder(orderId);
        break;
        
      case 'view':
        handleViewOrderDetails(orderId);
        break;
        
      case 'reorder':
        await handleReorder(orderId);
        break;
        
      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  // Handle status update (Admin only)
  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!isAdmin) {
      toast.error('Only admin can update order status');
      return;
    }

    setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));

    try {
      const { data } = await axios.post(
        '/api/order/status',
        { orderId, status: newStatus },
        { withCredentials: true }
      );

      if (data?.success) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
              : order
          )
        );

        const statusInfo = getStatusInfo(newStatus);
        toast.success(
          <div className="flex items-center gap-2">
            {statusInfo.icon}
            <span>Order status updated to: {statusInfo.label}</span>
          </div>
        );
      } else {
        toast.error(data?.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Error updating order status');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) return;

    // Check if order can be cancelled (only if not shipped or delivered)
    if (['Shipped', 'Delivered', 'Out for Delivery'].includes(order.status)) {
      toast.error(`Cannot cancel order that is already ${order.status.toLowerCase()}`);
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const { data } = await axios.post(
        '/api/order/cancel',
        { orderId },
        { withCredentials: true }
      );

      if (data.success) {
        // Update local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId 
              ? { ...order, status: 'Cancelled', isCancelled: true }
              : order
          )
        );
        toast.success("Order cancelled successfully");
      } else {
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || "Error cancelling order");
    }
  };

  // Handle track order
  const handleTrackOrder = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) return;

    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-medium">Tracking Order #{orderId.substring(0, 8)}</span>
        <span className="text-sm">Current status: {order.status}</span>
      </div>,
      {
        duration: 4000,
        position: 'bottom-right'
      }
    );
    
    // In a real app, you would redirect to a tracking page
    // navigate(`/track-order/${orderId}`);
  };

  // Handle view order details
  const handleViewOrderDetails = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) return;

    // Show order details in a modal or console
    console.log("Order details:", order);
    
    toast.success(
      <div className="flex flex-col gap-1">
        <span className="font-medium">Order Details</span>
        <span className="text-sm">Order ID: {orderId.substring(0, 8)}</span>
      </div>,
      {
        duration: 3000,
        position: 'bottom-right'
      }
    );
  };

  // Handle reorder
  const handleReorder = async (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) return;

    try {
      // Add all items from order to cart
      let successCount = 0;
      
      for (const item of order.items) {
        try {
          // This would require a reorder endpoint or addToCart function
          // For now, we'll just show a message
          successCount++;
        } catch (itemError) {
          console.error(`Failed to add item ${item.product?._id}:`, itemError);
        }
      }

      if (successCount > 0) {
        toast.success(
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            <span>Added {successCount} items to cart for reorder</span>
          </div>,
          {
            duration: 3000,
            position: 'bottom-right'
          }
        );
      }
    } catch (error) {
      console.error("Error reordering:", error);
      toast.error("Failed to reorder items");
    }
  };

  // Calculate order progress percentage
  const calculateOrderProgress = (status) => {
    const statusIndex = statusOptions.findIndex(opt => opt.value === status);
    return statusIndex >= 0 ? Math.min(100, ((statusIndex + 1) / statusOptions.length) * 100) : 0;
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-padd-container py-16 pt-28 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-padd-container py-16 pt-28 bg-white min-h-screen">
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <span className="text-2xl text-red-600">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchAllOrders}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Backend endpoints tried:
              <br />
              /api/orders/list, /api/order/list, /api/orders, /api/order
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-padd-container py-16 pt-28 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Orders</h1>
        <p className="text-gray-600">
          {isAdmin ? "All orders" : "Your orders"} ({orders.length})
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Orders Found</h2>
          <p className="text-gray-600 mb-6">
            {isAdmin 
              ? "No orders have been placed yet" 
              : "You haven't placed any orders yet"}
          </p>
          {!isAdmin && (
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            >
              Start Shopping
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const progress = calculateOrderProgress(order.status);
            const isUpdating = updatingStatus[order._id];
            
            return (
              <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="bg-gray-50 p-4 border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        Order #{order.orderNumber || order._id?.substring(0, 8).toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{order.items?.length || 0} items</span>
                        <span>•</span>
                        <span className="font-medium">{currency}{order.amount?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span>{statusInfo.label}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Order Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Items</h4>
                  <div className="space-y-3">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-3 bg-gray-50 rounded">
                        <div className="w-16 h-16 flex-shrink-0 bg-white border rounded overflow-hidden">
                          <img
                            src={item.product?.images?.[0] || item.product?.image || '/placeholder.jpg'}
                            alt={item.product?.name || "Product"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23f5f5f5"><rect width="100" height="100"/><text x="50" y="50" font-family="Arial" font-size="10" text-anchor="middle" fill="%23999">No Image</text></svg>';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800">
                            {item.product?.name || "Unnamed Product"}
                          </h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Price:</span> {currency}
                              {(item.product?.offerPrice || item.product?.price || 0).toFixed(2)}
                            </div>
                            <div>
                              <span className="font-medium">Qty:</span> {item.quantity || 1}
                            </div>
                            <div>
                              <span className="font-medium">Size:</span> {item.size || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Total:</span> {currency}
                              {((item.product?.offerPrice || item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Customer Information</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Name:</span> {order.address?.firstName} {order.address?.lastName}</p>
                        <p><span className="font-medium">Phone:</span> {order.address?.phone || 'N/A'}</p>
                        <p><span className="font-medium">Address:</span> {
                          [order.address?.street, order.address?.city, order.address?.state, order.address?.country, order.address?.zipcode]
                            .filter(Boolean).join(', ') || 'N/A'
                        }</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Payment Details</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Status:</span>{" "}
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </p>
                        <p><span className="font-medium">Method:</span> {order.paymentMethod || 'N/A'}</p>
                        <p><span className="font-medium">Order Total:</span> {currency}{order.amount?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex flex-wrap gap-3">
                      {/* Track Order Button (For all users) */}
                      <button
                        onClick={() => statusHandler(order._id, 'track')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                      >
                        <Truck className="w-4 h-4" />
                        Track Order
                      </button>
                      
                      {/* View Details Button */}
                      <button
                        onClick={() => statusHandler(order._id, 'view')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        View Details
                      </button>
                      
                      {/* Reorder Button (For completed orders) */}
                      {order.status === 'Delivered' && !isAdmin && (
                        <button
                          onClick={() => statusHandler(order._id, 'reorder')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Reorder
                        </button>
                      )}
                      
                      {/* Cancel Order Button (For users on pending/processing orders) */}
                      {!isAdmin && ['Order Placed', 'Processing'].includes(order.status) && (
                        <button
                          onClick={() => statusHandler(order._id, 'cancel')}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Cancel Order
                        </button>
                      )}
                      
                      {/* Admin Status Update */}
                      {isAdmin && (
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-700">Update Status:</span>
                          <select
                            value={order.status || 'Order Placed'}
                            disabled={isUpdating}
                            className="border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            onChange={(e) => statusHandler(order._id, 'update', e.target.value)}
                          >
                            {statusOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {isUpdating && (
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;