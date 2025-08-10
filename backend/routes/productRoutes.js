const express = require("express");
const {
	getAllProducts,
	getProductById,
	removeProduct,
	createNewProduct,
	updateExistingProduct,
	addProductReview,
	getTopRatedProducts
} = require("../controllers/productController.js");
const {
	authenticateUser,
	requireAdminAccess
} = require("../middleware/authMiddleware.js");
const validateRequestData = require("../middleware/validator.js");
const { body, check, param } = require("express-validator");

const router = express.Router();

const validator = {
	getAllProducts: [
		check("limit")
			.optional()
			.isNumeric()
			.withMessage("Limit parameter must be a number")
			.custom((value) => {
				if (value < 0) throw new Error("Value should not be less than Zero");
				return true;
			}),
		check("skip")
			.optional()
			.isNumeric()
			.withMessage("skip parameter must be a number")
			.custom((value) => {
				if (value < 0) throw new Error("Value should not be less than Zero");
				return true;
			}),
		check("search").optional().trim().escape()
	],
	createNewProduct: [
		check("name").trim().notEmpty().withMessage("Name is required").escape(),
		check("image").notEmpty().withMessage("Image is required"),
		check("description")
			.trim()
			.notEmpty()
			.withMessage("Description is required")
			.escape(),
		check("brand").trim().notEmpty().withMessage("Brand is required").escape(),
		check("category")
			.trim()
			.notEmpty()
			.withMessage("Category is required")
			.escape(),
		check("price")
			.notEmpty()
			.withMessage("Price is required")
			.isNumeric()
			.withMessage("Price must be a number"),
		check("countInStock")
			.notEmpty()
			.withMessage("Count in stock is required")
			.isNumeric()
			.withMessage("Count in stock must be a number")
	],
	addProductReview: [
		param("id")
			.notEmpty()
			.withMessage("Id is required")
			.isMongoId()
			.withMessage("Invalid Id Format"),
		body("rating")
			.notEmpty()
			.withMessage("Rating is Empty")
			.bail()
			.isNumeric()
			.withMessage("Ratings must be number"),
		body("comment").trim().escape()
	],
	getProductById: [
		param("id")
			.notEmpty()
			.withMessage("Id is required")
			.isMongoId()
			.withMessage("Invalid Id Format")
	],
	removeProduct: [
		param("id")
			.notEmpty()
			.withMessage("Id is required")
			.isMongoId()
			.withMessage("Invalid Id Format")
	],
	updateExistingProduct: [
		check("name").trim().notEmpty().withMessage("Name is required").escape(),
		check("image").notEmpty().withMessage("Image is required"),
		check("description")
			.trim()
			.notEmpty()
			.withMessage("Description is required")
			.escape(),
		check("brand").trim().notEmpty().withMessage("Brand is required").escape(),
		check("category")
			.trim()
			.notEmpty()
			.withMessage("Category is required")
			.escape(),
		check("price")
			.notEmpty()
			.withMessage("Price is required")
			.isNumeric()
			.withMessage("Price must be a number"),
		check("countInStock")
			.notEmpty()
			.withMessage("Count in stock is required")
			.isNumeric()
			.withMessage("Count in stock must be a number"),
		param("id")
			.notEmpty()
			.withMessage("Id is required")
			.isMongoId()
			.withMessage("Invalid Id Format")
	]
};

router
	.route("/")
	.post(
		validator.createNewProduct,
		validateRequestData,
		authenticateUser,
		requireAdminAccess,
		createNewProduct
	)
	.get(validator.getAllProducts, validateRequestData, getAllProducts);
router.get("/top", getTopRatedProducts);
router.post(
	"/reviews/:id",
	validator.addProductReview,
	validateRequestData,
	authenticateUser,
	addProductReview
);
router
	.route("/:id")
	.get(validator.getProductById, validateRequestData, getProductById)
	.put(
		validator.updateExistingProduct,
		validateRequestData,
		authenticateUser,
		requireAdminAccess,
		updateExistingProduct
	)
	.delete(
		validator.removeProduct,
		validateRequestData,
		authenticateUser,
		requireAdminAccess,
		removeProduct
	);

module.exports = router;
