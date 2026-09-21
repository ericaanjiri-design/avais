import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useParams } from "react-router-dom";
import {
  TbHeart,
  TbShoppingBagPlus,
  TbStarFilled,
  TbStarHalfFilled,
} from "react-icons/tb";
import { FaTruckFast } from "react-icons/fa6";
import ProductFeatures from "../components/ProductFeatures";
import ProductDescription from "../components/ProductDescription"; // ✅ fixed import
import RelatedProducts from "../components/RelatedProducts";

const ProductDetails = () => {
  const { products, currency, addToCart } = useContext(ShopContext);
  const { id } = useParams();

  // safely get product
  const product = products.find((item) => item._id === id );

  const [image, setImage] = useState(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    if(product){
      const img = product.images?.[0] || product.image?.[0] || product.image || null
      setImage(img)
    }
  }, [product]);

  if (!product) {
    return (
      <div className="py-20 text-center text-gray-600">
        Product not found.
      </div>
    );
  }

  return (
      
    <div className="max-padd-container py-16 pt-28 bg-white">
      {/* Breadcrumb */}
      
      <p>
        <Link to={"/"}>Home</Link> /
        <Link to={"/collection"}>Collection</Link> /
        <Link to={`/collection/${product.category}`}>
          {product.category}
        </Link>{" "} /
        <span className="text-secondary">{product.name}</span>
      </p>
    

      {/* Product Data */}
      <div className="flex gap-10 flex-col xl:flex-row my-6">
        {/* Left - Images */}
        <div className="flex flex-1 gap-x-2 max-w-[533px]">
          {/* Thumbnails */}
          <div className="flex-1 flexCenter flex-col gap-[7px] flex-wrap">
            {product.images
              ? product.images.map((item, i) => (
                <div key={i} className="bg-white cursor-pointer">
                  <img
                    onClick={() => setImage(item)}
                    src={item}
                    alt="productImg"
                    className="object-cover aspect-square border"
                  />
                </div>
              ))
              : product.image && (Array.isArray(product.image) ? product.image : [product.image]).map((item, i) => (
                <div key={i} className="bg-white cursor-pointer">
                  <img
                    onClick={() => setImage(item)}
                    src={item}
                    alt="productImg"
                    className="object-cover aspect-square border"
                  />
                </div>
              ))}
          </div>

          {/* Main Image */}
          <div className="flex flex-[4] bg-white">
            <img
              src={image}
              alt="productImg"
              className="object-cover aspect-square w-full border"
            />
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="flex-1 px-5 py-3 bg-white">
          <h3 className="h3 leading-none">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-x-2 pt-2">
            <div className="flex gap-x-2 text-yellow-400">
              <TbStarFilled />
              <TbStarFilled />
              <TbStarFilled />
              <TbStarFilled />
              <TbStarHalfFilled />
            </div>
            <p className="medium-14">(22)</p>
          </div>

          {/* Price */}
          <div className="h4 flex items-baseline gap-4">
            <h3 className="h3 line-through text-secondary">
              {currency}
              {product.price}.00
            </h3>
            <h4 className="h4">
              {currency}
              {product.offerPrice || product.price}.00
            </h4>
          </div>

          {/* Description */}
          <p className="max-w-[555px] text-gray-700 mb-4">
            {product.description}
          </p>

          {/* Sizes */}
          <div className="flex flex-col gap-4 my-4 mb-5">
            <div className="flex gap-2">
              {product.sizes &&
                [...product.sizes]
                  .sort((a, b) => {
                    const order = ["S", "M", "L", "XL", "XXL"];
                    return order.indexOf(a) - order.indexOf(b);
                  })
                  .map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setSize(item)}
                      className={`${
                        item === size
                          ? "ring-2 ring-black"
                          : "ring-1 ring-gray-300"
                      } px-3 py-1 bg-white`}
                    >
                      {item}
                    </button>
                  ))}
            </div>
          </div>

          {/* Stock Info */}
          <div className="mb-4">
            {product.stock === 0 || product.inStock === false ? (
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">Out of Stock</span>
            ) : product.stock <= 5 ? (
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">Only {product.stock} left in stock</span>
            ) : (
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">In Stock: {product.stock}</span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 mb-6">
            {product.stock === 0 || product.inStock === false ? (
              <div className="btn-dark sm:w-1/2 flexCenter gap-x-2 opacity-50 cursor-not-allowed">
                Out of Stock
              </div>
            ) : (
              <button onClick={() => addToCart(product._id, size)} className="btn-dark sm:w-1/2 flexCenter gap-x-2 capitalize">
                Add to Cart <TbShoppingBagPlus />
              </button>
            )}
            <button className="btn-light">
              <TbHeart className="text-xl" />
            </button>
          </div>

          {/* Extra Info */}
          <div className="flex items-center gap-x-2 mt-3">
            <FaTruckFast className="text-lg" />
            <span className="text-sm text-gray-700">
              Free Delivery on Orders Over $500
            </span>
          </div>
          <hr className="my-3 w-2/3" />
          <div className="mt-2 flex flex-col gap-1 text-gray-30 text-[14px]">
            <p> Authenticity you can trust</p>
            <p> Cash on Delivery available</p>
            <p> Easy Returns within 7 days</p>
          </div>
        </div>
      </div>

      {/* Extra Sections */}
      <ProductDescription />
      <ProductFeatures />
      <RelatedProducts product={product} id={id} />
    </div>
  );
};

export default ProductDetails;
