const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// Customer creates order
router.post('/', protect, authorize('customer'), orderController.createOrder);

// Customer views their orders
router.get('/my-orders', protect, authorize('customer'), orderController.getMyOrders);

// Business user views orders related to their products
router.get('/business-orders', protect, authorize('business'), orderController.getBusinessOrders);

// Admin-only: list all orders (paginated) - define BEFORE dynamic :id
router.get('/', protect, authorize('admin'), orderController.getAllOrders);

// Admin overview - define BEFORE dynamic :id
router.get('/admin/overview', protect, authorize('admin'), orderController.getAdminOverview);

// Business overview - define BEFORE dynamic :id
router.get('/business/overview', protect, authorize('business'), orderController.getBusinessOverview);

// Business or Admin can update order status
router.put('/:id/status', protect, authorize('business', 'admin'), orderController.updateOrderStatus);

// Customer or Admin can cancel orders
router.put('/:id/cancel', protect, authorize('customer', 'admin'), orderController.cancelOrder);

// Get order by ID (any authenticated user but with role-based access inside controller)
router.get('/:id', protect, orderController.getOrderById);

module.exports = router;
