const { validationResult } = require("express-validator");

// ========================================
// REQUEST VALIDATION MIDDLEWARE
// ========================================

// @desc     Validate request data using express-validator
// @method   Middleware
// @access   Global
const validateRequestData = (req, res, next) => {
	try {
		// Get validation results from express-validator
		const validationResults = validationResult(req);

		// Check if validation passed
		if (validationResults.isEmpty()) {
			return next();
		}

		// Prepare error response
		const validationErrors = validationResults.array();
		const errorResponse = {
			message: "Validation failed",
			status: 400,
			errors: validationErrors,
			timestamp: new Date().toISOString(),
			path: req.originalUrl,
			method: req.method
		};

		// Log validation errors
		console.error("❌ Validation Errors:", {
			path: req.originalUrl,
			method: req.method,
			errors: validationErrors,
			timestamp: new Date().toISOString()
		});

		// Send error response
		res.status(400).json(errorResponse);
	} catch (error) {
		// Handle unexpected errors in validation middleware
		console.error("🚨 Validation Middleware Error:", error);

		const fallbackError = {
			message: "Validation middleware error",
			status: 500,
			timestamp: new Date().toISOString(),
			path: req.originalUrl,
			method: req.method
		};

		res.status(500).json(fallbackError);
	}
};

module.exports = validateRequestData;
