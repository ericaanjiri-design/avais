import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import Item from "../components/Item";

const Collection = () => {
  const { products = [], searchQuery = "" } = useContext(ShopContext) || {};
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
    setCurrPage(1);
  }, [products, searchQuery]);

  // ✅ remove .filter(p => p.instock) unless you're sure the field exists
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currPage]);

  return (
    <div className="max-padd-container py-16 pt-28 bg-white">
      <Title title1="All" title2="Candles" titleStyles="pb-10" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts
            .slice((currPage - 1) * itemsPerPage, currPage * itemsPerPage)
            .map((product) => <Item key={product._id} product={product} />)
        ) : (
          <p className="text-sm text-gray-400 tracking-widest uppercase col-span-4 py-20 text-center">No products found</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flexCenter flex-wrap gap-2 mt-14 mb-10">
        <button
          disabled={currPage === 1}
          onClick={() => setCurrPage((prev) => prev - 1)}
          className={`${
            currPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#9a0827]'
          } bg-secondary text-white text-xs tracking-[2px] uppercase px-6 py-2.5 transition-colors`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrPage(index + 1)}
            className={`${
              currPage === index + 1
                ? 'bg-secondary text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-secondary'
            } text-xs px-4 py-2.5 transition-colors`}
          >
            {index + 1}
          </button>
        ))}
        <button
          disabled={currPage === totalPages}
          onClick={() => setCurrPage((prev) => prev + 1)}
          className={`${
            currPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#9a0827]'
          } bg-secondary text-white text-xs tracking-[2px] uppercase px-6 py-2.5 transition-colors`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Collection;
