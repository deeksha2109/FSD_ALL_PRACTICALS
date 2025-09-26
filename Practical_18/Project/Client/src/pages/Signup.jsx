import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi, setToken } from '../api/client';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    return newErrors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      const res = await authApi.signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      setToken(res.token);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      navigate('/');
    } catch (err) {
      const msg = err.message || 'Signup failed';
      setErrors({ general: msg, ...(msg.toLowerCase().includes('email') ? { email: msg } : {}) });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = ['Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#ff4757', '#ffa502', '#3742fa', '#2ed573'];

    return {
      level: levels[strength - 1] || 'Weak',
      color: colors[strength - 1] || '#ff4757',
      width: `${(strength / 4) * 100}%`
    };
  };

  const benefits = [
    "🚗 Access to premium vehicles",
    "💰 Best price guarantee",
    "📱 Easy mobile booking",
    "🛡️ Comprehensive insurance"
  ];

  return (
    <div className="page-content">
      <div className="panel" style={{ maxWidth: 520, margin: '40px auto', padding: 24 }}>
        <h2 style={{ marginBottom: 8 }}>Create account</h2>
        <p style={{ color: '#94a3b8', marginBottom: 16 }}>Join RentalHub in a minute</p>

        {errors.general && (
          <div className="error-message" style={{ marginBottom: 12 }}>{errors.general}</div>
        )}

        <form onSubmit={handleSignup}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label>First name *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" />
              {errors.firstName && <small className="error-text">{errors.firstName}</small>}
            </div>
            <div className="form-group">
              <label>Last name *</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" />
              {errors.lastName && <small className="error-text">{errors.lastName}</small>}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 12 }}>
            <label>Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" />
            {errors.email && <small className="error-text">{errors.email}</small>}
          </div>

          <div className="form-group" style={{ marginTop: 12 }}>
            <label>Phone *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="10-digit mobile number" />
            {errors.phone && <small className="error-text">{errors.phone}</small>}
          </div>

          <div className="form-group" style={{ marginTop: 12 }}>
            <label>Password *</label>
            <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" />
            {errors.password && <small className="error-text">{errors.password}</small>}
          </div>

          <div className="form-group" style={{ marginTop: 12 }}>
            <label>Confirm password *</label>
            <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" />
            {errors.confirmPassword && <small className="error-text">{errors.confirmPassword}</small>}
          </div>

          <div style={{ display: 'flex', gap: 12, margin: '8px 0 16px' }}>
            <button type="button" className="btn" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'} pass</button>
            <button type="button" className="btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? 'Hide' : 'Show'} confirm</button>
          </div>

          <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
            I agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy</Link>
          </label>
          {errors.terms && <small className="error-text">{errors.terms}</small>}

          <button type="submit" className="btn" disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <span>Already have an account? </span>
          <Link to="/login" className="link">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
