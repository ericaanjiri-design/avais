import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import toast from "react-hot-toast"

const Login = () => {
  const { setShowUserLogin, setUser, navigate, axios, fetchUser } = useContext(ShopContext)
  const [state, setState] = useState('login')
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const resetForm = () => {
    setName("")
    setEmail("")
    setPassword("")
  }

  const switchState = (newState) => {
    setState(newState)
    resetForm()
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const { data } = await axios.post(`/api/user/${state}`, { 
        ...(state === 'register' && { name }), 
        email, 
        password 
      })

      if (data.success) {
        toast.success(state === 'register' ? 'Account Created Successfully!' : 'Login Successful!')

        // ✅ Save token and user data in localStorage
        if (data.token) {
          localStorage.setItem("token", data.token)
        }
        localStorage.setItem("user", JSON.stringify(data.user))

        // ✅ Update user state in context
        setUser(data.user || null)

        // ✅ Hide modal and redirect
        setShowUserLogin(false)
        navigate('/')
        
        // Reset form
        resetForm()
      } else {
        toast.error(data.message || 'Something went wrong!')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'An error occurred!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackdropClick = () => {
    setShowUserLogin(false)
    resetForm()
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed top-0 bottom-0 left-0 right-0 z-40 flex items-center justify-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-4 w-80 sm:w-96 rounded-lg shadow-xl border border-gray-200 bg-white p-6"
      >
        <div className="text-center mb-2">
          <h3 className="bold-24 text-gray-900">
            {state === "login" ? "User Login" : "Create Account"}
          </h3>
          <p className="regular-14 text-gray-500 mt-1">
            {state === "login" ? "Welcome back!" : "Join us today!"}
          </p>
        </div>

        {state === "register" && (
          <div className="w-full">
            <label htmlFor="name" className="block bold-14 text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter your full name"
              className="border border-gray-300 rounded w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
              disabled={isLoading}
            />
          </div>
        )}

        <div className="w-full">
          <label htmlFor="email" className="block bold-14 text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email"
            className="border border-gray-300 rounded w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
            disabled={isLoading}
          />
        </div>

        <div className="w-full">
          <label htmlFor="password" className="block bold-14 text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter your password"
            className="border border-gray-300 rounded w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
            minLength={6}
            disabled={isLoading}
          />
        </div>

        <div className="text-center mt-2">
          {state === "register" ? (
            <p className="regular-14 text-gray-600">
              Already have an account?{" "}
              <button 
                type="button"
                onClick={() => switchState("login")} 
                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer focus:outline-none"
                disabled={isLoading}
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="regular-14 text-gray-600">
              Don't have an account?{" "}
              <button 
                type="button"
                onClick={() => switchState("register")} 
                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer focus:outline-none"
                disabled={isLoading}
              >
                Sign Up
              </button>
            </p>
          )}
        </div>

        <button 
          type="submit" 
          className="btn-dark w-full rounded py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            state === "register" ? "Create Account" : "Sign In"
          )}
        </button>
      </form>
    </div>
  )
}

export default Login