const express = require('express');
const router = express.Router();
const catCtrl = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

// Admin: create/update/delete
router.post('/', protect, authorize('admin'), catCtrl.createCategory);
router.put('/:id', protect, authorize('admin'), catCtrl.updateCategory);
router.delete('/:id', protect, authorize('admin'), catCtrl.deleteCategory);

// Public: get/list
router.get('/', catCtrl.getCategories);
router.get('/:id', catCtrl.getCategoryById);

module.exports = router;
