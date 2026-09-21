import React from 'react'
import { LiaShippingFastSolid } from "react-icons/lia"
import { MdCurrencyExchange } from "react-icons/md"
import { BiSupport } from "react-icons/bi"
import { TbPackageImport } from "react-icons/tb"

const Features = () => {
  return (
    <section className="bg-[#66001F] py-10 mt-0">
      <div className="max-padd-container grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
        
        <div className="flexCenter gap-x-4 px-6 py-6">
          <LiaShippingFastSolid className="text-3xl text-gold flex-shrink-0" />
          <div>
            <h5 className="text-white text-xs font-semibold tracking-[2px] uppercase">Free Shipping</h5>
            <p className="text-gray-500 text-xs mt-0.5">On orders above $100</p>
          </div>
        </div>

        <div className="flexCenter gap-x-4 px-6 py-6">
          <MdCurrencyExchange className="text-3xl text-gold flex-shrink-0" />
          <div>
            <h5 className="text-white text-xs font-semibold tracking-[2px] uppercase">Member Rewards</h5>
            <p className="text-gray-500 text-xs mt-0.5">Exclusive member offers</p>
          </div>
        </div>

        <div className="flexCenter gap-x-4 px-6 py-6">
          <BiSupport className="text-3xl text-gold flex-shrink-0" />
          <div>
            <h5 className="text-white text-xs font-semibold tracking-[2px] uppercase">Dedicated Support</h5>
            <p className="text-gray-500 text-xs mt-0.5">24/7 Customer care</p>
          </div>
        </div>

        <div className="flexCenter gap-x-4 px-6 py-6">
          <TbPackageImport className="text-3xl text-gold flex-shrink-0" />
          <div>
            <h5 className="text-white text-xs font-semibold tracking-[2px] uppercase">Easy Returns</h5>
            <p className="text-gray-500 text-xs mt-0.5">14 day return policy</p>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Features
