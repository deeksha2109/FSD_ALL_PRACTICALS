import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Plus,
  BarChart3,
  Users
} from 'lucide-react';
import Button from '../../components/common/Button.js';
import { Link } from 'react-router-dom';
import { fetchBusinessOverview, fetchBusinessOrders } from '../../utils/api.js';

const BusinessDashboard = () => {
  const [stats, setStats] = useState([
    { title: 'Total Sales', value: '$0.00', change: '', isPositive: true, icon: DollarSign, color: 'green' },
    { title: 'Products Listed', value: '0', change: '', isPositive: true, icon: Package, color: 'blue' },
    { title: 'Orders Received', value: '0', change: '', isPositive: true, icon: ShoppingCart, color: 'purple' },
    { title: 'Customer Views', value: '0', change: '', isPositive: true, icon: Eye, color: 'orange' }
  ]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [overview, orders] = await Promise.all([
          fetchBusinessOverview(),
          fetchBusinessOrders()
        ]);
        if (!mounted) return;

        setStats(prev => prev.map(s => {
          if (s.title === 'Total Sales') return { ...s, value: `$${(overview?.totalSales ?? 0).toFixed(2)}` };
          if (s.title === 'Products Listed') return { ...s, value: String(overview?.productsCount ?? 0) };
          if (s.title === 'Orders Received') return { ...s, value: String(overview?.ordersCount ?? 0) };
          if (s.title === 'Customer Views') return { ...s, value: String(overview?.totalViews ?? 0) };
          return s;
        }));

        setTopProducts((overview?.topProducts || []).map(tp => ({
          name: tp.name,
          sales: tp.sales,
          revenue: '-',
          stock: tp.stock
        })));

        setRecentOrders((orders || []).slice(0, 5).map(o => ({
          id: o.orderNumber,
          customer: o.customer?.name || 'N/A',
          product: o.items?.[0]?.product?.title || '—',
          amount: `$${(o.pricing?.total ?? 0).toFixed(2)}`,
          status: o.status
        })));
      } catch (e) {
        console.error(e);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || statusClasses.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Business Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back! Here's how your business is performing today.
              </p>
            </div>
            {/* Removed Add Product button as requested */}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {stat.isPositive ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                    <IconComponent className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Orders
                </h2>
                <button className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium">
                  <Eye className="w-4 h-4" />
                  <span>View All</span>
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {order.id}
                        </p>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {order.customer} • {order.product}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {order.amount}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Top Products
                </h2>
                <button className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium">
                  <BarChart3 className="w-4 h-4" />
                  <span>View Analytics</span>
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {topProducts.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {product.sales} sales
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Stock: {product.stock}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {product.revenue}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/business/inventory" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 text-left">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Manage Inventory
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update stock levels
                  </p>
                </div>
              </div>
            </Link>

            <Link to="/business/reports" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 text-left">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    View Reports
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sales & performance analytics
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BusinessDashboard;