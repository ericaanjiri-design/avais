import React from 'react'
import { blogs } from '../assets/data'
import Title from './Title'

const Blog = () => {
  return (
    <section className='max-padd-container pt-20 pb-16'>
      <Title
        title1={'Our Expert'}
        title2={'Journal'}
        titleStyles={'pb-10'}
        para={'Stories of scent, craft, and the art of creating atmospheres that linger in memory.'}
      />
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {blogs.map((blog) => (
          <div key={blog.title} className='overflow-hidden relative group cursor-pointer'>
            <img src={blog.image} alt={blog.title} className='w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500' />
            <div className='absolute top-0 left-0 h-full w-full bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
            <div className='absolute bottom-4 left-4 right-4 text-white'>
              <span className='text-[9px] tracking-[3px] uppercase text-gold font-medium'>{blog.category}</span>
              <h3 className='font-serif text-[15px] font-semibold mt-1 leading-snug'>{blog.title}</h3>
              <button className='mt-2 text-[10px] tracking-[2px] uppercase border-b border-white/60 hover:border-white pb-0.5 transition-colors'>Read More</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Blog
