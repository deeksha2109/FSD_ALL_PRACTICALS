import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi, setToken } from '../api/client';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await authApi.login({ email: formData.email, password: formData.password });
      setToken(res.token);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      if (rememberMe) {
        localStorage.setItem('rememberedUser', formData.email);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'user@rentalhub.com',
      password: 'password123'
    });
  };

  const benefits = [
    {
      icon: "🚗",
      title: "Easy Booking",
      description: "Quick and hassle-free car reservations"
    },
    {
      icon: "💰",
      title: "Best Prices",
      description: "Competitive rates with transparent pricing"
    },
    {
      icon: "🛡️",
      title: "Secure & Safe",
      description: "Comprehensive insurance and safety measures"
    },
    {
      icon: "⭐",
      title: "Premium Service",
      description: "Top-rated customer service and support"
    }
  ];

  return (
    <div className="page-content">
      <div className="panel" style={{ maxWidth: 420, margin: '40px auto', padding: 24 }}>
        <h2 style={{ marginBottom: 8 }}>Sign in</h2>
        <p style={{ color: '#94a3b8', marginBottom: 16 }}>Access your RentalHub account</p>

        {error && (
          <div className="error-message" style={{ marginBottom: 12 }}>{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label>Password</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                style={{ flex: 1 }}
              />
              <button type="button" className="btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Remember me
            </label>
            <Link to="/forgot-password" className="link">Forgot password?</Link>
          </div>

          <button type="submit" className="btn" disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <span>New here? </span>
          <Link to="/signup" className="link">Create an account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
