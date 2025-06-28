import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center">
        {/* Step 1 - Sign In */}
        <div className="flex flex-col items-center">
          {step1 ? (
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Sign In
            </Link>
          ) : (
            <span className="text-gray-400 cursor-not-allowed">Sign In</span>
          )}
          <div className={`h-1 w-16 mt-1 ${step1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        </div>

        <div className="mx-2 text-gray-400">›</div>

        {/* Step 2 - Shipping */}
        <div className="flex flex-col items-center">
          {step2 ? (
            <Link 
              to="/shipping" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Shipping
            </Link>
          ) : (
            <span className="text-gray-400 cursor-not-allowed">Shipping</span>
          )}
          <div className={`h-1 w-16 mt-1 ${step2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        </div>

        <div className="mx-2 text-gray-400">›</div>

        {/* Step 3 - Payment */}
        <div className="flex flex-col items-center">
          {step3 ? (
            <Link 
              to="/payment" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Payment
            </Link>
          ) : (
            <span className="text-gray-400 cursor-not-allowed">Payment</span>
          )}
          <div className={`h-1 w-16 mt-1 ${step3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        </div>

        <div className="mx-2 text-gray-400">›</div>

        {/* Step 4 - Place Order */}
        <div className="flex flex-col items-center">
          {step4 ? (
            <Link 
              to="/place-order" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Place Order
            </Link>
          ) : (
            <span className="text-gray-400 cursor-not-allowed">Place Order</span>
          )}
          <div className={`h-1 w-16 mt-1 ${step4 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;