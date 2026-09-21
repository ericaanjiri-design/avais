import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../context/ShopContext'
import toast from 'react-hot-toast'

const AdminLogin = () => {
  const { isAdmin, setIsAdmin, navigate } = useContext(ShopContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) {
        setIsAdmin(true)
        navigate('/admin')
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin')
    }
  }, [isAdmin, navigate])

  return (
    <>
      {!isAdmin && (
        <div className='fixed top-0 bottom-0 left-0 right-0 z-40 flex items-center text-sm text-[80%]'>
          <form 
            onSubmit={onSubmitHandler} 
            className='flex flex-col gap-4 m-auto
              items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border
              border-gray-200 bg-white'
          >
            <h3 className='bold-28 mx-auto mb-3'>
              <span className="capitalize text-black">Admin</span> Login
            </h3>
            <div className="w-full">
          <p className="bold-14">Email</p>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Type here..."
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-tertiary"
            required
          />
        </div>

        <div className="w-full">
          <p className="bold-14">Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Type here..."
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-tertiary"
            required
          />
        </div>

        <button type="submit" className="btn-dark w-full rounded py-2.5 mt-2">
          Login
        </button>
          </form>
        </div>
      )}
    </>
  )
}

export default AdminLogin
