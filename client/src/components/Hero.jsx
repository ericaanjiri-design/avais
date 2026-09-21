import React from 'react'
import heroImg from '../assets/new-avia.png'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-white flex items-center">
      <div className="max-padd-container grid grid-cols-1 md:grid-cols-2 items-center gap-12 py-24">
        {/* Left side - Text content */}
        <div className="flex flex-col justify-center text-center md:text-left order-2 md:order-1">
          <span className="text-xs tracking-[5px] uppercase text-gold font-medium mb-4">New Arrival</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6 text-gray-900">
            Illuminate <br />
            <span className="text-secondary italic font-light">Your World</span>
          </h1>
          <p className="text-gray-500 mb-8 max-w-md leading-relaxed text-sm">
            Elevating everyday moments through fragrance. Each AVAIA candle transforms your space into a sanctuary of comfort and elegance.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <Link
              to="/collection"
              className="bg-secondary text-white px-8 py-3.5 text-xs tracking-[3px] uppercase font-semibold hover:bg-[#9a0827] transition-all duration-300"
            >
              Shop Now
            </Link>
            <Link
              to="/testimonial"
              className="border border-gray-900 text-gray-900 px-8 py-3.5 text-xs tracking-[3px] uppercase font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Right side - Image */}
         <div className="w-full flex justify-center order-1 md:order-2">
          <div className="relative">
            <div className="absolute -inset-4 bg-secondary/5 rounded-full blur-3xl" />
            <img
              src={heroImg}
              alt="AVAIA Candle"
              className="relative object-contain max-h-[580px] w-full drop-shadow-2xl"
            />
          </div>
        </div> 
      </div>
    </section>
  )
}

export default Hero
