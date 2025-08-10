const express = require("express");

const { authenticateUser } = require("../middleware/authMiddleware.js");
const {
	getRazorpayConfig,
	createPaymentOrder,
	validatePaymentSignature
} = require("../controllers/paymentController.js");
const validateRequestData = require("../middleware/validator.js");
const { body, check } = require("express-validator");

const router = express.Router();

const validator = {
	createPaymentOrder: [
		body().custom((body) => {
			if (Object.keys(body).length === 0)
				throw new Error("Request Body is empty");
			return true;
		})
	],
	validatePaymentSignature: [
		body("razorpay_order_id")
			.notEmpty()
			.withMessage("Razorpay order ID is required")
			.trim(),
		body("razorpay_payment_id")
			.notEmpty()
			.withMessage("Razorpay payment ID is required")
			.trim(),
		body("razorpay_signature")
			.notEmpty()
			.withMessage("Razorpay signature is required")
			.trim()
			.escape()
	]
};

router.get("/razorpay/config", getRazorpayConfig);

router.post(
	"/razorpay/order",
	validator.createPaymentOrder,
	validateRequestData,
	authenticateUser,
	createPaymentOrder
);

router.post(
	"/razorpay/order/validate",
	validator.validatePaymentSignature,
	validateRequestData,
	authenticateUser,
	validatePaymentSignature
);

module.exports = router;
