import React from 'react'
import { FaStar } from 'react-icons/fa'
import user1 from "../assets/testimonials/user1.jpg"
import user2 from "../assets/testimonials/user2.jpg"
import user3 from "../assets/testimonials/user3.jpg"
import Title from '../components/Title'

const Testimonial = () => {

  const testimonials = [
    {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Manager",
    company: "BrightWave Media",
    image:user1,
    message:
      "Using this platform has been a game changer for our business. The process was smooth, the support was excellent, and the results exceeded our expectations."
  },
    {
    id: 2,
    name: "David Kim",
    role: "Software Engineer",
    company: "TechNova Solutions",
    image:user2,
    message:
      "I love how intuitive and reliable the system is. It has saved me countless hours and allowed me to focus on solving real problems for our clients."
  },
    {
    id: 3,
    name: "Emily Carter",
    role: "Entrepreneur",
    company: "Carter Boutique",
    image:user3,
    message:
      "The team behind this product really understands what users need. It's fast, secure, and has helped my business grow faster than I imagined."
  }
  ]
  return (
    <div className='max-padd-container py-16 pt-28 bg-white'>
      <Title
      title1={"People"}
      title2={"Says"} 
      titleStyles={"pb-10"}
      para={"share experience with others"}
      />
      <div className='flex flex-wrap gap-5 pb-12'>
        {testimonials.map((testimonials, index)=>(
          <div key={index} className='bg-white w-ful max-w-[422px] space-y-4 p-3 border border-gray-300/60 text-gray-500 text-sm' >
            <div className='flex justify-between items-center'>
              <div className='flex gap-1'>
                {[...Array(5)].map((_, i)=>(
                  <FaStar key={i} size={16} className="text-secondary" />

                ))}
              </div>
              <p className='text-xs text-gray-400'>{testimonials.date}</p>
            </div>
            <p>{testimonials.message}</p>
            <div className='flex items-center gap-2'>
              <img src={testimonials.image} alt={testimonials.name}  className='h-8 w-8 rounded-full'/>
              <p className='font-medium'>{testimonials.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonial
