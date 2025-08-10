const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================

// @desc     Verify JWT token and authenticate user
// @method   Middleware
// @access   Private
const authenticateUser = async (req, res, next) => {
	try {
		const authToken = req.cookies.jwt;

		if (!authToken) {
			res.statusCode = 401;
			throw new Error("Authentication required. Please log in.");
		}

		// Verify token with enhanced security options
		const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET, {
			algorithms: ["HS256"],
			issuer: "buyhere-api",
			audience: "buyhere-client"
		});

		if (!decodedToken || !decodedToken.userId) {
			res.statusCode = 401;
			throw new Error("Invalid authentication token.");
		}

		// Find user and check if account is locked
		const authenticatedUser = await User.findById(decodedToken.userId).select(
			"-password"
		);

		if (!authenticatedUser) {
			res.statusCode = 401;
			throw new Error("User account not found.");
		}

		// Check if account is currently locked
		if (authenticatedUser.isCurrentlyLocked) {
			res.statusCode = 423;
			throw new Error("Account is temporarily locked. Please try again later.");
		}

		// Check if account should be unlocked (lock period expired)
		if (authenticatedUser.shouldUnlock()) {
			await authenticatedUser.unlockAccount();
		}

		// Set user in request object
		req.user = authenticatedUser;
		next();
	} catch (error) {
		if (error.name === "JsonWebTokenError") {
			res.statusCode = 401;
			error.message = "Invalid authentication token.";
		} else if (error.name === "TokenExpiredError") {
			res.statusCode = 401;
			error.message = "Authentication token has expired. Please log in again.";
		} else if (error.name === "NotBeforeError") {
			res.statusCode = 401;
			error.message = "Authentication token not yet valid.";
		}
		
		// Log authentication errors
		console.error("🔐 Authentication error:", {
			error: error.message,
			path: req.originalUrl,
			method: req.method,
			timestamp: new Date().toISOString()
		});
		
		next(error);
	}
};

// ========================================
// AUTHORIZATION MIDDLEWARE
// ========================================

// @desc     Verify user has admin privileges
// @method   Middleware
// @access   Private/Admin
const requireAdminAccess = (req, res, next) => {
	try {
		if (!req.user) {
			res.statusCode = 401;
			throw new Error("Authentication required.");
		}

		if (!req.user.isAdmin) {
			res.statusCode = 403;
			throw new Error("Admin access required.");
		}

		next();
	} catch (error) {
		next(error);
	}
};

// @desc     Verify user has verified email
// @method   Middleware
// @access   Private
const requireEmailVerification = (req, res, next) => {
	try {
		if (!req.user) {
			res.statusCode = 401;
			throw new Error("Authentication required.");
		}

		if (!req.user.isEmailVerified) {
			res.statusCode = 403;
			throw new Error("Email verification required. Please check your email and verify your account.");
		}

		next();
	} catch (error) {
		next(error);
	}
};

// @desc     Rate limiting middleware for login attempts
// @method   Middleware
// @access   Public
const rateLimitLogin = (req, res, next) => {
	// This is a basic implementation. In production, use a proper rate limiting library
	// like express-rate-limit or redis-based rate limiting
	const clientIP = req.ip || req.connection.remoteAddress;
	
	// Store rate limit data in memory (not recommended for production)
	if (!req.app.locals.rateLimit) {
		req.app.locals.rateLimit = {};
	}
	
	if (!req.app.locals.rateLimit[clientIP]) {
		req.app.locals.rateLimit[clientIP] = {
			count: 0,
			resetTime: Date.now() + 15 * 60 * 1000 // 15 minutes
		};
	}
	
	const rateLimit = req.app.locals.rateLimit[clientIP];
	
	// Reset counter if time window has passed
	if (Date.now() > rateLimit.resetTime) {
		rateLimit.count = 0;
		rateLimit.resetTime = Date.now() + 15 * 60 * 1000;
	}
	
	// Check if rate limit exceeded
	if (rateLimit.count >= 10) { // 10 attempts per 15 minutes
		res.statusCode = 429;
		return next(new Error("Too many login attempts. Please try again later."));
	}
	
	// Increment counter
	rateLimit.count++;
	
	next();
};

module.exports = {
	authenticateUser,
	requireAdminAccess,
	requireEmailVerification,
	rateLimitLogin
};
