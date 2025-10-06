const Category = require('../models/Category');

// Create a new category (Admin only)
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all categories (Public)
exports.getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .populate('parentCategory', 'name slug')
    .populate('subcategories', 'name slug');
  res.json({ success: true, categories });
};

// Get category by ID (Public)
exports.getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id)
    .populate('parentCategory', 'name slug')
    .populate('subcategories', 'name slug');
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ success: true, category });
};

// Update category (Admin only)
exports.updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true
  });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ success: true, category });
};

// Delete category (Admin only, soft delete)
exports.deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ success: true, message: 'Category deleted (inactive)', category });
};
