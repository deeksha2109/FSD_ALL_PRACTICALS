import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getToken, clearToken } from '../api/client';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ React Router location
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!getToken() || !!localStorage.getItem('currentUser')
  );

  useEffect(() => {
    // Update whenever route changes
    setIsLoggedIn(!!getToken() || !!localStorage.getItem('currentUser'));
  }, [location]); // ✅ dependency on location change

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'auth_token' || e.key === 'currentUser') {
        setIsLoggedIn(!!getToken() || !!localStorage.getItem('currentUser'));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adminSession');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="navbar-brand" onClick={() => navigate('/')}>
        RentalHub
      </div>

      {/* Center Links */}
      <div className="navbar-center">
        <span onClick={() => navigate('/')} className="nav-link">Home</span>
        <span onClick={() => navigate('/fleet')} className="nav-link">Fleet</span>
        <span onClick={() => navigate('/offers')} className="nav-link">Offers</span>
        <span onClick={() => navigate('/contact')} className="nav-link">Contact</span>
      </div>

      {/* Login/Logout Right */}
      <div className="navbar-right">
        {isLoggedIn ? (
          <span className="nav-link login-link" style={{ cursor: "pointer" }} onClick={handleLogout}>
            Logout
          </span>
        ) : (
          <div className="dropdown">
            <span className="nav-link login-link">Login ▼</span>
            <div className="dropdown-content">
              <span onClick={() => navigate('/login')} className="dropdown-item">User Login</span>
              <span onClick={() => navigate('/admin/login')} className="dropdown-item">Admin Login</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
