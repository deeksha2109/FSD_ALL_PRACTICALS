import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext.js';
import { useCart } from '../../context/CartContext.js';
import { useAuth } from '../../context/AuthContext.js';
import Button from '../../components/common/Button.js';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleMoveToCart = (item) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    addToCart(item);
    removeFromWishlist(item.id);
  };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Heart className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Save items you love to your wishlist and shop them later.
            </p>
            <Link to="/products">
              <Button variant="primary" className="px-8 py-3">
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          
          <div className="flex space-x-4">
            <Link to="/products">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Button>
            </Link>
            
            {items.length > 0 && (
              <Button 
                variant="danger" 
                onClick={clearWishlist}
                className="flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </Button>
            )}
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Product Image */}
              <div className="relative group">
                <Link to={`/products/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                
                {/* Remove from Wishlist Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </motion.button>

                {/* Discount Badge */}
                {item.discount && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{item.discount}%
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Category */}
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1 uppercase tracking-wide">
                  {item.category}
                </p>

                {/* Product Name */}
                <Link to={`/products/${item.id}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                    {item.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <svg
                        key={index}
                        className={`w-4 h-4 ${
                          index < Math.floor(item.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({item.reviews || 0})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${item.price}
                  </span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${item.originalPrice}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMoveToCart(item)}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </motion.button>
                  
                  <Link to={`/products/${item.id}`}>
                    <button className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Move All to Cart Button */}
        {items.length > 0 && (
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                items.forEach(item => handleMoveToCart(item));
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Move All to Cart</span>
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WishlistPage;