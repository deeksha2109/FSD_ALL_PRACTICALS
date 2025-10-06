import { motion } from 'framer-motion';
import { Tag, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OfferCard = ({ offer }) => {
  const isExpiringSoon = () => {
    if (!offer.validUntil) return false;
    const now = new Date();
    const validUntil = new Date(offer.validUntil);
    const timeDiff = validUntil.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 3;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-white rounded-full"></div>
      </div>

      <div className="relative p-6 text-white">
        {/* Offer Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Tag className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
              {offer.type || 'Special Offer'}
            </span>
          </div>
          
          {isExpiringSoon() && (
            <div className="flex items-center space-x-1 bg-red-500 bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium">
              <Clock className="w-3 h-3" />
              <span>Ending Soon</span>
            </div>
          )}
        </div>

        {/* Offer Content */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
          <p className="text-white text-opacity-90 text-sm leading-relaxed mb-3">
            {offer.description}
          </p>
          
          {/* Discount Display */}
          <div className="flex items-center space-x-3">
            <div className="text-3xl font-black">
              {offer.discount}%
            </div>
            <div className="text-sm">
              <div className="font-medium">OFF</div>
              {offer.minPurchase && (
                <div className="text-white text-opacity-75">
                  Min. ${offer.minPurchase}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Offer Details */}
        {offer.validUntil && (
          <div className="flex items-center space-x-2 mb-4 text-sm text-white text-opacity-75">
            <Clock className="w-4 h-4" />
            <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
          </div>
        )}

        {/* CTA Button */}
        <Link 
          to={offer.link || '/products'}
          className="inline-flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 group"
        >
          <span>{offer.ctaText || 'Shop Now'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>

        {/* Offer Code */}
        {offer.code && (
          <div className="mt-4 p-3 bg-white bg-opacity-20 rounded-lg border-2 border-dashed border-white border-opacity-50">
            <div className="text-xs text-white text-opacity-75 mb-1">Use Code:</div>
            <div className="font-mono font-bold tracking-wider">{offer.code}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OfferCard;