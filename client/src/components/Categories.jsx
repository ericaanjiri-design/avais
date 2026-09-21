import React, { useContext } from 'react'
import Title from './Title'
import {categories} from '../assets/data'
import { ShopContext } from '../context/ShopContext'

const Categories = () => {

  const {navigate} = useContext(ShopContext)
  return (
    <section className='max-padd-container pt-20 pb-10'>
      <Title 
        title1={"Fragrance"}
        title2={"Collections"}
        titleStyles={"pb-10"}
        paraStyles={"hidden"}/>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
        {categories.map((cat)=>(
          <div
            key={cat.name}
            onClick={()=> navigate(`/collection/${cat.name.toLocaleLowerCase()}`)}
            className='flex flex-col items-center cursor-pointer group'
          >
            <div className='bg-primary group-hover:bg-primaryDeep w-[160px] h-[160px] overflow-hidden rounded-full border border-gold/30 group-hover:border-gold transition-all duration-500 shadow-sm'>
              <img src={cat.image} alt={cat.name} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
            </div>
            <h5 className='mt-4 text-[10px] tracking-[3px] uppercase font-semibold text-gray-700 group-hover:text-secondary transition-colors duration-300'>{cat.name}</h5>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Categories
