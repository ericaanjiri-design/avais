import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { FaMinus, FaPlus } from 'react-icons/fa6'
import { FaShoppingCart } from 'react-icons/fa' // Fixed import
import { IoCloseCircleOutline } from "react-icons/io5"
import CartTotal from '../components/CartTotal'

const Cart = () => {
  const { navigate, products, cartItems, updateQuantity, currency } = useContext(ShopContext)
  const [cartData, setCartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (products && products.length > 0) {
      const tempData = []
      if (cartItems) {
        for (const itemId in cartItems) {
          for (const size in cartItems[itemId]) {
            if (cartItems[itemId][size] > 0) {
              tempData.push({
                _id: itemId,
                size: size,
              })
            }
          }
        }
      }
      setCartData(tempData)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [products, cartItems])

  const increment = (id, size) => {
    const currQuantity = cartItems?.[id]?.[size] || 0
    if (updateQuantity) {
      updateQuantity(id, size, currQuantity + 1)
    }
  }

  const decrement = (id, size) => {
    const currQuantity = cartItems?.[id]?.[size] || 0
    if (currQuantity > 1 && updateQuantity) {
      updateQuantity(id, size, currQuantity - 1)
    }
  }

  // Helper function to get product image
  const getProductImage = (product) => {
    if (!product) return ''
    
    // Try images array first
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0]
    }
    
    // Then try image field (could be string or array)
    if (product.image) {
      if (Array.isArray(product.image) && product.image.length > 0) {
        return product.image[0]
      }
      if (typeof product.image === 'string') {
        return product.image
      }
    }
    
    return ''
  }

  // Helper function to get product price
  const getProductPrice = (product) => {
    return product?.offerPrice || product?.price || 0
  }

  // Loading state
  if (loading) {
    return (
      <div className='max-padd-container py-16 pt-28 bg-white min-h-screen flex items-center justify-center'>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  // Empty cart state
  if (!cartItems || Object.keys(cartItems).length === 0 || cartData.length === 0) {
    return (
      <div className='max-padd-container py-16 pt-28 bg-white min-h-screen'>
        <Title title1={"Your"} title2={"Cart"} titleStyles={'pb-5'} />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <FaShoppingCart className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h3>
          <p className="text-gray-600 mb-8 max-w-md text-center">
            Looks like you haven't added any products to your cart yet.
          </p>
          <button
            onClick={() => navigate && navigate('/')}
            className="btn-dark px-8 py-3"
          >
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='max-padd-container py-16 pt-28 bg-white min-h-screen'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        
        {/* Left side - Cart Items */}
        <div className='lg:col-span-2'>
          <Title title1={"Your"} title2={"Cart"} titleStyles={'pb-6'} />

          {/* Header row */}
          <div className="hidden md:grid grid-cols-6 font-medium bg-gray-100 p-4 rounded-lg mb-4">
            <h5 className='col-span-3 text-left font-semibold text-gray-700'>Product Details</h5>
            <h5 className='text-center font-semibold text-gray-700'>Subtotal</h5>
            <h5 className='text-center col-span-2 font-semibold text-gray-700'>Action</h5>
          </div>

          {/* Cart Items */}
          {cartData.map((item, i) => {
            const product = products.find((p) => p._id === item._id)
            const quantity = cartItems?.[item._id]?.[item.size] || 0

            if (!product) return null

            const imageSrc = getProductImage(product)
            const price = getProductPrice(product)
            const subtotal = price * quantity

            return (
              <div key={`${item._id}-${item.size}-${i}`} 
                   className="grid grid-cols-1 md:grid-cols-6 items-center bg-white border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
                
                {/* Product Info - Mobile First */}
                <div className='md:col-span-3 flex items-start md:items-center gap-4 mb-4 md:mb-0'>
                  <div className="relative">
                    <img 
                      src={imageSrc} 
                      alt={product.name || "Product image"}
                      className='w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg shadow'
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg'
                        e.target.className = 'w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg shadow bg-gray-100'
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <h5 className='font-semibold text-gray-800 line-clamp-1 hover:text-blue-600 cursor-pointer'
                        onClick={() => navigate && navigate(`/collection/${product.category?.toLowerCase()}/${product._id}`)}>
                      {product.name || "Unnamed Product"}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">Size: <span className="font-medium">{item.size}</span></p>
                    
                    {/* Price for mobile */}
                    <div className="md:hidden mt-2">
                      <p className="font-semibold text-gray-800">
                        {currency}{subtotal.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => decrement(item._id, item.size)}
                        className='p-2 bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200 transition-colors'
                        aria-label="Decrease quantity"
                      >
                        <FaMinus className='text-xs text-gray-700' />
                      </button>
                      <span className="font-medium min-w-[30px] text-center">{quantity}</span>
                      <button
                        onClick={() => increment(item._id, item.size)}
                        className='p-2 bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200 transition-colors'
                        aria-label="Increase quantity"
                      >
                        <FaPlus className='text-xs text-gray-700' />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtotal - Hidden on mobile */}
                <p className='hidden md:block text-center font-semibold text-lg text-gray-800'>
                  {currency}{subtotal.toFixed(2)}
                </p>

                {/* Remove button */}
                <div className="md:col-span-2 flex justify-end md:justify-center mt-4 md:mt-0">
                  <button
                    onClick={() => updateQuantity && updateQuantity(item._id, item.size, 0)}
                    className='text-red-500 hover:text-red-700 transition-colors flex items-center gap-2 group'
                    aria-label="Remove item"
                  >
                    <IoCloseCircleOutline className='text-2xl group-hover:scale-110 transition-transform' />
                    <span className="md:hidden text-sm font-medium">Remove</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right side - Cart Summary */}
        <div className='lg:col-span-1'>
          <div className='sticky top-32 w-full p-6 border border-gray-200 rounded-xl shadow-sm bg-white'>
            <h3 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b">Order Summary</h3>
            <CartTotal />
            <button 
              onClick={() => navigate && navigate('/place-orders')}
              className='btn-dark w-full mt-6 py-3.5 font-semibold hover:bg-gray-900 transition-colors'
            >
              Proceed to Checkout
            </button>
            
            {/* Continue shopping link */}
            <button
              onClick={() => navigate && navigate('/')}
              className='w-full mt-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-800 hover:bg-gray-50 transition-colors'
            >
              Continue Shopping
            </button>
            
            {/* Cart info */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600">
              <p className="mb-2">📦 Free shipping on orders over {currency}50</p>
              <p> Secure checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart