import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

/**
 * Base API slice configuration for Redux Toolkit Query
 * This serves as the foundation for all API endpoints in the application
 */
const baseApiSlice = createApi({
	// Base query configuration for all API requests
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
		credentials: 'include', // Include cookies for authentication
		prepareHeaders: (headers, { getState }) => {
			// Add any additional headers if needed
			headers.set('Content-Type', 'application/json');
			return headers;
		},
		// Enhanced error handling
		validateStatus: (response, body) => {
			// Consider 2xx status codes as successful
			if (response.status >= 200 && response.status < 300) {
				return true;
			}
			// Handle authentication errors
			if (response.status === 401) {
				// Clear user data on authentication failure
				const state = getState();
				if (state.auth?.userInfo) {
					// Dispatch logout action if available
					// This will be handled by the component using the API
				}
			}
			return false;
		}
	}),

	// Tag types for cache invalidation and management
	tagTypes: [
		"User", // For user-related data
		"Product", // For product-related data
		"Order" // For order-related data
	],

	// Endpoints will be injected by other API slices
	endpoints: (builder) => ({}),

	// Enhanced error handling
	keepUnusedDataFor: 300, // Keep unused data for 5 minutes
});

export { baseApiSlice };
