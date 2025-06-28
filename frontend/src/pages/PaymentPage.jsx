import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';
const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingAddress } = useSelector(state => state.cart);

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = e => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/place-order');
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <Meta title={'Payment Method'} />
      <h1 className="text-2xl font-bold mb-6">Payment Method</h1>
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <span className="block font-medium mb-2">Select Method</span>
          <div className="flex items-center space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="Razorpay"
                checked={paymentMethod === 'Razorpay'}
                onChange={e => setPaymentMethod(e.target.value)}
                className="mr-2 accent-yellow-500"
              />
              Razorpay
            </label>
          </div>
        </div>
        <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded">
          Continue
        </button>
      </form>
    </FormContainer>
  );
};

export default Payment;
