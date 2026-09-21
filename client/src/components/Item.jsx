import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'

const Item = ({ product }) => {
  const { navigate, addToCart } = useContext(ShopContext)
  const [hovered, setHovered] = useState(false)
  const [selectedSize, setSelectedSize] = useState('M')
  const [imageUrls, setImageUrls] = useState([])
  const [currentImage, setCurrentImage] = useState('')
  const [imageError, setImageError] = useState(false)

  // Function to process Cloudinary image URLs
  const processImages = (images) => {
    if (!images) return [];
    
    // If images is already an array
    if (Array.isArray(images)) {
      return images.map(img => {
        // If it's already a full URL, return as is
        if (typeof img === 'string' && img.startsWith('http')) {
          return img;
        }
        // If it's a Cloudinary public_id, construct the URL
        if (typeof img === 'string') {
          // Use your actual Cloudinary cloud name (get from env or context)
          const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dxueurd0i';
          return `https://res.cloudinary.com/${cloudName}/image/upload/w_500,h_500,c_fill,q_auto,f_auto/${img}`;
        }
        return ''; // Return empty string for invalid images
      }).filter(Boolean); // Remove empty strings
    }
    
    // If images is a single string
    if (typeof images === 'string') {
      if (images.startsWith('http')) {
        return [images];
      } else {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dxueurd0i';
        return [`https://res.cloudinary.com/${cloudName}/image/upload/w_500,h_500,c_fill,q_auto,f_auto/${images}`];
      }
    }
    
    return [];
  }

  // Process images when product changes
  useEffect(() => {
    if (product?.images) {
      // Try images array first
      const processedUrls = processImages(product.images);
      if (processedUrls.length > 0) {
        setImageUrls(processedUrls);
        setCurrentImage(processedUrls[0]);
        setImageError(false);
        return;
      }
    }
    
    if (product?.image) {
      // Then try image field (could be string or array)
      const processedUrls = processImages(product.image);
      if (processedUrls.length > 0) {
        setImageUrls(processedUrls);
        setCurrentImage(processedUrls[0]);
        setImageError(false);
        return;
      }
    }
    
    // No valid images found
    setImageUrls([]);
    setCurrentImage('');
    setImageError(true);
  }, [product])

  // Update current image on hover
  useEffect(() => {
    if (hovered && imageUrls.length > 1) {
      setCurrentImage(imageUrls[1]);
    } else if (imageUrls.length > 0) {
      setCurrentImage(imageUrls[0]);
    }
  }, [hovered, imageUrls])

  // Handle image error
  const handleImageError = (e) => {
    console.error('Failed to load image:', currentImage);
    setImageError(true);
    
    // Use a data URL for placeholder to avoid 404 errors
    const placeholderSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Crect width='500' height='500' fill='%23f5f5f5'/%3E%3Cpath d='M150,200 L350,200 L350,300 L150,300 Z' fill='%23e0e0e0'/%3E%3Ccircle cx='250' cy='150' r='50' fill='%23e0e0e0'/%3E%3Ctext x='250' y='380' font-family='Arial' font-size='16' text-anchor='middle' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E`;
    e.target.src = placeholderSVG;
  }

  // 🧠 If product is missing, show fallback message
  if (!product) {
    return <div className="p-5 text-center text-gray-500">Product not available</div>
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product._id, selectedSize)
  }

  return (
    <div className='overflow-hidden bg-white border border-gray-100 hover:border-gold/40 hover:shadow-lg transition-all duration-300 group'>
      {/* image */}
      <div
        onClick={() => {
          if (product._id && product.category) {
            navigate(`/collection/${product.category?.toLowerCase()}/${product._id}`)
            window.scrollTo(0, 0)
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className='bg-primary overflow-hidden relative cursor-pointer h-64'
      >
        {imageError || !currentImage ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-primary">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-gray-400 mt-2 tracking-widest uppercase">No Image</p>
          </div>
        ) : (
          <img
            src={currentImage}
            alt={product.name || 'Product image'}
            className='transition-all duration-500 w-full h-full object-contain group-hover:scale-105'
            loading='lazy'
            onError={handleImageError}
          />
        )}
        {product.popular && (
          <span className="absolute top-3 left-3 bg-secondary text-white text-[9px] tracking-[2px] uppercase px-2.5 py-1">
            Popular
          </span>
        )}
      </div>

      {/* info */}
      <div className='p-4'>
        <h4 className='text-xs font-semibold tracking-[1px] uppercase line-clamp-1 text-gray-800'>{product.name || 'Unnamed Product'}</h4>
        <p className='line-clamp-1 text-xs text-gray-400 mt-1'>{product.description || ''}</p>

        <div className='my-3'>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className='w-full border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:border-secondary bg-white text-gray-700'
          >
            <option value='S'>S</option>
            <option value='M'>M</option>
            <option value='L'>L</option>
            <option value='XL'>XL</option>
          </select>
        </div>

        <div className='flex items-center justify-between pt-1 gap-2'>
          <p className='text-secondary font-semibold text-sm'>${(product.offerPrice || product.price || 0).toFixed(2)}</p>
          {product.inStock === false || product.stock === 0 ? (
            <span className="text-[10px] tracking-[1px] uppercase text-red-400 border border-red-200 px-2 py-1">
              Out of Stock
            </span>
          ) : (
            <button
              onClick={handleAddToCart}
              className='bg-secondary text-white text-[10px] tracking-[2px] uppercase px-4 py-2 hover:bg-[#9a0827] transition-colors duration-300'
            >
              Add to Cart
            </button>
          )}
        </div>
        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-[10px] text-gold mt-1.5 tracking-wide">Only {product.stock} left</p>
        )}
      </div>
    </div>
  )
}

export default Item
