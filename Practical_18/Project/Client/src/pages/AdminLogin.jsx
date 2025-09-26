import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi, setToken } from '../api/client';

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await authApi.login({ email: formData.email, password: formData.password });
      if (!res.user?.isAdmin) {
        setError('This account does not have admin access.');
        return;
      }
      setToken(res.token);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Admin login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'admin@rentalhub.com',
      password: 'admin123'
    });
  };

  const adminFeatures = [
    {
      icon: "📊",
      title: "Dashboard Analytics",
      description: "View booking statistics and reports"
    },
    {
      icon: "🚗",
      title: "Fleet Management",
      description: "Manage vehicle inventory"
    },
    {
      icon: "👥",
      title: "Customer Management",
      description: "Access customer data and bookings"
    }
  ];

  return (
    <div className="page-content">
      <div className="panel" style={{ maxWidth: 420, margin: '40px auto', padding: 24 }}>
        <h2 style={{ marginBottom: 8 }}>Admin sign in</h2>
        <p style={{ color: '#64748B', marginBottom: 16 }}>For authorized administrators only</p>

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
              placeholder="admin@rentalhub.com"
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

          <button type="submit" className="btn" disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link to="/" className="link">← Back to main site</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
