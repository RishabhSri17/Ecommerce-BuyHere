const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createAndSetAuthToken } = require("../utils/generateToken.js");
const { sendPasswordResetEmail } = require("../config/email.js");

// ========================================
// AUTHENTICATION
// ========================================

// @desc     Authenticate user and generate token
// @method   POST
// @endpoint /api/users/login
// @access   Public
const authenticateUser = async (req, res, next) => {
	try {
		const { email, password, remember } = req.body;

		// Validate required fields
		if (!email || !password) {
			res.statusCode = 400;
			throw new Error("Email and password are required");
		}

		// Find user by email (case-insensitive)
		const userAccount = await User.findOne({
			email: { $regex: new RegExp(`^${email}$`, "i") }
		});

		if (!userAccount) {
			res.statusCode = 401;
			throw new Error("Invalid email or password");
		}

		// Check if account is locked
		if (userAccount.isLocked) {
			res.statusCode = 423;
			throw new Error(
				"Account is temporarily locked. Please try again later or contact support."
			);
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(
			password,
			userAccount.password
		);

		if (!isPasswordValid) {
			// Increment failed login attempts
			userAccount.failedLoginAttempts =
				(userAccount.failedLoginAttempts || 0) + 1;

			// Lock account after 5 failed attempts for 15 minutes
			if (userAccount.failedLoginAttempts >= 5) {
				userAccount.isLocked = true;
				userAccount.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
			}

			await userAccount.save();

			res.statusCode = 401;
			throw new Error("Invalid email or password");
		}

		// Reset failed login attempts on successful login
		if (userAccount.failedLoginAttempts > 0) {
			userAccount.failedLoginAttempts = 0;
			userAccount.isLocked = false;
			userAccount.lockUntil = null;
			await userAccount.save();
		}

		// Create and set authentication token
		createAndSetAuthToken(req, res, userAccount._id, remember);

		// Log successful login
		console.log(
			`🔐 User logged in: ${userAccount.email} at ${new Date().toISOString()}`
		);

		res.status(200).json({
			message: "Login successful",
			user: {
				id: userAccount._id,
				name: userAccount.name,
				email: userAccount.email,
				isAdmin: userAccount.isAdmin
			}
		});
	} catch (error) {
		next(error);
	}
};

// @desc     Register new user
// @method   POST
// @endpoint /api/users
// @access   Public
const registerNewUser = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;

		// Check if user already exists (case-insensitive)
		const existingUser = await User.findOne({
			email: { $regex: new RegExp(`^${email}$`, "i") }
		});

		if (existingUser) {
			res.statusCode = 409;
			throw new Error("An account with this email already exists");
		}

		// Hash password with higher salt rounds for better security
		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Create new user
		const newUser = new User({
			name: name.trim(),
			email: email.toLowerCase().trim(),
			password: hashedPassword,
			failedLoginAttempts: 0,
			isLocked: false
		});

		const savedUser = await newUser.save();

		// Create and set authentication token
		createAndSetAuthToken(req, res, savedUser._id, false);

		// Log successful registration
		console.log(
			`📝 New user registered: ${
				savedUser.email
			} at ${new Date().toISOString()}`
		);

		res.status(201).json({
			message: "Registration successful. Welcome!",
			user: {
				id: savedUser._id,
				name: savedUser.name,
				email: savedUser.email,
				isAdmin: savedUser.isAdmin
			}
		});
	} catch (error) {
		next(error);
	}
};

// @desc     Logout user and clear session
// @method   POST
// @endpoint /api/users/logout
// @access   Private
const logoutCurrentUser = (req, res) => {
	try {
		// Clear the JWT cookie
		res.clearCookie("jwt", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/"
		});

		// Log logout
		console.log(
			`🔓 User logged out: ${
				req.user?.email || "Unknown"
			} at ${new Date().toISOString()}`
		);

		res.status(200).json({
			message: "Logout successful"
		});
	} catch (error) {
		console.error("Logout error:", error);
		res.status(200).json({
			message: "Logout successful"
		});
	}
};

// ========================================
// USER PROFILE MANAGEMENT
// ========================================

// @desc     Get current user profile
// @method   GET
// @endpoint /api/users/profile
// @access   Private
const getCurrentUserProfile = async (req, res, next) => {
	try {
		const userProfile = await User.findById(req.user._id);

		if (!userProfile) {
			res.statusCode = 404;
			throw new Error("User profile not found.");
		}

		res.status(200).json({
			message: "User profile retrieved successfully",
			user: {
				id: userProfile._id,
				name: userProfile.name,
				email: userProfile.email,
				isAdmin: userProfile.isAdmin
			}
		});
	} catch (error) {
		next(error);
	}
};

// @desc     Update current user profile
// @method   PUT
// @endpoint /api/users/profile
// @access   Private
const updateCurrentUserProfile = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;

		const userToUpdate = await User.findById(req.user._id);

		if (!userToUpdate) {
			res.statusCode = 404;
			throw new Error("User profile not found. Unable to update.");
		}

		userToUpdate.name = name || userToUpdate.name;
		userToUpdate.email = email || userToUpdate.email;

		if (password) {
			const hashedPassword = await bcrypt.hash(password, 10);
			userToUpdate.password = hashedPassword;
		}

		const updatedProfile = await userToUpdate.save();

		res.status(200).json({
			message: "User profile updated successfully.",
			user: {
				id: updatedProfile._id,
				name: updatedProfile.name,
				email: updatedProfile.email,
				isAdmin: updatedProfile.isAdmin
			}
		});
	} catch (error) {
		next(error);
	}
};

// ========================================
// USER MANAGEMENT (ADMIN)
// ========================================

// @desc     Get all regular users
// @method   GET
// @endpoint /api/users
// @access   Private/Admin
const getAllRegularUsers = async (req, res, next) => {
	try {
		const regularUsers = await User.find({ isAdmin: false });

		if (!regularUsers || regularUsers.length === 0) {
			res.statusCode = 404;
			throw new Error("No regular users found.");
		}

		res.status(200).json({
			message: "Regular users retrieved successfully",
			count: regularUsers.length,
			users: regularUsers
		});
	} catch (error) {
		next(error);
	}
};

// @desc     Get all admin users
// @method   GET
// @endpoint /api/users/admins
// @access   Private/Admin
const getAllAdminUsers = async (req, res, next) => {
	try {
		const adminUsers = await User.find({ isAdmin: true });

		if (!adminUsers || adminUsers.length === 0) {
			res.statusCode = 404;
			throw new Error("No admin users found.");
		}

		res.status(200).json({
			message: "Admin users retrieved successfully",
			count: adminUsers.length,
			users: adminUsers
		});
	} catch (error) {
		next(error);
	}
};

// @desc     Get user by ID
// @method   GET
// @endpoint /api/users/:id
// @access   Private/Admin
const getUserDetailsById = async (req, res, next) => {
	try {
		const { id: userId } = req.params;
		const userDetails = await User.findById(userId);

		if (!userDetails) {
			res.statusCode = 404;
			throw new Error("User not found.");
		}

		res.status(200).json({
			message: "User details retrieved successfully",
			user: userDetails
		});
	} catch (error) {
		next(error);
	}
};

// @desc     Update user by ID
// @method   PUT
// @endpoint /api/users/:id
// @access   Private/Admin
const updateUserById = async (req, res, next) => {
	try {
		const { name, email, isAdmin } = req.body;
		const { id: userId } = req.params;

		const userToUpdate = await User.findById(userId);

		if (!userToUpdate) {
			res.statusCode = 404;
			throw new Error("User not found.");
		}

		userToUpdate.name = name || userToUpdate.name;
		userToUpdate.email = email || userToUpdate.email;
		userToUpdate.isAdmin = Boolean(isAdmin);

		const updatedUser = await userToUpdate.save();

		res.status(200).json({
			message: "User updated successfully",
			user: updatedUser
		});
	} catch (error) {
		next(error);
	}
};

// @desc     Delete user by ID
// @method   DELETE
// @endpoint /api/users/:id
// @access   Private/Admin
const removeUserById = async (req, res, next) => {
	try {
		const { id: userId } = req.params;
		const userToDelete = await User.findById(userId);

		if (!userToDelete) {
			res.statusCode = 404;
			throw new Error("User not found.");
		}

		await User.deleteOne({ _id: userToDelete._id });

		res.status(200).json({
			message: "User deleted successfully"
		});
	} catch (error) {
		next(error);
	}
};

// ========================================
// PASSWORD RESET
// ========================================

// @desc     Request password reset
// @method   POST
// @endpoint /api/users/reset-password/request
// @access   Public
const requestPasswordReset = async (req, res, next) => {
	try {
		const { email } = req.body;
		const userAccount = await User.findOne({ email });

		if (!userAccount) {
			res.statusCode = 404;
			throw new Error("User not found.");
		}

		const resetToken = jwt.sign(
			{ userId: userAccount._id },
			process.env.JWT_SECRET,
			{
				expiresIn: "15m"
			}
		);

		const passwordResetLink = `https://mern-shop-abxs.onrender.com/reset-password/${userAccount._id}/${resetToken}`;

		await sendPasswordResetEmail(
			userAccount.email,
			userAccount.name,
			passwordResetLink
		);

		res.status(200).json({
			message: "Password reset email sent, please check your email."
		});
	} catch (error) {
		next(error);
	}
};

// @desc     Reset password with token
// @method   POST
// @endpoint /api/users/reset-password/reset/:id/:token
// @access   Public
const resetUserPassword = async (req, res, next) => {
	try {
		const { password } = req.body;
		const { id: userId, token } = req.params;

		const userAccount = await User.findById(userId);
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

		if (!decodedToken) {
			res.statusCode = 401;
			throw new Error("Invalid or expired token.");
		}

		if (!userAccount) {
			res.statusCode = 404;
			throw new Error("User not found.");
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		userAccount.password = hashedPassword;
		await userAccount.save();

		res.status(200).json({
			message: "Password successfully reset"
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	authenticateUser,
	registerNewUser,
	logoutCurrentUser,
	getCurrentUserProfile,
	updateCurrentUserProfile,
	getAllRegularUsers,
	getAllAdminUsers,
	getUserDetailsById,
	updateUserById,
	removeUserById,
	requestPasswordReset,
	resetUserPassword
};
