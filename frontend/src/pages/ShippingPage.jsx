import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';

const ShippingPage = () => {
  const { shippingAddress } = useSelector(state => state.cart);

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = e => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        country
      })
    );
    navigate('/payment');
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <Meta title={'Shipping'} />
      <h1 className="text-2xl font-bold mb-6">Shipping</h1>
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label htmlFor="address" className="block font-medium mb-1">Address</label>
          <input
            type="text"
            id="address"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="city" className="block font-medium mb-1">City</label>
          <input
            type="text"
            id="city"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter city"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="postalCode" className="block font-medium mb-1">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter postal code"
            value={postalCode}
            onChange={e => setPostalCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="country" className="block font-medium mb-1">Country</label>
          <input
            type="text"
            id="country"
            className="w-full border rounded px-3 py-2"
            placeholder="Enter country"
            value={country}
            onChange={e => setCountry(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded">
          Continue
        </button>
      </form>
    </FormContainer>
  );
};

export default ShippingPage;
