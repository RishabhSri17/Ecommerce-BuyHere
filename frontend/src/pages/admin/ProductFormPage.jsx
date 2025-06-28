import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useCreateProductMutation,
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation
} from '../../slices/productsApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import Meta from '../../components/Meta';

const ProductFormPage = () => {
  const { id: productId } = useParams();
  const isUpdateMode = !!productId;

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);

  const getProductQueryResult = useGetProductDetailsQuery(productId);
  const { data: product, isLoading, error } = isUpdateMode
    ? getProductQueryResult
    : { data: null, isLoading: false, error: null };

  const [createProduct, { isLoading: isCreateProductLoading }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdateProductLoading }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: isUploadImageLoading }] = useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (isUpdateMode && product) {
      setName(product.name);
      setImage(product.image);
      setDescription(product.description);
      setBrand(product.brand);
      setCategory(product.category);
      setPrice(product.price);
      setCountInStock(product.countInStock);
    }
  }, [isUpdateMode, product]);

  const uploadFileHandler = async e => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      setImage(res.imageUrl);
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const submitHandler = async e => {
    e.preventDefault();
    try {
      const productData = { name, image, description, brand, category, price, countInStock };
      if (isUpdateMode) {
        const { data } = await updateProduct({ productId, ...productData });
        toast.success(data.message);
      } else {
        const { data } = await createProduct(productData);
        toast.success(data.message);
      }
      navigate('/admin/product-list');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const isLoadingState = isLoading || isCreateProductLoading || isUpdateProductLoading || isUploadImageLoading;

  return (
    <div className="container mx-auto px-4 py-6">
      <Meta title={'Product Form'} />
      
      <Link 
        to='/admin/product-list' 
        className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200 text-gray-700 mb-6"
      >
        ← Go Back
      </Link>

      {isLoadingState ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {isUpdateMode ? 'Update Product' : 'Create Product'}
          </h1>
          
          <form onSubmit={submitHandler} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                id="price"
                placeholder="Enter price"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image
              </label>
              {image && (
                <div className="mb-2">
                  <img src={image} alt="Product" className="h-24 object-contain" />
                </div>
              )}
              <input
                type="file"
                id="image"
                onChange={uploadFileHandler}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                Brand
              </label>
              <input
                type="text"
                id="brand"
                placeholder="Enter brand"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="countInStock" className="block text-sm font-medium text-gray-700">
                Count In Stock
              </label>
              <input
                type="number"
                id="countInStock"
                placeholder="Enter count in stock"
                value={countInStock}
                onChange={e => setCountInStock(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                id="category"
                placeholder="Enter category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Enter description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
              disabled={isLoadingState}
            >
              {isUpdateMode ? 'Update Product' : 'Create Product'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductFormPage;