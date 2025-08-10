const Order = require("../models/orderModel.js");

// ========================================
// ORDER CREATION & MANAGEMENT
// ========================================

// @desc     Create new order
// @method   POST
// @endpoint /api/v1/orders
// @access   Private
const createNewOrder = async (req, res, next) => {
	try {
		const {
			cartItems,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice
		} = req.body;

		// Validate order data
		if (!cartItems || cartItems.length === 0) {
			res.statusCode = 400;
			throw new Error("No order items provided.");
		}

		if (!shippingAddress || !paymentMethod) {
			res.statusCode = 400;
			throw new Error("Shipping address and payment method are required.");
		}

		// Create order with mapped cart items
		const orderData = {
			user: req.user._id,
			orderItems: cartItems.map((cartItem) => ({
				...cartItem,
				product: cartItem._id
			})),
			shippingAddress,
			paymentMethod,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice
		};

		const newOrder = new Order(orderData);
		const savedOrder = await newOrder.save();

		res.status(201).json({
			message: "Order created successfully",
			order: savedOrder
		});
	} catch (error) {
		next(error);
	}
};

// ========================================
// ORDER RETRIEVAL
// ========================================

// @desc     Get all orders (Admin only)
// @method   GET
// @endpoint /api/v1/orders
// @access   Private/Admin
const getAllOrders = async (req, res, next) => {
	try {
		const orders = await Order.find().populate("user", "id name");

		if (!orders || orders.length === 0) {
			res.statusCode = 404;
			throw new Error("No orders found in the system.");
		}

		res.status(200).json({
			message: "Orders retrieved successfully",
			count: orders.length,
			orders
		});
	} catch (error) {
		next(error);
	}
};

// @desc     Get logged-in user orders
// @method   GET
// @endpoint /api/v1/orders/my-orders
// @access   Private
const getUserOrders = async (req, res, next) => {
	try {
		const userOrders = await Order.find({ user: req.user._id });

		if (!userOrders || userOrders.length === 0) {
			res.statusCode = 404;
			throw new Error("No orders found for your account.");
		}

		res.status(200).json({
			message: "User orders retrieved successfully",
			count: userOrders.length,
			orders: userOrders
		});
	} catch (error) {
		next(error);
	}
};

// @desc     Get order by ID
// @method   GET
// @endpoint /api/v1/orders/:id
// @access   Private
const getOrderDetails = async (req, res, next) => {
	try {
		const { id: orderId } = req.params;

		const orderDetails = await Order.findById(orderId).populate(
			"user",
			"name email"
		);

		if (!orderDetails) {
			res.statusCode = 404;
			throw new Error("Order not found.");
		}

		res.status(200).json({
			message: "Order details retrieved successfully",
			order: orderDetails
		});
	} catch (error) {
		next(error);
	}
};

// ========================================
// ORDER STATUS UPDATES
// ========================================

// @desc     Update order to paid
// @method   PUT
// @endpoint /api/v1/orders/:id/pay
// @access   Private
const markOrderAsPaid = async (req, res, next) => {
	try {
		const { id: orderId } = req.params;
		const { id: paymentId, status, updateTime, email } = req.body;

		const orderToUpdate = await Order.findById(orderId);

		if (!orderToUpdate) {
			res.statusCode = 404;
			throw new Error("Order not found.");
		}

		if (orderToUpdate.isPaid) {
			res.statusCode = 400;
			throw new Error("Order is already marked as paid.");
		}

		// Update order payment status
		orderToUpdate.isPaid = true;
		orderToUpdate.paidAt = new Date();
		orderToUpdate.paymentResult = {
			id: paymentId,
			status,
			update_time: updateTime,
			email_address: email
		};

		const updatedOrder = await orderToUpdate.save();

		res.status(200).json({
			message: "Order marked as paid successfully",
			order: updatedOrder
		});
	} catch (error) {
		next(error);
	}
};

// @desc     Update order to delivered
// @method   PUT
// @endpoint /api/v1/orders/:id/deliver
// @access   Private/Admin
const markOrderAsDelivered = async (req, res, next) => {
	try {
		const { id: orderId } = req.params;

		const orderToUpdate = await Order.findById(orderId);

		if (!orderToUpdate) {
			res.statusCode = 404;
			throw new Error("Order not found.");
		}

		if (!orderToUpdate.isPaid) {
			res.statusCode = 400;
			throw new Error("Cannot deliver unpaid order.");
		}

		if (orderToUpdate.isDelivered) {
			res.statusCode = 400;
			throw new Error("Order is already marked as delivered.");
		}

		// Update order delivery status
		orderToUpdate.isDelivered = true;
		orderToUpdate.deliveredAt = new Date();

		const updatedOrder = await orderToUpdate.save();

		res.status(200).json({
			message: "Order marked as delivered successfully",
			order: updatedOrder
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createNewOrder,
	getAllOrders,
	getUserOrders,
	getOrderDetails,
	markOrderAsPaid,
	markOrderAsDelivered
};
