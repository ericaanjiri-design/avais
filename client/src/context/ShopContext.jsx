import React, { createContext, useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'

// ✅ Axios defaults
axios.defaults.withCredentials = true
if (import.meta.env.VITE_BACKEND_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL
}

export const ShopContext = createContext()

const ShopContextProvider = ({ children }) => {
  const navigate = useNavigate()
  const currency = import.meta.env.VITE_CURRENCY || '$'
  const delivery_charges = 10

  // ✅ Load user & cart instantly from localStorage (persistence)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch (error) {
      console.error('Error parsing user from localStorage:', error)
      return null
    }
  })

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      const parsedCart = savedCart ? JSON.parse(savedCart) : {}
      // Ensure it's a valid object
      return parsedCart && typeof parsedCart === 'object' && !Array.isArray(parsedCart) 
        ? parsedCart 
        : {}
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error)
      return {}
    }
  })

  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserLogin, setShowUserLogin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // ✅ Fetch products with better error handling
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/products/list')
      if (data?.success && Array.isArray(data.products)) {
        setProducts(data.products)
      } else {
        toast.error(data?.message || 'Failed to load products')
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error(error.response?.data?.message || 'Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  // ✅ Verify user session
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.post('/api/user/is-auth')
      
      if (data?.success && data.user) {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Merge local cart with server cart
        if (data.user.cartData && typeof data.user.cartData === 'object') {
          // Merge strategy: keep larger quantities
          const mergedCart = { ...cartItems }
          for (const itemId in data.user.cartData) {
            if (data.user.cartData[itemId] && typeof data.user.cartData[itemId] === 'object') {
              if (!mergedCart[itemId]) mergedCart[itemId] = {}
              for (const size in data.user.cartData[itemId]) {
                const serverQty = data.user.cartData[itemId][size] || 0
                const localQty = mergedCart[itemId]?.[size] || 0
                mergedCart[itemId][size] = Math.max(serverQty, localQty)
              }
            }
          }
          setCartItems(mergedCart)
          localStorage.setItem('cart', JSON.stringify(mergedCart))
        }
      } else {
        setUser(null)
        localStorage.removeItem('user')
      }
    } catch (error) {
      console.log('User verification failed:', error.message)
      setUser(null)
      localStorage.removeItem('user')
    }
  }, [cartItems])

  // ✅ Called after login success
  const handleLoginSuccess = useCallback(async () => {
    await fetchUser()
    navigate('/')
  }, [fetchUser, navigate])

  // ✅ Logout
  const logoutUser = useCallback(async () => {
    try {
      await axios.post('/api/user/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setCartItems({})
      setIsAdmin(false)
      localStorage.removeItem('user')
      localStorage.removeItem('cart')
      toast.success('Logged out successfully')
      navigate('/')
    }
  }, [navigate])

  // ✅ Fetch admin session
  const fetchAdmin = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/is-auth')
      setIsAdmin(!!data?.success)
    } catch {
      setIsAdmin(false)
    }
  }, [])

  // ✅ FIXED: Add to cart function - More robust
  const addToCart = useCallback(async (itemId, size = 'M') => {
    try {
      // ✅ Validate inputs
      if (!itemId || typeof itemId !== 'string') {
        toast.error('Invalid product')
        return false
      }

      if (!size || typeof size !== 'string') {
        toast.error('Please select size first')
        return false
      }

      // ✅ Ensure cartItems is always an object
      const currentCart = cartItems && typeof cartItems === 'object' && !Array.isArray(cartItems) 
        ? { ...cartItems } 
        : {}
      
      // ✅ Initialize itemId if it doesn't exist
      if (!currentCart[itemId]) {
        currentCart[itemId] = {}
      }
      
      // ✅ Initialize size if it doesn't exist and add quantity
      const currentQuantity = Number(currentCart[itemId][size]) || 0
      const newQuantity = currentQuantity + 1
      currentCart[itemId][size] = newQuantity

      // ✅ Check stock availability (if product data is available)
      const product = products.find(p => p?._id === itemId)
      if (product && product.stock !== undefined && product.stock < newQuantity) {
        toast.error(`Only ${product.stock} items available in stock`)
        return false
      }

      // ✅ Update state and localStorage
      setCartItems(currentCart)
      localStorage.setItem('cart', JSON.stringify(currentCart))

      // ✅ Sync with backend if logged in
      if (user) {
        try {
          const { data } = await axios.post('/api/cart/add', { 
            itemId, 
            size,
            quantity: newQuantity 
          })
          if (data?.success) {
            toast.success(data.message || 'Added to cart successfully')
          }
        } catch (error) {
          console.error('Backend cart sync failed:', error)
          // Don't show error toast here to avoid double notifications
        }
      }

      toast.success('Added to cart!')
      return true

    } catch (error) {
      console.error('Error in addToCart:', error)
      toast.error('Failed to add item to cart')
      return false
    }
  }, [cartItems, products, user])

  // ✅ FIXED: Get total cart count - Memoized for performance
  const getCartCount = useCallback(() => {
    try {
      if (!cartItems || typeof cartItems !== 'object' || Array.isArray(cartItems)) return 0
      
      let count = 0
      for (const itemId in cartItems) {
        if (cartItems[itemId] && typeof cartItems[itemId] === 'object') {
          for (const size in cartItems[itemId]) {
            const quantity = Number(cartItems[itemId][size]) || 0
            if (quantity > 0) {
              count += quantity
            }
          }
        }
      }
      return count
    } catch (error) {
      console.error('Error calculating cart count:', error)
      return 0
    }
  }, [cartItems])

  // ✅ FIXED: Update quantity - More robust
  const updateQuantity = useCallback((itemId, size, quantity) => {
    try {
      // ✅ Validate inputs
      if (!itemId || !size || quantity === undefined || quantity === null) {
        toast.error('Invalid quantity update parameters')
        return
      }

      const quantityNum = Number(quantity)
      if (isNaN(quantityNum) || quantityNum < 0) {
        toast.error('Invalid quantity')
        return
      }

      const currentCart = cartItems && typeof cartItems === 'object' && !Array.isArray(cartItems) 
        ? { ...cartItems } 
        : {}
      
      // ✅ Initialize itemId if it doesn't exist
      if (!currentCart[itemId]) {
        currentCart[itemId] = {}
      }

      // ✅ Check stock before updating
      if (quantityNum > 0) {
        const product = products.find(p => p?._id === itemId)
        if (product && product.stock !== undefined && product.stock < quantityNum) {
          toast.error(`Only ${product.stock} items available in stock`)
          return
        }
      }

      if (quantityNum <= 0) {
        // Remove the size entry
        delete currentCart[itemId][size]
        // Remove the item entry if no sizes left
        if (Object.keys(currentCart[itemId]).length === 0) {
          delete currentCart[itemId]
        }
      } else {
        // Update quantity
        currentCart[itemId][size] = quantityNum
      }

      setCartItems(currentCart)
      localStorage.setItem('cart', JSON.stringify(currentCart))

      // ✅ Sync with backend if logged in
      if (user && quantityNum > 0) {
        axios.post('/api/cart/update', { itemId, size, quantity: quantityNum })
          .catch(err => console.error('Cart sync error:', err))
      }

    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.error('Failed to update quantity')
    }
  }, [cartItems, products, user])

  // ✅ FIXED: Calculate total amount - Memoized for performance
  const getCartAmount = useCallback(() => {
    try {
      if (!cartItems || typeof cartItems !== 'object' || Array.isArray(cartItems)) return 0
      if (!Array.isArray(products)) return 0
      
      let total = 0
      for (const itemId in cartItems) {
        const product = products.find(p => p && p._id === itemId)
        if (!product) continue
        
        const itemData = cartItems[itemId]
        if (itemData && typeof itemData === 'object') {
          for (const size in itemData) {
            const quantity = Number(itemData[size]) || 0
            if (quantity > 0) {
              const price = Number(product.offerPrice || product.price || 0)
              total += price * quantity
            }
          }
        }
      }
      return Number(total.toFixed(2))
    } catch (error) {
      console.error('Error calculating cart amount:', error)
      return 0
    }
  }, [cartItems, products])

  // ✅ Remove from cart function
  const removeFromCart = useCallback((itemId, size) => {
    updateQuantity(itemId, size, 0)
  }, [updateQuantity])

  // ✅ Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems({})
    localStorage.removeItem('cart')
    toast.success('Cart cleared')
  }, [])

  // ✅ Check if item is in cart
  const isInCart = useCallback((itemId, size = null) => {
    try {
      if (!cartItems || !cartItems[itemId]) return false
      if (size === null) return true // Just check if item exists
      return Number(cartItems[itemId]?.[size]) > 0
    } catch {
      return false
    }
  }, [cartItems])

  // ✅ Run on first load
  useEffect(() => {
    fetchProducts()
    fetchAdmin()
    
    // Verify user if token exists
    const userToken = localStorage.getItem('user')
    if (userToken) {
      fetchUser()
    }
  }, [fetchProducts, fetchAdmin, fetchUser])

  // Memoized context value for performance
  const contextValue = useMemo(() => ({
    navigate,
    user,
    setUser,
    products,
    fetchProducts,
    searchQuery,
    setSearchQuery,
    currency,
    showUserLogin,
    setShowUserLogin,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    delivery_charges,
    isAdmin,
    setIsAdmin,
    axios,
    handleLoginSuccess,
    logoutUser,
    fetchUser,
    loading,
  }), [
    navigate,
    user,
    products,
    fetchProducts,
    searchQuery,
    currency,
    showUserLogin,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    delivery_charges,
    isAdmin,
    handleLoginSuccess,
    logoutUser,
    fetchUser,
    loading,
  ])

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider