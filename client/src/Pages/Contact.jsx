import React from "react";
import { FaEnvelope, FaHeadphones, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20 bg-white">
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
        Contact <span className="text-black">Us</span>
      </h2>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left - Contact Info */}
        <div className="space-y-8">
          <h3 className="text-xl font-semibold text-gray-800">Get in touch</h3>
          <p className="text-gray-600">
            Have any questions or want to work with us? Fill out the form or
            reach us directly through the details below.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-black text-2xl" />
              <p className="text-gray-700">
                <span className="font-medium">Address:</span> 123 Main Street,
                Nairobi, Kenya
              </p>
            </div>

            <div className="flex items-center gap-4">
              <FaHeadphones className="text-black text-2xl" />
              <p className="text-gray-700">
                <span className="font-medium">Phone:</span> +254 712 345 678
              </p>
            </div>

            <div className="flex items-center gap-4">
              <FaEnvelope className="text-black text-2xl" />
              <p className="text-gray-700">
                <span className="font-medium">Email:</span>{" "}
                contact@yourcompany.com
              </p>
            </div>
          </div>
        </div>

        {/* Right - Contact Form */}
        <form className="bg-[#66001f] shadow-md rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white">
              Name
            </label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Message
            </label>
            <textarea
              placeholder="Write your message..."
              rows="4"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-medium py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
