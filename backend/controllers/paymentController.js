const crypto = require("crypto");
const Razorpay = require("razorpay");

// ========================================
// PAYMENT CONFIGURATION
// ========================================

// @desc     Get Razorpay configuration
// @method   GET
// @endpoint /api/v1/payment/razorpay/config
// @access   Public
const getRazorpayConfig = (req, res) => {
	try {
		const paymentConfig = {
			razorpayKeyId: process.env.RAZORPAY_KEY_ID,
			razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET
		};

		// Validate configuration
		if (!paymentConfig.razorpayKeyId || !paymentConfig.razorpayKeySecret) {
			res.statusCode = 500;
			throw new Error("Payment gateway configuration is incomplete.");
		}

		res.status(200).json({
			message: "Payment configuration retrieved successfully",
			config: paymentConfig
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to retrieve payment configuration",
			error: error.message
		});
	}
};

// ========================================
// PAYMENT ORDER MANAGEMENT
// ========================================

// @desc     Create Razorpay payment order
// @method   POST
// @endpoint /api/v1/payment/razorpay/order
// @access   Private
const createPaymentOrder = async (req, res, next) => {
	try {
		const paymentOptions = req.body;

		// Validate payment options
		if (!paymentOptions || Object.keys(paymentOptions).length === 0) {
			res.statusCode = 400;
			throw new Error("Payment options are required.");
		}

		// Validate required fields
		if (!paymentOptions.amount || !paymentOptions.currency) {
			res.statusCode = 400;
			throw new Error("Amount and currency are required for payment order.");
		}

		// Validate amount is positive
		if (paymentOptions.amount <= 0) {
			res.statusCode = 400;
			throw new Error("Amount must be greater than zero.");
		}

		// Validate Razorpay configuration
		if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
			res.statusCode = 500;
			throw new Error(
				"Payment gateway configuration is incomplete. Please check environment variables."
			);
		}

		// Initialize Razorpay instance
		const razorpayInstance = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID,
			key_secret: process.env.RAZORPAY_KEY_SECRET
		});

		// Create payment order
		const paymentOrder = await razorpayInstance.orders.create(paymentOptions);

		if (!paymentOrder) {
			res.statusCode = 500;
			throw new Error("Failed to create payment order.");
		}

		res.status(201).json({
			message: "Payment order created successfully",
			order: paymentOrder
		});
	} catch (error) {
		next(error);
	}
};

// ========================================
// PAYMENT VERIFICATION
// ========================================

// @desc     Validate payment signature
// @method   POST
// @endpoint /api/v1/payment/razorpay/order/validate
// @access   Private
const validatePaymentSignature = (req, res, next) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body;

		// Validate required fields
		if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
			res.statusCode = 400;
			throw new Error("Payment verification data is incomplete.");
		}

		// Validate Razorpay configuration
		if (!process.env.RAZORPAY_KEY_SECRET) {
			res.statusCode = 500;
			throw new Error(
				"Payment gateway configuration is incomplete. Please check environment variables."
			);
		}

		// Generate signature for verification
		const expectedSignature = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
			.update(`${razorpay_order_id}|${razorpay_payment_id}`)
			.digest("hex");

		// Verify signature
		if (expectedSignature !== razorpay_signature) {
			res.statusCode = 400;
			throw new Error("Payment verification failed. Invalid signature.");
		}

		const paymentResult = {
			id: razorpay_payment_id,
			status: "success",
			message: "Payment verification successful",
			updateTime: new Date().toLocaleTimeString()
		};

		res.status(200).json({
			message: "Payment verified successfully",
			result: paymentResult
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getRazorpayConfig,
	createPaymentOrder,
	validatePaymentSignature
};
