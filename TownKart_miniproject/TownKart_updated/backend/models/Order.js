const mongoose = require('mongoose');

function generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `TK${timestamp.slice(-6)}${random}`;
}

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true,
        required: true,
        default: generateOrderNumber
    },
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Customer is required']
    },
    items: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1']
        },
        price: {
            type: Number,
            required: true,
            min: [0, 'Price cannot be negative']
        },
        businessOwner: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        }
    }],
    shippingAddress: {
        fullName: {
            type: String,
            required: [true, 'Full name is required']
        },
        street: {
            type: String,
            required: [true, 'Street address is required']
        },
        city: {
            type: String,
            required: [true, 'City is required']
        },
        state: {
            type: String,
            required: [true, 'State is required']
        },
        zipCode: {
            type: String,
            required: [true, 'ZIP code is required']
        },
        country: {
            type: String,
            default: 'India'
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required']
        }
    },
    paymentInfo: {
        method: {
            type: String,
            enum: ['cash_on_delivery', 'card', 'upi', 'net_banking'],
            required: [true, 'Payment method is required']
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        transactionId: String,
        paidAt: Date
    },
    pricing: {
        subtotal: {
            type: Number,
            required: true,
            min: [0, 'Subtotal cannot be negative']
        },
        shippingCost: {
            type: Number,
            default: 0,
            min: [0, 'Shipping cost cannot be negative']
        },
        tax: {
            type: Number,
            default: 0,
            min: [0, 'Tax cannot be negative']
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, 'Discount cannot be negative']
        },
        total: {
            type: Number,
            required: true,
            min: [0, 'Total cannot be negative']
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'pending'
    },
    statusHistory: [{
        status: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        note: String,
        updatedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    }],
    tracking: {
        trackingNumber: String,
        carrier: String,
        estimatedDelivery: Date,
        actualDelivery: Date
    },
    notes: {
        customerNotes: String,
        adminNotes: String
    },
    cancellation: {
        reason: String,
        cancelledBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        cancelledAt: Date,
        refundStatus: {
            type: String,
            enum: ['pending', 'processed', 'completed'],
            default: 'pending'
        }
    }
}, {
    timestamps: true
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1 });
orderSchema.index({ 'items.businessOwner': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'paymentInfo.status': 1 });

// (orderNumber is generated via default; no need to set it in a save hook)

// Add status to history when status changes
orderSchema.pre('save', function (next) {
    if (this.isModified('status') && !this.isNew) {
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date()
        });
    }
    next();
});

// Calculate total price
orderSchema.methods.calculateTotal = function () {
    this.pricing.subtotal = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    this.pricing.total = this.pricing.subtotal +
        this.pricing.shippingCost +
        this.pricing.tax -
        this.pricing.discount;

    return this.pricing.total;
};

// Check if order can be cancelled
orderSchema.methods.canBeCancelled = function () {
    return ['pending', 'confirmed'].includes(this.status);
};

// Get orders by business owner
orderSchema.statics.getOrdersByBusiness = function (businessOwnerId) {
    return this.find({
        'items.businessOwner': businessOwnerId
    }).populate('customer', 'name email phone')
        .populate('items.product', 'title images')
        .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Order', orderSchema);
