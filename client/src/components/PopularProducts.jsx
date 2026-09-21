import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Autoplay } from 'swiper/modules'
import { ShopContext } from '../context/ShopContext'
import Item from './Item'

const PopularProducts = () => {
  const [popularProducts, setPopularProducts] = useState([])
  const { products } = useContext(ShopContext)

  useEffect(() => {
    if (Array.isArray(products)) {
      const popularItems = products.filter((item) => item?.popular)
      
      // If no popular products found, show the most recent ones instead
      if (popularItems.length === 0) {
        setPopularProducts(products.slice(0, 6))
      } else {
        setPopularProducts(popularItems.slice(0, 6))
      }
    } else {
      console.warn('Products is not an array:', products)
      setPopularProducts([])
    }
  }, [products])

  return (
    <section className='max-padd-container py-20'>
      <Title
        title1={'Popular'}
        title2={'Candles'}
        titleStyles={'pb-10'}
        para={'Our most-loved scents — chosen by those who know the art of atmosphere.'}
      />

      <Swiper
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        breakpoints={{
          555: { slidesPerView: 2 },
          800: { slidesPerView: 3 },
          1150: { slidesPerView: 4 },
          1350: { slidesPerView: 5 },
        }}
        spaceBetween={16}
        modules={[Autoplay]}
        className='min-h-[399px]'
      >
        {popularProducts.map((product, index) => {
          if (!product || (!product.image && (!product.images || product.images.length === 0))) {
            console.warn(`Invalid product at index ${index}:`, product)
            return null
          }

          return (
            <SwiperSlide key={product._id || index}>
              <Item product={product} />
            </SwiperSlide>
          )
        })}
      </Swiper>
    </section>
  )
}

export default PopularProducts