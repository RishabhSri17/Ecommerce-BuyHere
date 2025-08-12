import { ORDERS_URL, RAZORPAY_URL } from "../constants";
import {apiSlice} from "./apiSlice";
import { baseApiSlice } from "./baseApiSlice";

export const ordersApiSlice =  baseApiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createOrder: builder.mutation({
			query: (order) => ({
				url: ORDERS_URL,
				method: "POST",
				body: { ...order },
			}),
			invalidatesTags:["Order"]
		}),
		getOrderDetails: builder.query({
			query: (orderId) => ({
				url: `${ORDERS_URL}/${orderId}`
			}),
			providesTags: ["Order"]
		}),
		getMyOrders: builder.query({
			query: () => ({
				url: `/api/orders/myorders`,
				method: 'GET',
			}),
			keepUnusedDataFor: 5,
		}),
		payOrder: builder.mutation({
			query: ({ orderId, details }) => ({
				url: `${ORDERS_URL}/${orderId}/pay`,
				method: "PUT",
				body: { ...details }
			}),
			invalidatesTags: ["Order"]
		}),
		updateDeliver: builder.mutation({
			query: (orderId) => ({
				url: `${ORDERS_URL}/${orderId}/deliver`,
				method: "PUT"
			}),
			invalidatesTags: ["Order"]
		}),
		getRazorpayApiKey: builder.query({
			query: () => ({
				url: `${RAZORPAY_URL}/razorpay/config`
			}),
			providesTags: ["Order"]
		}),
		createRazorpayOrder: builder.mutation({
			query: (orderData) => ({
				url: `${RAZORPAY_URL}/razorpay/order`,
				method: "POST",
				body: orderData
			}),
			invalidatesTags: ["Order"]
		}),
		validateRazorpayPayment: builder.mutation({
			query: (paymentData) => ({
				url: `${RAZORPAY_URL}/razorpay/order/validate`,
				method: "POST",
				body: paymentData
			})
		}),
		getOrders: builder.query({
			query: () => ({
				url: ORDERS_URL
			}),
			providesTags: ["Order"]
		})
	})
});

export const {
	useGetOrderDetailsQuery,
	useCreateOrderMutation,
	usePayOrderMutation,
	useUpdateDeliverMutation,
	useGetRazorpayApiKeyQuery,
	useCreateRazorpayOrderMutation,
	useValidateRazorpayPaymentMutation,
	useGetMyOrdersQuery,
	useGetOrdersQuery
} = ordersApiSlice;
