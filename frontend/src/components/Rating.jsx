import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text }) => {
  // Create array for star components
  const stars = Array(5).fill(0).map((_, index) => {
    const starValue = index + 1;
    return (
      <span key={index} className="mx-0.5 text-[#f8e825]">
        {value >= starValue ? (
          <FaStar className="w-4 h-4" />
        ) : value >= starValue - 0.5 ? (
          <FaStarHalfAlt className="w-4 h-4" />
        ) : (
          <FaRegStar className="w-4 h-4" />
        )}
      </span>
    );
  });

  return (
    <div className="flex items-center rating">
      <div className="flex mr-1.5">
        {stars}
      </div>
      {text && (
        <span className="rating-text text-xs font-semibold pl-2">
          {text}
        </span>
      )}
    </div>
  );
};

export default Rating;