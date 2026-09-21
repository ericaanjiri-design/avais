import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';
import { Autoplay } from 'swiper/modules'
import { ShopContext } from '../context/ShopContext'
import Item from './Item'

const RelatedProducts = ({ product, id }) => {
  const [relatedProducts, setRelatedProducts] = useState([])
  const { products } = useContext(ShopContext)

  useEffect(() => {
    if (!product || products.length === 0) return;

    let productsCopy = [...products];
    productsCopy = productsCopy.filter(
      (item) =>
        item.category?.toLowerCase() === product.category?.toLowerCase() &&
        String(id) !== String(item._id)
    );
    setRelatedProducts(productsCopy.slice(0, 6));
  }, [products, product, id]);

  return (
    <section className='pt-16'>
      <Title
        title1={"Related"}
        title2={"Products"}
        titleStyles={"pb-10"}
      />
      {relatedProducts.length > 0 ? (
        <Swiper
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10 },
            555: { slidesPerView: 2, spaceBetween: 10 },
            800: { slidesPerView: 3, spaceBetween: 10 },
            1150: { slidesPerView: 4, spaceBetween: 10 },
            1350: { slidesPerView: 5, spaceBetween: 10 },
          }}
          modules={[Autoplay]}
          className='min-h-[399px]'
        >
          {relatedProducts.map((item) => (
            <SwiperSlide key={item._id}>
              <Item product={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-gray-500">No related products found.</p>
      )}
    </section>
  )
}

export default RelatedProducts
