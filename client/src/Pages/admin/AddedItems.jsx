import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../context/ShopContext'
import toast from 'react-hot-toast'
import { FaSearch, FaEdit, FaTrash, FaStar, FaRegStar } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'

const ITEMS_PER_PAGE = 20

const AddedItems = () => {
  const { products, currency, fetchProducts, axios } = useContext(ShopContext)

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [currPage, setCurrPage] = useState(1)

  // Delete modal
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Edit modal
  const [editProduct, setEditProduct] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Derived categories
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))]

  // Filtered + searched products
  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter
    return matchSearch && matchCat
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currPage - 1) * ITEMS_PER_PAGE, currPage * ITEMS_PER_PAGE)

  // Reset page on filter change
  useEffect(() => { setCurrPage(1) }, [search, categoryFilter])

  // ── DELETE ──────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${deleteId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Product deleted')
        fetchProducts()
      } else {
        toast.error(data.message || 'Delete failed')
      }
    } catch (e) {
      toast.error('Delete failed: ' + e.message)
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  // ── EDIT ─────────────────────────────────────────────
  const openEdit = (product) => {
    setEditProduct(product)
    setEditForm({
      name: product.name || '',
      category: product.category || '',
      price: product.price || '',
      offerPrice: product.offerPrice || '',
      stock: product.stock ?? 0,
      popular: product.popular || false,
      description: product.description || '',
    })
  }

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        ...editForm,
        price: Number(editForm.price),
        offerPrice: Number(editForm.offerPrice),
        stock: Number(editForm.stock),
        inStock: Number(editForm.stock) > 0,
      }
      const { data } = await axios.put(`/api/products/${editProduct._id}`, payload)
      if (data.success) {
        toast.success('Product updated')
        fetchProducts()
        setEditProduct(null)
      } else {
        toast.error(data.message)
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  // ── STOCK QUICK UPDATE ───────────────────────────────
  const updateStock = async (productId, newStock) => {
    if (newStock < 0) return
    try {
      const { data } = await axios.put(`/api/products/${productId}`, {
        stock: Number(newStock),
        inStock: Number(newStock) > 0,
      })
      if (data.success) {
        fetchProducts()
      } else {
        toast.error(data.message)
      }
    } catch (e) {
      toast.error('Stock update failed')
    }
  }

  const getStockBadge = (stock) => {
    if (stock === undefined || stock === null) return <span className="text-gray-400 text-xs">—</span>
    if (stock === 0) return <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">Out of Stock</span>
    if (stock <= 5) return <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Only {stock} left</span>
    return <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">In Stock: {stock}</span>
  }

  return (
    <div className="flex-1 px-4 sm:px-6 py-8 bg-white min-h-screen overflow-y-auto">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Added Items</h2>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black w-full sm:w-56"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#66001f]  text-white font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Offer Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Popular</th>
                <th className="px-4 py-3 text-left">Date Added</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e67899] ">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-white">No products found</td>
                </tr>
              ) : paginated.map(product => (
                <tr key={product._id} className="hover:bg-[#7a1835]  transition-colors">
                  <td className="px-4 py-3">
                    <img
                      src={product.images?.[0] || product.image?.[0] || '/placeholder.png'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg border"
                      onError={e => { e.target.src = '/placeholder.png' }}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-[160px] truncate">{product.name}</td>
                  <td className="px-4 py-3 text-gray-600">{product.category || '—'}</td>
                  <td className="px-4 py-3 text-gray-800">{currency}{product.price}</td>
                  <td className="px-4 py-3 text-green-700 font-medium">{product.offerPrice ? `${currency}${product.offerPrice}` : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {getStockBadge(product.stock)}
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          onClick={() => updateStock(product._id, (product.stock || 0) - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-bold"
                        >−</button>
                        <span className="w-8 text-center text-xs font-semibold">{product.stock ?? 0}</span>
                        <button
                          onClick={() => updateStock(product._id, (product.stock || 0) + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-bold"
                        >+</button>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {product.popular
                      ? <FaStar className="text-yellow-400 text-lg" />
                      : <FaRegStar className="text-gray-300 text-lg" />}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteId(product._id)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              disabled={currPage === 1}
              onClick={() => setCurrPage(p => p - 1)}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
            >Previous</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium ${currPage === i + 1 ? 'bg-black text-white' : 'border hover:bg-gray-50'}`}
              >{i + 1}</button>
            ))}
            <button
              disabled={currPage === totalPages}
              onClick={() => setCurrPage(p => p + 1)}
              className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
            >Next</button>
          </div>
        )}
      </div>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-6">This will permanently delete the product and its images from Cloudinary. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
              >Cancel</button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >{deleting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-gray-800">Edit Product</h3>
              <button onClick={() => setEditProduct(null)} className="p-1 hover:bg-gray-100 rounded-full">
                <IoClose className="text-xl" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input name="name" value={editForm.name} onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" value={editForm.description} onChange={handleEditChange} rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input name="price" type="number" value={editForm.price} onChange={handleEditChange} min="0"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Offer Price</label>
                  <input name="offerPrice" type="number" value={editForm.offerPrice} onChange={handleEditChange} min="0"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input name="category" value={editForm.category} onChange={handleEditChange}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                  <input name="stock" type="number" value={editForm.stock} onChange={handleEditChange} min="0"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="popular" name="popular" checked={editForm.popular} onChange={handleEditChange}
                  className="w-4 h-4 accent-black" />
                <label htmlFor="popular" className="text-sm font-medium">Mark as Popular</label>
              </div>
              {Number(editForm.stock) === 0 && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">⚠ Stock is 0 — product will be marked as Out of Stock</p>
              )}
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={() => setEditProduct(null)}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddedItems
