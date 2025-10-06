import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import Button from '../../components/common/Button.js';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, loading, error, clearError, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate(from, { replace: true });
    } else if (isAuthenticated && user?.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password, 'admin');
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <Link to="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              TownKart
            </span>
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">
              Admin Portal
            </h2>
          </div>
          <p className="mt-2 text-gray-300">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-purple-200 mb-2">
            Demo Admin Credentials:
          </h3>
          <div className="text-xs text-purple-300 space-y-1">
            <p><strong>Email:</strong> admin@test.com</p>
            <p><strong>Password:</strong> password</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-900/20 border border-red-700 rounded-lg p-4"
              >
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Admin Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-200"
                placeholder="Enter admin email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-300 backdrop-blur-sm transition-all duration-200"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white"
            >
              Sign in to Admin Portal
            </Button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
          >
            ← Back to TownKart
          </Link>
        </div>

        {/* Other Login Options */}
        <div className="border-t border-gray-700 pt-6">
          <p className="text-center text-sm text-gray-400 mb-4">
            Other login options
          </p>
          <div className="flex space-x-4">
            <Link
              to="/login"
              onClick={(e) => { e.preventDefault(); navigate('/login'); }}
              className="flex-1 text-center py-2 px-4 border border-gray-600 rounded-lg text-gray-300 hover:bg-white/5 transition-colors duration-200"
            >
              Customer Login
            </Link>
            <Link
              to="/business/login"
              onClick={(e) => { e.preventDefault(); navigate('/business/login'); }}
              className="flex-1 text-center py-2 px-4 border border-gray-600 rounded-lg text-gray-300 hover:bg-white/5 transition-colors duration-200"
            >
              Business Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;