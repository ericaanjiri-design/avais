import React from "react";

const ProductDescription = () => {
  return (
    <div className="mt-14 bg-white">
      {/* Tabs */}
      <div className="flex gap-3">
        <button className="medium-14 p-3 border-b-2 border-secondary">
          Description
        </button>
        <button className="medium-14 p-3 w-32">Color Guide</button>
        <button className="medium-14 p-3 w-32">Size Guide</button>
      </div>

      <hr className="h-[1px] w-full" />

      {/* Content */}
      <div className="flex flex-col gap-3 p-3">
        {/* Detail Section */}
        <div>
          <h5 className="h5">Detail</h5>
          <p className="text-sm">
            A beautifully crafted soy candle with a refined fragrance designed to bring warmth and character to your space.
          </p>
          <p className="text-sm">
            Each AVAIA scent is carefully composed to create its own mood, 
            from soft florals and fresh citrus to rich woods and warm, inviting notes. 
            A simple touch of luxury for everyday living.
          </p>
        </div>

        {/* Benefit Section */}
        <div>
          <h5 className="h5">Benefit</h5>
          <ul className="list-disc pl-5 text-sm text-gray-600 flex flex-col gap-1">
            <li>High Quality material</li>
            <li>Designed to meet the needs of modern lifestyle</li>
            <li>Available in a wide range</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
