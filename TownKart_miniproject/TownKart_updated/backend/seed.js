const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const demoUsers = [
  {
    name: 'John Customer',
    email: 'customer@test.com',
    password: 'password',
    role: 'customer',
    phone: '+1234567890',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'password',
    role: 'admin',
    phone: '+1234567891',
    address: {
      street: '456 Admin Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'USA'
    }
  },
  {
    name: 'Business Owner',
    email: 'business@test.com',
    password: 'password',
    role: 'business',
    phone: '+1234567892',
    address: {
      street: '789 Business Blvd',
      city: 'New York',
      state: 'NY',
      zipCode: '10003',
      country: 'USA'
    }
  }
];

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/townkart');
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️ Cleared existing users');

    // Create demo users
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${user.name} (${user.email}) - Role: ${user.role}`);
    }

    console.log('🎉 Demo users seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('Customer: customer@test.com / password');
    console.log('Admin: admin@test.com / password');
    console.log('Business: business@test.com / password');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();



