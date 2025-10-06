// Mock data for development - Replace with API calls later

export const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    rating: 4.8,
    reviews: 127,
    stock: 15,
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    features: ["Noise Cancellation", "30hr Battery", "Quick Charge", "Bluetooth 5.0"],
    seller: "TechStore Pro"
  },
  {
    id: 2,
    name: "Organic Cotton T-Shirt",
    category: "Fashion",
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    rating: 4.5,
    reviews: 89,
    stock: 8,
    image: "https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=500",
    description: "Comfortable organic cotton t-shirt available in multiple colors.",
    features: ["100% Organic Cotton", "Machine Washable", "Multiple Colors", "Eco-Friendly"],
    seller: "GreenWear"
  },
  {
    id: 3,
    name: "Smart Watch Series X",
    category: "Electronics",
    price: 449.99,
    originalPrice: 499.99,
    discount: 10,
    rating: 4.7,
    reviews: 203,
    stock: 12,
    image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500",
    description: "Advanced smartwatch with health monitoring and fitness tracking capabilities.",
    features: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant", "Multiple Apps"],
    seller: "SmartTech"
  },
  {
    id: 4,
    name: "Artisan Coffee Beans",
    category: "Food & Beverages",
    price: 24.99,
    rating: 4.9,
    reviews: 156,
    stock: 25,
    image: "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=500",
    description: "Premium roasted coffee beans sourced from sustainable farms.",
    features: ["Single Origin", "Medium Roast", "Fair Trade", "Freshly Roasted"],
    seller: "Mountain Coffee Co"
  },
  {
    id: 5,
    name: "Yoga Mat Premium",
    category: "Sports",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    rating: 4.6,
    reviews: 94,
    stock: 18,
    image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=500",
    description: "Non-slip premium yoga mat with excellent grip and cushioning.",
    features: ["Non-Slip Surface", "6mm Thickness", "Eco-Friendly", "Carrying Strap"],
    seller: "FitLife Gear"
  },
  {
    id: 6,
    name: "Ceramic Plant Pot Set",
    category: "Home & Garden",
    price: 45.99,
    rating: 4.4,
    reviews: 67,
    stock: 22,
    image: "https://images.pexels.com/photos/4505159/pexels-photo-4505159.jpeg?auto=compress&cs=tinysrgb&w=500",
    description: "Beautiful ceramic plant pots perfect for indoor plants.",
    features: ["Drainage Holes", "Set of 3", "Modern Design", "Durable Ceramic"],
    seller: "Garden Paradise"
  }
];

export const offers = [
  {
    id: 1,
    title: "Summer Sale Spectacular",
    description: "Get amazing discounts on all electronics and fashion items. Limited time offer!",
    discount: 30,
    type: "Seasonal Sale",
    code: "SUMMER30",
    validUntil: "2025-02-28",
    minPurchase: 100,
    ctaText: "Shop Electronics",
    link: "/products?category=electronics"
  },
  {
    id: 2,
    title: "New Customer Welcome",
    description: "First-time shoppers get exclusive savings on their first purchase.",
    discount: 20,
    type: "Welcome Offer",
    code: "WELCOME20",
    validUntil: "2025-03-15",
    minPurchase: 50,
    ctaText: "Start Shopping",
    link: "/products"
  },
  {
    id: 3,
    title: "Fashion Week Special",
    description: "Trending styles at unbeatable prices. Refresh your wardrobe today!",
    discount: 40,
    type: "Fashion Deal",
    code: "FASHION40",
    validUntil: "2025-02-20",
    minPurchase: 75,
    ctaText: "Shop Fashion",
    link: "/products?category=fashion"
  },
  {
    id: 4,
    title: "Free Shipping Weekend",
    description: "No minimum purchase required. Get free shipping on all orders this weekend.",
    discount: 0,
    type: "Shipping Deal",
    code: "FREESHIP",
    validUntil: "2025-02-16",
    ctaText: "Order Now",
    link: "/products"
  }
];

export const categories = [
  { id: 'electronics', name: 'Electronics', icon: '📱', count: 156 },
  { id: 'fashion', name: 'Fashion', icon: '👕', count: 298 },
  { id: 'home', name: 'Home & Garden', icon: '🏠', count: 124 },
  { id: 'sports', name: 'Sports & Fitness', icon: '⚽', count: 89 },
  { id: 'food', name: 'Food & Beverages', icon: '🍽️', count: 67 },
  { id: 'books', name: 'Books & Media', icon: '📚', count: 145 },
  { id: 'toys', name: 'Toys & Games', icon: '🎮', count: 78 },
  { id: 'beauty', name: 'Beauty & Health', icon: '💄', count: 134 }
];

export const orders = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    items: [
      { id: 1, name: 'Premium Wireless Headphones', quantity: 1, price: 299.99 }
    ],
    total: 299.99,
    status: 'pending',
    orderDate: '2025-01-15T10:30:00Z',
    shippingAddress: '123 Main St, New York, NY 10001'
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    items: [
      { id: 2, name: 'Organic Cotton T-Shirt', quantity: 2, price: 29.99 },
      { id: 4, name: 'Artisan Coffee Beans', quantity: 1, price: 24.99 }
    ],
    total: 84.97,
    status: 'shipped',
    orderDate: '2025-01-14T15:45:00Z',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90210'
  }
];