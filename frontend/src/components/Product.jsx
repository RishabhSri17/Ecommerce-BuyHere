import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addCurrency } from '../utils/addCurrency';
import { addToCart } from '../slices/cartSlice';
import Rating from './Rating';

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
    navigate('/cart');
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('/uploads/')) {
      return `${backendUrl}${image}`;
    }
    return image;
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
      {/* Out of stock badge */}
      {product.countInStock === 0 && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
          Out of Stock
        </div>
      )}

      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="block flex-grow">
        <div className="h-48 flex items-center justify-center bg-gray-50 p-4">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`} className="block mb-2">
          <h3 className="product-title text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto">
          {/* Rating with horizontal stars */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Rating value={product.rating} />
              <span className="text-sm text-gray-500 ml-2">
                ({product.numReviews})
              </span>
            </div>
            
            <p className="text-xl font-bold text-gray-900">
              {addCurrency(product.price)}
            </p>
          </div>

          <button
            onClick={addToCartHandler}
            disabled={product.countInStock === 0}
            className={`
              w-full py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center
              ${
                product.countInStock === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700'
              }
            `}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;