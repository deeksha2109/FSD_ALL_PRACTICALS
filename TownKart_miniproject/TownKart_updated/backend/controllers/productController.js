const Product = require('../models/Product');

// Get all products (Public)
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, sort = '-createdAt' } = req.query;

    const query = { isActive: true };
    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('businessOwner', 'name')
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new product (Business only)
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, originalPrice, image, category, inventory, seller } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      originalPrice,
      image,
      category,
      businessOwner: req.user._id,
      inventory,
      seller
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get single product (Public)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('businessOwner', 'name email')
      .populate('reviews.user', 'name');

    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.incrementViewCount();

    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
};

// Update product (Business or Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check authorization
    if (!product.businessOwner.equals(req.user._id) && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized to update' });

    Object.assign(product, req.body);
    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete product (Soft delete: set isActive false)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (!product.businessOwner.equals(req.user._id) && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized to delete' });

    product.isActive = false;
    await product.save();

    res.json({ success: true, message: 'Product marked inactive', product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// List all products belonging to logged in business user
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ businessOwner: req.user._id });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a review (Customer only, one per user per product)
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if user already reviewed
    if (product.reviews.some(r => r.user.equals(req.user._id)))
      return res.status(400).json({ message: 'Already reviewed' });

    // Push new review
    product.reviews.push({
      user: req.user._id,
      rating,
      comment
    });

    await product.updateRatings();

    res.status(201).json({ success: true, reviews: product.reviews, ratings: product.ratings });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
