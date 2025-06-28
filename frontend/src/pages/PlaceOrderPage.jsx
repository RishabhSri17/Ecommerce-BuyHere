import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import CheckoutSteps from '../components/CheckoutSteps';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import Meta from '../components/Meta';
import { addCurrency } from '../utils/addCurrency';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const getImageUrl = (image) => {
  if (!image) return '';
  if (image.startsWith('/uploads/')) {
    return `${backendUrl}${image}`;
  }
  return image;
};

const PlaceOrderPage = () => {
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = useSelector(state => state.cart);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
    if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Meta title={'Place Order'} />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">Shipping</h2>
            <div className="mb-2"><strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}</div>
          </div>
          <div className="bg-white rounded shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">Payment Method</h2>
            <div className="mb-2"><strong>Method:</strong> {paymentMethod}</div>
          </div>
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-bold mb-2">Order Items</h2>
            <div className="divide-y">
              {cartItems.map(item => (
                <div key={item._id} className="flex items-center py-4 gap-4">
                  <img src={getImageUrl(item.image)} alt={item.name} className="w-16 h-16 object-contain rounded" />
                  <Link
                    to={`/product/${item._id}`}
                    className="font-semibold text-gray-800 hover:underline flex-1"
                  >
                    {item.name}
                  </Link>
                  <div>
                    {item.qty} x {addCurrency(item.price)} = {addCurrency(item.qty * item.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="mb-2 flex justify-between">
              <span>Items:</span>
              <span>{addCurrency(itemsPrice)}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span>Shipping:</span>
              <span>{addCurrency(shippingPrice)}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span>Tax:</span>
              <span>{addCurrency(taxPrice)}</span>
            </div>
            <div className="mb-4 flex justify-between font-bold">
              <span>Total:</span>
              <span>{addCurrency(totalPrice)}</span>
            </div>
            <button
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded mb-2"
              type="button"
              disabled={cartItems.length === 0}
              onClick={placeOrderHandler}
            >
              Place Order
            </button>
            {isLoading && <Loader />}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
