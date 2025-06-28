import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetProductDetailsQuery,
  useCreateProductReviewMutation
} from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addCurrency } from '../utils/addCurrency';
import Reviews from '../components/Reviews';

const ProductPage = () => {
  const { id: productId } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { userInfo } = useSelector(state => state.auth);

  const {
    data: product,
    isLoading,
    error
  } = useGetProductDetailsQuery(productId);

  const [createProductReview, { isLoading: isCreateProductReviewLoading }] =
    useCreateProductReviewMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };
  const submitHandler = async e => {
    e.preventDefault();
    try {
      const res = await createProductReview({
        productId,
        rating,
        comment
      });
      if (res.error) {
        toast.error(res.error?.data?.message);
      }
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }

    setRating(0);
    setComment('');
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
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Link to='/' className='inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded mb-4'>
            Go Back
          </Link>
          <Meta title={product?.name || 'Product Details'} description={product?.description || ''} />
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/5">
              <img src={getImageUrl(product?.image)} alt={product?.name} className="w-full h-auto rounded shadow" />
              <div className="hidden md:block mt-6">
                <Reviews
                  product={product}
                  userInfo={userInfo}
                  rating={rating}
                  laoding={isCreateProductReviewLoading}
                  setRating={setRating}
                  comment={comment}
                  setComment={setComment}
                  submitHandler={submitHandler}
                />
              </div>
            </div>
            <div className="md:w-2/5">
              <div className="bg-white rounded shadow p-6 mb-6">
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <div className="mb-2">
                  <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </div>
                <div className="mb-2 font-semibold">Price: {addCurrency(product.price)}</div>
                <div className="mb-2"><strong>About this item:</strong> {product.description}</div>
              </div>
            </div>
            <div className="md:w-1/5">
              <div className="bg-white rounded shadow p-6">
                <div className="mb-4 flex justify-between">
                  <span>Price:</span>
                  <span className="font-bold">{addCurrency(product.price)}</span>
                </div>
                <div className="mb-4 flex justify-between">
                  <span>Status:</span>
                  <span>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</span>
                </div>
                {product.countInStock > 0 && (
                  <div className="mb-4 flex justify-between items-center">
                    <span>Qty:</span>
                    <select
                      className="border rounded px-2 py-1"
                      value={qty}
                      onChange={e => setQty(Number(e.target.value))}
                    >
                      {Array.from({ length: product.countInStock }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded mb-2"
                  type="button"
                  disabled={product.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
          <div className="block md:hidden mt-8">
            <Reviews
              product={product}
              userInfo={userInfo}
              rating={rating}
              laoding={isCreateProductReviewLoading}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              submitHandler={submitHandler}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ProductPage;
