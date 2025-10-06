const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Always exclude in queries unless explicitly selected
    },
    role: {
        type: String,
        enum: ['customer', 'business', 'admin'],
        default: 'customer'
    },
    phone: {
        type: String,
        match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number']
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
            type: String,
            default: 'India'
        }
    },
    // businessInfo: {
    //     businessName: String,
    //     businessDescription: String,
    //     businessCategory: String,
    //     businessLicense: String,
    //     isVerified: {
    //         type: Boolean,
    //         default: false
    //     }
    // },
    // avatar: {
    //     type: String,
    //     default: 'default-avatar.png'
    // },
    isActive: {
        type: Boolean,
        default: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
});

// Indexes for quick lookups
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Hash password before saving (only if modified)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password comparison (always use .select('+password'))
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// Update last login timestamp
userSchema.methods.updateLastLogin = function () {
    this.lastLogin = new Date();
    return this.save();
};

// Clean user object for API
userSchema.methods.getPublicProfile = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.resetPasswordToken;
    delete obj.resetPasswordExpire;
    return obj;
};

// Utility for JWT authentication
userSchema.methods.generateJwtToken = function () {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

module.exports = mongoose.model('User', userSchema);
