import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../../context/ShopContext'
import toast from 'react-hot-toast'

const ProductList = () => {
  const { products, currency, fetchProducts, axios } = useContext(ShopContext)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const toggleStock = async (productId, inStock) => {
    try {
      const {data} = await axios.put(`/api/products/stock/${productId}`, {inStock})
      if(data.success){
        fetchProducts()
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='px-2 sm:px-6 py-12 m-2 h-[97vh] bg-white overflow-y-scroll lg:w-4/5 rounded-xl'>
      <div className='flex flex-col gap-2'>
        <div className='grid grid-cols-[1fr_3.5fr_1fr_1fr_1fr] items-center py-1 px-2 bg-gray-100 font-semibold mb-2 rounded'>
          <h5>Image</h5>
          <h5>Name</h5>
          <h5>Category</h5>
          <h5>Price</h5>
          <h5>InStock</h5>
        </div>

        {products?.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className='grid grid-cols-[1fr_3.5fr_1fr_1fr_1fr] items-center py-1 px-2 bg-white mb-1 rounded'>
              <img src={product.image?.[0] || "/placeholder.png"} alt={product.name} className='w-12 rounded bg-white' />
              <h5 className="text-sm font-semibold">{product.name}</h5>
              <p className="text-sm">{product.category}</p>
              <div className="text-sm">{currency}{product.price}</div>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input onClick={()=>toggleStock(product._id, !product.inStock)} type="checkbox" className="sr-only peer" defaultChecked={product.instock} />
                  <div className="w-10 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition-colors duration-200"></div>
                  <span className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                </label>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No products available.</p>
        )}
      </div>
    </div>
  )
}

export default ProductList
