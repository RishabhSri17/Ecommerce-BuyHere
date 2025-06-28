import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { searchProduct, clearSearch } from '../slices/searchProductSlice';

function SearchBox() {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();

  const searchProductHandler = e => {
    e.preventDefault();
    dispatch(searchProduct(input));
  };

  const clearSearchHandler = () => {
    dispatch(clearSearch());
    setInput('');
  };

  return (
    <form onSubmit={searchProductHandler} className="flex items-center space-x-2 w-full max-w-xs">
      <div className="relative flex-1">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Search Products..."
          className="block w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-amber-500 focus:ring-amber-500 transition-colors"
        />
        {input !== '' && (
          <button
            type="button"
            onClick={clearSearchHandler}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-3 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-lg text-sm font-semibold focus:outline-none transition-colors"
        aria-label="Search"
      >
        <FaSearch />
      </button>
    </form>
  );
}

export default SearchBox;
