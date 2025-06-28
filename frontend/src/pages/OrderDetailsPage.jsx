import React, { useEffect } from 'react';

import { useParams, Link } from 'react-router-dom';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useUpdateDeliverMutation,
  useGetRazorpayApiKeyQuery
} from '../slices/ordersApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ServerError from '../components/ServerError';

import axios from 'axios';
import Meta from '../components/Meta';
import { addCurrency } from '../utils/addCurrency';

const OrderDetailsPage = () => {
  const { id: orderId } = useParams();
  const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: isPayOrderLoading }] = usePayOrderMutation();
  const [updateDeliver, { isLoading: isUpdateDeliverLoading }] = useUpdateDeliverMutation();
  const { userInfo } = useSelector(state => state.auth);
  const { data: razorpayApiKey } = useGetRazorpayApiKeyQuery();

  const paymentHandler = async e => {
    try {
      const razorpayData = {
        amount: order.totalPrice * 100,
        currency: 'INR',
        receipt: `receipt#${orderId}`
      };
      const { data } = await axios.post(
        '/api/v1/payment/razorpay/order',
        razorpayData
      );
      const { id: razorpayOrderId } = data;
      const options = {
        key: razorpayApiKey.razorpayKeyId,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: 'MERN Shop',
        description: 'Test Transaction',
        image: 'https://example.com/your_logo',
        order_id: razorpayOrderId,
        handler: async response => {
          try {
            const { data } = await axios.post(
              `/api/v1/payment/razorpay/order/validate`,
              response
            );
            const details = { ...data, email: order?.user?.email };
            await payOrder({ orderId, details });
            toast.success(data.message);
          } catch (error) {
            toast.error(error?.data?.message || error.error);
          }
        },
        prefill: {
          name: order?.user?.name,
          email: order?.user?.email
        },
        notes: {
          address: 'MERN Shop Office'
        },
        theme: {
          color: '#FFC107'
        }
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const deliveredHandler = async () => {
    try {
      await updateDeliver(orderId);
      toast.success('Order Delivered');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getImageUrl = image => {
    if (!image) return '';
    if (image.startsWith('/uploads/')) {
      return `${backendUrl}${image}`;
    }
    return image;
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={'Order Details'} />
          <h1 className="text-2xl font-bold mb-6">Order ID: {orderId}</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="bg-white rounded shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-2">Shipping</h2>
                <div className="mb-2"><strong>Name:</strong> {order?.user?.name}</div>
                <div className="mb-2"><strong>Email:</strong> {order?.user?.email}</div>
                <div className="mb-2"><strong>Address:</strong> {order?.shippingAddress?.address}, {order?.shippingAddress?.city}, {order?.shippingAddress?.postalCode}, {order?.shippingAddress?.country}</div>
                {order?.isDelivered ? (
                  <Message variant='success'>
                    Delivered on {new Date(order?.deliveredAt).toLocaleString()}
                  </Message>
                ) : (
                  <Message variant='danger'>Not Delivered</Message>
                )}
              </div>
              <div className="bg-white rounded shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-2">Payment Method</h2>
                <div className="mb-2"><strong>Method:</strong> {order?.paymentMethod}</div>
                {order?.isPaid ? (
                  <Message variant='success'>
                    Paid on {new Date(order?.paidAt).toLocaleString()}
                  </Message>
                ) : (
                  <Message variant='danger'>Not paid</Message>
                )}
              </div>
              <div className="bg-white rounded shadow p-6">
                <h2 className="text-xl font-bold mb-2">Order Items</h2>
                <div className="divide-y">
                  {order?.orderItems?.map(item => (
                    <div key={item._id} className="flex items-center py-4 gap-4">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded"
                      />
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
                  <span>{addCurrency(order?.itemsPrice)}</span>
                </div>
                <div className="mb-2 flex justify-between">
                  <span>Shipping:</span>
                  <span>{addCurrency(order?.shippingPrice)}</span>
                </div>
                <div className="mb-2 flex justify-between">
                  <span>Tax:</span>
                  <span>{addCurrency(order?.taxPrice)}</span>
                </div>
                <div className="mb-4 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{addCurrency(order?.totalPrice)}</span>
                </div>
                {!order?.isPaid && !userInfo.isAdmin && (
                  <button
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded mb-2"
                    onClick={paymentHandler}
                    disabled={isPayOrderLoading}
                  >
                    Pay Order
                  </button>
                )}
                {userInfo && userInfo.isAdmin && order?.isPaid && !order?.isDelivered && (
                  <button
                    onClick={deliveredHandler}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded mb-2"
                    disabled={isUpdateDeliverLoading}
                  >
                    Mark As Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderDetailsPage;
