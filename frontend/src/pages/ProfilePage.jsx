import React from 'react';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import ProfileForm from '../components/ProfileForm';
import { addCurrency } from '../utils/addCurrency';

const ProfilePage = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Meta title={'User Profile'} />
          <h2 className="text-2xl font-bold mb-4">My Profile</h2>
          <ProfileForm />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">My Orders</h2>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">DATE</th>
                    <th className="px-4 py-2">TOTAL</th>
                    <th className="px-4 py-2">PAID</th>
                    <th className="px-4 py-2">DELIVERED</th>
                    <th className="px-4 py-2">DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} className="text-center border-t">
                      <td className="px-4 py-2">{order._id}</td>
                      <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{addCurrency(order.totalPrice)}</td>
                      <td className="px-4 py-2">
                        {order.isPaid ? (
                          <FaCheck className="text-green-600 mx-auto" />
                        ) : (
                          <FaXmark className="text-red-600 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {order.isDelivered ? (
                          <FaCheck className="text-green-600 mx-auto" />
                        ) : (
                          <FaXmark className="text-red-600 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <Link
                          to={`/order/${order._id}`}
                          className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
