const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String },
    seller: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    businessOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    inventory: {
        trackInventory: { type: Boolean, default: true },
        quantity: { type: Number, default: 0 }
    },
    viewCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    reviews: [reviewSchema],
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    seo: {
        slug: { type: String }
    },
}, { timestamps: true });

// ---------- Indexes ----------
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ businessOwner: 1 });
productSchema.index({ isActive: 1, isApproved: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ price: 1 });

// ---------- Pre-save hook ----------
productSchema.pre('save', function (next) {
    if (this.isModified('title') && !this.seo.slug) {
        this.seo.slug = this.title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') + '-' + this._id.toString().slice(-6);
    }
    next();
});

// ---------- Methods ----------
productSchema.methods.updateRatings = async function () {
    if (this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.ratings.average = totalRating / this.reviews.length;
        this.ratings.count = this.reviews.length;
    } else {
        this.ratings.average = 0;
        this.ratings.count = 0;
    }
    return this.save();
};

productSchema.methods.isInStock = function (quantity = 1) {
    if (!this.inventory.trackInventory) return true;
    return this.inventory.quantity >= quantity;
};

productSchema.methods.reduceInventory = function (quantity) {
    if (this.inventory.trackInventory) {
        this.inventory.quantity = Math.max(0, this.inventory.quantity - quantity);
        this.salesCount += quantity;
    }
    return this.save();
};

productSchema.methods.incrementViewCount = function () {
    this.viewCount += 1;
    return this.save();
};

module.exports = mongoose.model('Product', productSchema);
