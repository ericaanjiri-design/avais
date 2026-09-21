import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-secondary text-gray-400 py-14 mt-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* BRAND */}
        <div>
          <div className="flex flex-col leading-none mb-4">
            <span className="text-2xl font-bold text-[#fefcef] tracking-widest font-serif">AVAIA</span>
            <span className="text-[9px] tracking-[4px] text-[#C8A248] uppercase mt-1">Luxury Candles</span>
          </div>
          <p className="text-sm mb-5 leading-relaxed">
            Elevating everyday moments through fragrance. Each AVAIA candle transforms your space into a sanctuary of comfort and elegance.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-[#640419] transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-[#BB0A30] transition"><FaTwitter /></a>
            <a href="#" className="hover:text-[#BB0A30] transition"><FaInstagram /></a>
          </div>
        </div>

        {/* COLLECTIONS */}
        <div>
          <h4 className="text-white font-semibold mb-4 tracking-widest text-xs uppercase">Collections</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Signature Collection</a></li>
            <li><a href="#" className="hover:text-white transition">Serenity Collection</a></li>
            <li><a href="#" className="hover:text-white transition">Velvet Oud</a></li>
            <li><a href="#" className="hover:text-white transition">Midnight Noir</a></li>
            <li><a href="#" className="hover:text-white transition">Golden Ember</a></li>
          </ul>
        </div>

        {/* INFORMATION */}
        <div>
          <h4 className="text-white font-semibold mb-4 tracking-widest text-xs uppercase">Information</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">Our Story</a></li>
            <li><a href="#" className="hover:text-white transition">Candle Care Guide</a></li>
            <li><a href="#" className="hover:text-white transition">Privacy & Policy</a></li>
            <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h4 className="text-white font-semibold mb-4 tracking-widest text-xs uppercase">Newsletter</h4>
          <p className="text-sm mb-3 leading-relaxed">Join the AVAIA world. Be first to discover new scents and exclusive offers.</p>
          <form className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Your email address"
              className="p-2.5 rounded bg-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#BB0A30] text-sm"
            />
            <button className="bg-[#BB0A30] text-white py-2.5 rounded text-sm tracking-widest uppercase hover:bg-[#9a0827] transition">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white tracking-widest">
        © {new Date().getFullYear()} AVAIA. All rights reserved. | Light. Breathe. Indulge.
      </div>
    </footer>
  );
};

export default Footer;
