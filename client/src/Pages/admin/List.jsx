import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../../context/ShopContext";
import toast from "react-hot-toast";

const List = () => {
  const { axios, currency } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/product/list");
      if (data?.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
        toast.error(data?.message || "No products found.");
      }
    } catch (error) {
      console.error("🚨 Fetch products error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-12 h-[90vh] bg-white flex items-center justify-center rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8 m-2 bg-white rounded-xl min-h-[90vh]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product List</h2>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
          <div className="text-gray-400 text-6xl mb-3">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-1">
            No Products Found
          </h3>
          <p className="text-gray-500 mb-4">
            There are no products to display at the moment.
          </p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <img
                src={product.image?.[0] || "/placeholder-image.jpg"}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-3"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {product.description || "No description available."}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-blue-600 font-medium">
                  {currency}
                  {product.offerPrice || product.price}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${
                    product.inStock
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-red-100 text-red-700 border-red-200"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default List;
