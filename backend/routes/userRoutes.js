const express = require("express");
const {
	authenticateUser: loginUser,
	registerNewUser,
	logoutCurrentUser,
	getCurrentUserProfile,
	updateCurrentUserProfile,
	getAllRegularUsers,
	removeUserById,
	updateUserById,
	getUserDetailsById,
	getAllAdminUsers,
	requestPasswordReset,
	resetUserPassword
} = require("../controllers/userController.js");
const {
	authenticateUser,
	requireAdminAccess,
	rateLimitLogin
} = require("../middleware/authMiddleware.js");
const validateRequest = require("../middleware/validator.js");
const { body, param } = require("express-validator");

const router = express.Router();
const validator = {
	checkLogin: [
		body("email")
			.trim()
			.notEmpty()
			.withMessage("Email is required")
			.bail()
			.isEmail()
			.withMessage("Please enter a valid email address")
			.normalizeEmail(),
		body("password")
			.trim()
			.notEmpty()
			.withMessage("Password is required")
			.isLength({ min: 1 })
			.withMessage("Password cannot be empty")
	],
	checkNewUser: [
		body("name")
			.trim()
			.notEmpty()
			.withMessage("Name is required")
			.isLength({ min: 2, max: 50 })
			.withMessage("Name must be between 2 and 50 characters")
			.matches(/^[a-zA-Z\s]+$/)
			.withMessage("Name can only contain letters and spaces")
			.escape(),
		body("email")
			.trim()
			.notEmpty()
			.withMessage("Email is required")
			.bail()
			.isEmail()
			.withMessage("Please enter a valid email address")
			.normalizeEmail()
			.isLength({ max: 100 })
			.withMessage("Email is too long"),
		body("password")
			.trim()
			.notEmpty()
			.withMessage("Password is required")
			.isLength({ min: 8 })
			.withMessage("Password must be at least 8 characters long")
			.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
			.withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
	],
	checkGetUserById: [
		param("id")
			.exists()
			.withMessage("User ID is required")
			.isMongoId()
			.withMessage("Invalid user ID format")
	],
	checkUpdateUser: [
		body("name")
			.optional()
			.trim()
			.notEmpty()
			.withMessage("Name cannot be empty")
			.isLength({ min: 2, max: 50 })
			.withMessage("Name must be between 2 and 50 characters")
			.matches(/^[a-zA-Z\s]+$/)
			.withMessage("Name can only contain letters and spaces")
			.escape(),
		body("email")
			.optional()
			.trim()
			.notEmpty()
			.withMessage("Email cannot be empty")
			.bail()
			.isEmail()
			.withMessage("Please enter a valid email address")
			.normalizeEmail()
			.isLength({ max: 100 })
			.withMessage("Email is too long"),
		body("isAdmin")
			.optional()
			.isBoolean()
			.withMessage("isAdmin must be true or false"),
		param("id")
			.exists()
			.withMessage("User ID is required")
			.isMongoId()
			.withMessage("Invalid user ID format")
	],
	resetPasswordRequest: [
		body("email")
			.trim()
			.notEmpty()
			.withMessage("Email is required")
			.bail()
			.isEmail()
			.withMessage("Please enter a valid email address")
			.normalizeEmail()
	],
	resetPassword: [
		body("password")
			.trim()
			.notEmpty()
			.withMessage("Password is required")
			.isLength({ min: 8 })
			.withMessage("Password must be at least 8 characters long")
			.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
			.withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
		param("id")
			.exists()
			.withMessage("User ID is required")
			.isMongoId()
			.withMessage("Invalid user ID format"),
		param("token")
			.trim()
			.notEmpty()
			.withMessage("Reset token is required")
	]
};

router
	.route("/")
	.post(validator.checkNewUser, validateRequest, registerNewUser)
	.get(authenticateUser, requireAdminAccess, getAllRegularUsers);

router
	.route("/admins")
	.get(authenticateUser, requireAdminAccess, getAllAdminUsers);

router.post(
	"/reset-password/request",
	validator.resetPasswordRequest,
	validateRequest,
	requestPasswordReset
);
router.post(
	"/reset-password/reset/:id/:token",
	validator.resetPassword,
	validateRequest,
	resetUserPassword
);

// Apply rate limiting to login route
router.post("/login", rateLimitLogin, validator.checkLogin, validateRequest, loginUser);
router.post("/logout", authenticateUser, logoutCurrentUser);

router
	.route("/profile")
	.get(authenticateUser, getCurrentUserProfile)
	.put(
		validator.checkNewUser,
		validateRequest,
		authenticateUser,
		updateCurrentUserProfile
	);

router
	.route("/:id")
	.get(
		validator.checkGetUserById,
		validateRequest,
		authenticateUser,
		requireAdminAccess,
		getUserDetailsById
	)
	.put(
		validator.checkUpdateUser,
		validateRequest,
		authenticateUser,
		requireAdminAccess,
		updateUserById
	)
	.delete(
		validator.checkGetUserById,
		validateRequest,
		authenticateUser,
		requireAdminAccess,
		removeUserById
	);

module.exports = router;
