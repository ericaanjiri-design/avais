import React, { useContext, useState } from "react"
import Title from "../components/Title"
import { ShopContext } from "../context/ShopContext"
import CartTotal from "../components/CartTotal"
import toast from "react-hot-toast"

const PlaceOrders = () => {
  const { navigate, cartItems, setCartItems, products, axios } = useContext(ShopContext)
  const [method, setMethod] = useState("COD")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  })

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData((data) => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      let orderItems = []

      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === itemId)
            )
            if (itemInfo) {
              itemInfo.size = size
              itemInfo.quantity = cartItems[itemId][size]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      // Convert order items to simple objects
      let items = orderItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        size: item.size,
      }))

      if (method === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items,
          address: formData,
        })

        if (data.success) {
          toast.success(data.message)
          setCartItems({})
          navigate("/my-orders")
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="max-padd-container py-16 pt-28 bg-white">
      <form onSubmit={onSubmitHandler}>
        <div className="flex flex-col xl:flex-row gap-20 xl:gap-28">
          {/* Left side - Delivery Information */}
          <div className="flex flex-[2] flex-col gap-3 text-[95%]">
            <Title title1="Delivery" title2="Information" titleStyles="pb-5" />

            {/* First & Last Name */}
            <div className="flex gap-3">
              <input
                onChange={onChangeHandler}
                value={formData.firstName}
                type="text"
                name="firstName"
                placeholder="First Name"
                className="ring ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
              <input
                onChange={onChangeHandler}
                value={formData.lastName}
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="ring ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
            </div>

            {/* Email & Phone */}
            <div className="flex gap-3">
              <input
                onChange={onChangeHandler}
                value={formData.email}
                type="email"
                name="email"
                placeholder="Email"
                className="ring ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
              <input
                onChange={onChangeHandler}
                value={formData.phone}
                type="tel"
                name="phone"
                placeholder="Phone"
                className="ring ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
            </div>

            {/* Street */}
            <input
              onChange={onChangeHandler}
              value={formData.street}
              type="text"
              name="street"
              placeholder="Street"
              className="ring ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none w-full"
              required
            />

            {/* City & State */}
            <div className="flex gap-3">
              <input
                onChange={onChangeHandler}
                value={formData.city}
                type="text"
                name="city"
                placeholder="City"
                className="ring ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
              <input
                onChange={onChangeHandler}
                value={formData.state}
                type="text"
                name="state"
                placeholder="State"
                className="ring ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
            </div>

            {/* Zipcode & Country */}
            <div className="flex gap-3">
              <input
                onChange={onChangeHandler}
                value={formData.zipcode}
                type="text"
                name="zipcode"
                placeholder="Zipcode"
                className="ring ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
              <input
                onChange={onChangeHandler}
                value={formData.country}
                type="text"
                name="country"
                placeholder="Country"
                className="ring ring-slate-900/15 p-2 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
            </div>
          </div>

          {/* Right side - Cart total and payment */}
          <div className="flex flex-1 flex-col">
            <div className="max-w-[360px] w-full bg-white p-5 py-10 max-md:mt-16">
              <CartTotal method={method} setMethod={setMethod} />
              <button type="submit" className="btn-dark w-full mt-8">
                Proceed to Order
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PlaceOrders
