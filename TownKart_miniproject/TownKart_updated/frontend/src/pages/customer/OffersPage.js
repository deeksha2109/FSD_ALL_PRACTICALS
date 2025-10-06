import { motion } from 'framer-motion';
import { Tag, Clock, TrendingUp } from 'lucide-react';
import OfferCard from '../../components/cards/OfferCard.js';
import { offers } from '../../data/mockData.js';

const OffersPage = () => {
  const activeOffers = offers.filter(offer => {
    const now = new Date();
    const validUntil = new Date(offer.validUntil);
    return validUntil > now;
  });

  const expiredOffers = offers.filter(offer => {
    const now = new Date();
    const validUntil = new Date(offer.validUntil);
    return validUntil <= now;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Tag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Special Offers
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Don't miss out on these amazing deals and discounts. Save big on your favorite products!
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active Offers</p>
                <p className="text-3xl font-bold">{activeOffers.length}</p>
              </div>
              <Tag className="w-8 h-8 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Max Discount</p>
                <p className="text-3xl font-bold">
                  {Math.max(...offers.map(o => o.discount))}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Ending Soon</p>
                <p className="text-3xl font-bold">
                  {offers.filter(offer => {
                    const now = new Date();
                    const validUntil = new Date(offer.validUntil);
                    const timeDiff = validUntil.getTime() - now.getTime();
                    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    return daysDiff <= 3 && daysDiff > 0;
                  }).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-200" />
            </div>
          </motion.div>
        </div>

        {/* Active Offers */}
        {activeOffers.length > 0 && (
          <section className="mb-16">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                🔥 Hot Deals - Limited Time
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Grab these amazing offers before they expire!
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {activeOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <OfferCard offer={offer} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Categories Section */}
        <section className="mb-16">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Shop by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Explore offers across different product categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Electronics', emoji: '📱', discount: 'Up to 30% off', link: '/products?category=electronics' },
              { name: 'Fashion', emoji: '👕', discount: 'Up to 40% off', link: '/products?category=fashion' },
              { name: 'Home & Garden', emoji: '🏠', discount: 'Up to 25% off', link: '/products?category=home' },
              { name: 'Sports', emoji: '⚽', discount: 'Up to 35% off', link: '/products?category=sports' }
            ].map((category, index) => (
              <motion.a
                key={category.name}
                href={category.link}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-200"
              >
                <div className="text-4xl mb-3">{category.emoji}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {category.discount}
                </p>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">
            Never Miss a Deal
          </h2>
          <p className="text-blue-100 mb-6 text-lg">
            Subscribe to our newsletter and be the first to know about exclusive offers and discounts.
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </motion.section>

        {/* How to Use Codes */}
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            How to Use Promo Codes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Choose Products
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Add items to your cart and proceed to checkout
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Enter Code
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Copy and paste the promo code at checkout
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Save Money
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Enjoy instant savings on your order
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default OffersPage;