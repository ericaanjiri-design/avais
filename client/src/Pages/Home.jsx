import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Categories from '../components/Categories'
import PopularProducts from '../components/PopularProducts'
import Blog from '../components/Blog'

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <Categories />
      <PopularProducts />
      <Blog />
    </>
  )
}

export default Home
