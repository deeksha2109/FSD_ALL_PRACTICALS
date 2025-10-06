const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
name: {
type: String,
required: [true, 'Category name is required'],
unique: true,
trim: true,
maxlength: [50, 'Category name cannot be more than 50 characters']
},
description: {
type: String,
maxlength: [200, 'Description cannot be more than 200 characters']
},
slug: {
type: String,
unique: true,
lowercase: true
},
icon: {
type: String,
default: '📦'
},
image: {
type: String
},
parentCategory: {
type: mongoose.Schema.ObjectId,
ref: 'Category',
default: null
},
subcategories: [{
type: mongoose.Schema.ObjectId,
ref: 'Category'
}],
isActive: {
type: Boolean,
default: true
},
sortOrder: {
type: Number,
default: 0
},
productCount: {
type: Number,
default: 0
}
}, {
timestamps: true
});
// Index for better query performance
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ isActive: 1 });
// Generate slug before saving
categorySchema.pre('save', function (next) {
if (this.isModified('name')) {
this.slug = this.name
.toLowerCase()
.replace(/[^a-zA-Z0-9]/g, '-')
.replace(/-+/g, '-')
.replace(/^-|-$/g, '');
}
next();
});
// Get category hierarchy
categorySchema.methods.getHierarchy = async function () {
const hierarchy = [];
let current = this;
while (current) {
hierarchy.unshift({
_id: current._id,
name: current.name,
slug: current.slug
});
if (current.parentCategory) {
current = await this.constructor.findById(current.parentCategory);
} else {
current = null;
}
}
return hierarchy;
};

module.exports = mongoose.model('Category', categorySchema);