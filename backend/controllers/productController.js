const Product = require("../models/productModel.js");
const { removeFileFromSystem } = require("../utils/file.js");

// ========================================
// PRODUCT RETRIEVAL
// ========================================

// @desc     Get all products with pagination and search
// @method   GET
// @endpoint /api/v1/products?limit=2&skip=0
// @access   Public
const getAllProducts = async (req, res, next) => {
	try {
		const totalProducts = await Product.countDocuments();
		const maxLimit = process.env.PAGINATION_MAX_LIMIT;
		const maxSkip = totalProducts === 0 ? 0 : totalProducts - 1;
		const limit = Number(req.query.limit) || maxLimit;
		const skip = Number(req.query.skip) || 0;
		const searchQuery = req.query.search || "";

		const products = await Product.find({
			name: { $regex: searchQuery, $options: "i" }
		})
			.limit(limit > maxLimit ? maxLimit : limit)
			.skip(skip > maxSkip ? maxSkip : skip < 0 ? 0 : skip);

		if (!products || products.length === 0) {
			res.statusCode = 404;
			throw new Error("No products found matching your criteria.");
		}

		res.status(200).json({
			message: "Products retrieved successfully",
			products,
			pagination: {
				total: totalProducts,
				maxLimit,
				maxSkip,
				currentLimit: limit,
				currentSkip: skip
			}
		});
	} catch (error) {
		next(error);
	}
};

// @desc     Get top rated products
// @method   GET
// @endpoint /api/v1/products/top
// @access   Public
const getTopRatedProducts = async (req, res, next) => {
	try {
		const topProducts = await Product.find({}).sort({ rating: -1 }).limit(3);

		if (!topProducts || topProducts.length === 0) {
			res.statusCode = 404;
			throw new Error("No top rated products found.");
		}

		res.status(200).json({
			message: "Top rated products retrieved successfully",
			products: topProducts
		});
	} catch (error) {
		next(error);
	}
};

// @desc     Get single product by ID
// @method   GET
// @endpoint /api/v1/products/:id
// @access   Public
const getProductById = async (req, res, next) => {
	try {
		const { id: productId } = req.params;
		const productDetails = await Product.findById(productId);

		if (!productDetails) {
			res.statusCode = 404;
			throw new Error("Product not found.");
		}

		res.status(200).json({
			message: "Product details retrieved successfully",
			product: productDetails
		});
	} catch (error) {
		next(error);
	}
};

// ========================================
// PRODUCT MANAGEMENT (ADMIN)
// ========================================

// @desc     Create new product
// @method   POST
// @endpoint /api/v1/products
// @access   Private/Admin
const createNewProduct = async (req, res, next) => {
	try {
		const { name, image, description, brand, category, price, countInStock } =
			req.body;

		// Validate required fields
		if (
			!name ||
			!image ||
			!description ||
			!brand ||
			!category ||
			!price ||
			!countInStock
		) {
			res.statusCode = 400;
			throw new Error("All product fields are required.");
		}

		const productData = {
			user: req.user._id,
			name,
			image,
			description,
			brand,
			category,
			price,
			countInStock
		};

		const newProduct = new Product(productData);
		const savedProduct = await newProduct.save();

		res.status(201).json({
			message: "Product created successfully",
			product: savedProduct
		});
	} catch (error) {
		next(error);
	}
};

// @desc     Update existing product
// @method   PUT
// @endpoint /api/v1/products/:id
// @access   Private/Admin
const updateExistingProduct = async (req, res, next) => {
	try {
		const { name, image, description, brand, category, price, countInStock } =
			req.body;
		const { id: productId } = req.params;

		const productToUpdate = await Product.findById(productId);

		if (!productToUpdate) {
			res.statusCode = 404;
			throw new Error("Product not found.");
		}

		// Save the current image path before updating
		const previousImagePath = productToUpdate.image;

		// Update product fields
		productToUpdate.name = name || productToUpdate.name;
		productToUpdate.image = image || productToUpdate.image;
		productToUpdate.description = description || productToUpdate.description;
		productToUpdate.brand = brand || productToUpdate.brand;
		productToUpdate.category = category || productToUpdate.category;
		productToUpdate.price = price || productToUpdate.price;
		productToUpdate.countInStock = countInStock || productToUpdate.countInStock;

		const updatedProduct = await productToUpdate.save();

		// Delete the previous image if it exists and is different from the new image
		if (previousImagePath && previousImagePath !== updatedProduct.image) {
			removeFileFromSystem(previousImagePath);
		}

		res.status(200).json({
			message: "Product updated successfully",
			product: updatedProduct
		});
	} catch (error) {
		next(error);
	}
};

// @desc     Delete product
// @method   DELETE
// @endpoint /api/v1/products/:id
// @access   Private/Admin
const removeProduct = async (req, res, next) => {
	try {
		const { id: productId } = req.params;
		const productToDelete = await Product.findById(productId);

		if (!productToDelete) {
			res.statusCode = 404;
			throw new Error("Product not found.");
		}

		// Delete the product image file
		if (productToDelete.image) {
			removeFileFromSystem(productToDelete.image);
		}

		await Product.deleteOne({ _id: productToDelete._id });

		res.status(200).json({
			message: "Product deleted successfully"
		});
	} catch (error) {
		next(error);
	}
};

// ========================================
// PRODUCT REVIEWS
// ========================================

// @desc     Create product review
// @method   POST
// @endpoint /api/v1/products/reviews/:id
// @access   Private
const addProductReview = async (req, res, next) => {
	try {
		const { id: productId } = req.params;
		const { rating, comment } = req.body;

		const productToReview = await Product.findById(productId);

		if (!productToReview) {
			res.statusCode = 404;
			throw new Error("Product not found.");
		}

		// Check if user has already reviewed this product
		const existingReview = productToReview.reviews.find(
			(review) => review.user._id.toString() === req.user._id.toString()
		);

		if (existingReview) {
			res.statusCode = 400;
			throw new Error("You have already reviewed this product.");
		}

		// Create new review
		const newReview = {
			user: req.user._id,
			name: req.user.name,
			rating: Number(rating),
			comment
		};

		// Add review to product
		productToReview.reviews.push(newReview);

		// Update product rating and review count
		const totalRating = productToReview.reviews.reduce(
			(acc, review) => acc + review.rating,
			0
		);
		productToReview.rating = totalRating / productToReview.reviews.length;
		productToReview.numReviews = productToReview.reviews.length;

		await productToReview.save();

		res.status(201).json({
			message: "Product review added successfully",
			review: newReview
		});
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAllProducts,
	getTopRatedProducts,
	getProductById,
	createNewProduct,
	updateExistingProduct,
	removeProduct,
	addProductReview
};
