const express = require('express');
const router = express.Router();
const prodCtrl = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// Public: get/list
router.get('/', prodCtrl.getProducts);
router.get('/:id', prodCtrl.getProductById);

// Business: CRUD
router.post('/', protect, authorize('business'), prodCtrl.createProduct);
router.put('/:id', protect, authorize('business', 'admin'), prodCtrl.updateProduct);
router.delete('/:id', protect, authorize('business', 'admin'), prodCtrl.deleteProduct);

// List business's own products
router.get('/business/my-products', protect, authorize('business'), prodCtrl.getMyProducts);

// Customer: Add review
router.post('/:id/reviews', protect, authorize('customer'), prodCtrl.addReview);

module.exports = router;
