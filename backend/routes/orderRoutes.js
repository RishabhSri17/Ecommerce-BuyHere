const express = require("express");
const {
	authenticateUser,
	requireAdminAccess
} = require("../middleware/authMiddleware.js");
const {
	createNewOrder,
	getAllOrders,
	getUserOrders,
	getOrderDetails,
	markOrderAsPaid,
	markOrderAsDelivered
} = require("../controllers/orderController.js");
const validateRequestData = require("../middleware/validator.js");
const { param, check } = require("express-validator");

const router = express.Router();

const validator = {
	getOrderDetails: [
		param("id")
			.notEmpty()
			.withMessage("Id is required")
			.isMongoId()
			.withMessage("Invalid Id Format")
	],
	markOrderAsPaid: [
		param("id")
			.notEmpty()
			.withMessage("Id is required")
			.isMongoId()
			.withMessage("Invalid Id Format")
	],
	markOrderAsDelivered: [
		param("id")
			.notEmpty()
			.withMessage("Id is required")
			.isMongoId()
			.withMessage("Invalid Id Format")
	],
	createNewOrder: [
		check("cartItems").notEmpty().withMessage("Cart items are required"),
		check("shippingAddress")
			.notEmpty()
			.withMessage("Shipping address is required"),
		check("paymentMethod").notEmpty().withMessage("Payment method is required"),
		check("itemsPrice")
			.notEmpty()
			.withMessage("Items price is required")
			.isNumeric()
			.withMessage("Items price must be a number"),
		check("taxPrice")
			.notEmpty()
			.withMessage("Tax price is required")
			.isNumeric()
			.withMessage("Tax price must be a number"),
		check("shippingPrice")
			.notEmpty()
			.withMessage("Shipping price is required")
			.isNumeric()
			.withMessage("Shipping price must be a number"),
		check("totalPrice")
			.notEmpty()
			.withMessage("Total price is required")
			.isNumeric()
			.withMessage("Total price must be a number")
	]
};

router
	.route("/")
	.post(
		validator.createNewOrder,
		validateRequestData,
		authenticateUser,
		createNewOrder
	)
	.get(authenticateUser, requireAdminAccess, getAllOrders);

router.get("/my-orders", authenticateUser, getUserOrders);
router.get(
	"/:id",
	validator.getOrderDetails,
	validateRequestData,
	authenticateUser,
	getOrderDetails
);
router.put(
	"/:id/pay",
	validator.markOrderAsPaid,
	validateRequestData,
	authenticateUser,
	markOrderAsPaid
);
router.put(
	"/:id/deliver",
	validator.markOrderAsDelivered,
	validateRequestData,
	authenticateUser,
	requireAdminAccess,
	markOrderAsDelivered
);

module.exports = router;
