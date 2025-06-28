import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';
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

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector(state => state.cart);

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async id => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <>
      <Meta title={'Shopping Cart'} />
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {cartItems.length === 0 && (
            <Message>
              Your cart is empty 449 <Link to='/'>Go Back</Link>
            </Message>
          )}
          <div className="space-y-4">
            {cartItems.map(item => (
              <div className="flex items-center gap-4 bg-white rounded shadow p-4" key={item._id}>
                <img src={getImageUrl(item.image)} alt={item.name} className="w-20 h-20 object-contain rounded" />
                <Link
                  to={`/product/${item._id}`}
                  className="font-semibold text-gray-800 hover:underline flex-1"
                >
                  {item.name}
                </Link>
                <div className="w-20">{addCurrency(item.price)}</div>
                <select
                  className="border rounded px-2 py-1"
                  value={item.qty}
                  onChange={e => addToCartHandler(item, Number(e.target.value))}
                >
                  {Array.from({ length: item.countInStock }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="ml-2 text-red-600 hover:text-red-800"
                  onClick={() => removeFromCartHandler(item._id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/3">
          {cartItems.length > 0 && (
            <div className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
              </h2>
              <div className="text-lg font-bold mb-4">
                {addCurrency(
                  cartItems.reduce(
                    (acc, item) => acc + item.qty * item.price,
                    0
                  )
                )}
              </div>
              <button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded"
                type="button"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
