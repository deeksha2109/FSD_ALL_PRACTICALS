const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentInfo, pricing = {}, notes } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Items are required' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    // Validate product ids
    const productIds = [...new Set(items.map(it => String(it.product)))];
    const invalidId = productIds.find(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidId) {
      return res.status(400).json({ success: false, message: `Invalid product id: ${invalidId}` });
    }

    // Resolve businessOwner from product to ensure downstream auth checks succeed
    const products = await Product.find({ _id: { $in: productIds } }).select('_id businessOwner price');
    const productIdToDoc = new Map(products.map(p => [String(p._id), p]));
    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map(p => String(p._id)));
      const missing = productIds.filter(id => !foundIds.has(id));
      return res.status(400).json({ success: false, message: `Products not found: ${missing.join(', ')}` });
    }

    const normalizedItems = items.map(it => {
      const doc = productIdToDoc.get(String(it.product));
      return {
        product: it.product,
        quantity: Number(it.quantity),
        price: Number(it.price ?? doc?.price ?? 0),
        businessOwner: doc?.businessOwner
      };
    });

    const missingOwner = normalizedItems
      .map((it, idx) => (!it.businessOwner ? { idx, id: productIds[idx] } : null))
      .filter(Boolean);
    if (missingOwner.length > 0) {
      return res.status(400).json({ success: false, message: 'One or more items are missing business owners' });
    }

    // Derive pricing if missing critical parts
    const computedSubtotal = normalizedItems.reduce((sum, it) => sum + (Number(it.price) * Number(it.quantity)), 0);
    const safePricing = {
      subtotal: pricing.subtotal ?? computedSubtotal,
      shippingCost: pricing.shippingCost ?? 0,
      tax: pricing.tax ?? 0,
      discount: pricing.discount ?? 0,
      total: pricing.total ?? (computedSubtotal + (pricing.shippingCost ?? 0) + (pricing.tax ?? 0) - (pricing.discount ?? 0))
    };

    const order = await Order.create({
      customer: req.user._id,
      items: normalizedItems,
      shippingAddress,
      paymentInfo,
      pricing: safePricing,
      notes
    });

    const populated = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('items.product', 'title image');

    res.status(201).json({ success: true, order: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get current user's orders (customer)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.product', 'title image')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// Get single order by ID (customer, business owner, or admin)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('items.product', 'title image');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const isAdmin = req.user.role === 'admin';
    const isOwner = order.customer?.equals?.(req.user._id);
    const isBusiness = order.items?.some?.(i => i.businessOwner?.equals?.(req.user._id));

    if (isAdmin || isOwner || isBusiness) {
      return res.json({ success: true, order });
    }
    return res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid order id' });
  }
};

// Get all business orders (business)
exports.getBusinessOrders = async (req, res) => {
  try {
    const orders = await Order.getOrdersByBusiness(req.user._id);
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch business orders' });
  }
};

// Update order status (business/admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Only business owner for any item, or admin, can update
    const isBusiness = order.items?.some?.(i => i.businessOwner?.equals?.(req.user._id));
    if (req.user.role !== 'admin' && !isBusiness) {
      return res.status(403).json({ success: false, message: 'Not authorized to update status' });
    }

    order.status = status;
    await order.save();
    const populated = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('items.product', 'title image');
    res.json({ success: true, order: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Admin: List all orders (paginated)
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('items.product', 'title image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments();

    res.json({ success: true, total, page, pages: Math.ceil(total / limit), orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

// Admin: Overview stats
exports.getAdminOverview = async (req, res) => {
  try {
    const [totalOrders, totalRevenueAgg, recentOrders] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, revenue: { $sum: '$pricing.total' } } }
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).select('orderNumber pricing.total status createdAt').populate('customer', 'name')
    ]);

    const totalRevenue = (totalRevenueAgg[0]?.revenue) || 0;

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin overview' });
  }
};

// Business: Overview stats for current business owner
exports.getBusinessOverview = async (req, res) => {
  try {
    const businessOwnerId = req.user._id;

    const [orders, products] = await Promise.all([
      Order.getOrdersByBusiness(businessOwnerId),
      Product.find({ businessOwner: businessOwnerId })
    ]);

    const ordersCount = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
    const productsCount = products.length;
    const totalViews = products.reduce((sum, p) => sum + (p.viewCount || 0), 0);

    // Derive top products by salesCount
    const topProducts = products
      .map(p => ({ id: p._id, name: p.title, sales: p.salesCount || 0, stock: p.inventory?.quantity || 0 }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        ordersCount,
        totalSales,
        productsCount,
        totalViews,
        topProducts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch business overview' });
  }
};

// Cancel order (customer/admin)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const isOwner = order.customer?.equals?.(req.user._id);
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel' });
    }

    if (!order.canBeCancelled()) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }

    order.status = 'cancelled';
    order.cancellation = {
      reason: req.body.reason,
      cancelledBy: req.user._id,
      cancelledAt: new Date()
    };
    await order.save();
    const populated = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('items.product', 'title image');
    res.json({ success: true, order: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
