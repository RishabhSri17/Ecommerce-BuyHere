import { createSlice } from "@reduxjs/toolkit";

/**
 * User authentication slice for Redux Toolkit
 * Manages user authentication state including login, logout, and user information
 */

// Initial state configuration
const AUTH_INITIAL_STATE = {
	userInfo: (() => {
		try {
			const storedUserInfo = localStorage.getItem("userInfo");
			return storedUserInfo ? JSON.parse(storedUserInfo) : null;
		} catch (error) {
			console.error("Error parsing stored user info:", error);
			localStorage.removeItem("userInfo");
			return null;
		}
	})()
};

/**
 * User authentication slice with reducers for managing authentication state
 */
const userAuthenticationSlice = createSlice({
	name: "userAuthentication",
	initialState: AUTH_INITIAL_STATE,
	reducers: {
		/**
		 * Sets user credentials in state and localStorage
		 * @param {Object} state - Current authentication state
		 * @param {Object} action - Action containing user credentials payload
		 */
		setUserCredentials: (state, action) => {
			state.userInfo = action.payload;
			try {
				localStorage.setItem("userInfo", JSON.stringify(action.payload));
			} catch (error) {
				console.error("Error storing user info in localStorage:", error);
			}
		},

		/**
		 * Clears user authentication state and removes from localStorage
		 * @param {Object} state - Current authentication state
		 */
		clearUserAuthentication: (state) => {
			state.userInfo = null;
			try {
				localStorage.removeItem("userInfo");
			} catch (error) {
				console.error("Error removing user info from localStorage:", error);
			}
		}
	}
});

// Export actions for use in components
export const { setUserCredentials, clearUserAuthentication } =
	userAuthenticationSlice.actions;

// Export reducer for store configuration
export default userAuthenticationSlice.reducer;
