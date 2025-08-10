// Import necessary functions and slices from Redux Toolkit
import { configureStore } from "@reduxjs/toolkit";
import { baseApiSlice } from "./slices/baseApiSlice";
import cartSliceReducer from "./slices/cartSlice";
import userAuthenticationReducer from "./slices/userAuthenticationSlice";
import searchProductSliceReducer from "./slices/searchProductSlice";

// Configure the Redux store
const store = configureStore({
	// Combine reducers for different slices
	reducer: {
		[baseApiSlice.reducerPath]: baseApiSlice.reducer, // API-related state reducer
		cart: cartSliceReducer, // Shopping cart state reducer
		auth: userAuthenticationReducer, // Authentication state reducer
		search: searchProductSliceReducer
	},

	// Add middleware to the Redux store
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(baseApiSlice.middleware) // Add API middleware
});

// Export the configured Redux store for use in the application
export default store;
