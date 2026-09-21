import React from 'react'

const Title = ({
  title1,
  title2,
  titleStyles,
  title1Styles,
  paraStyles,
  para,
}) => {
  return (
    <div className={`${titleStyles}`}>
      <h3 className={`${title1Styles} h3 font-serif`}>
        {title1}
        <span className="text-secondary font-light italic ml-2">
          {title2}
        </span>
      </h3>
      <p className={`${paraStyles} max-w-md text-gray-500 text-sm mt-2 leading-relaxed`}>
        {para
          ? para
          : "Explore our curated collection of luxury candles crafted for comfort, elegance, and everyday indulgence."}
      </p>
    </div>
  )
}

export default Title
