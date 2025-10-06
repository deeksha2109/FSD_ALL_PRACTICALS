import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-inner container">
          <div style={{ fontWeight: 700 }}>Auth Portal</div>
          <div className="nav-links">
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">
          <Routes>
            <Route path="/register" element={<div className="panel"><Register /></div>} />
            <Route path="/login" element={<div className="panel"><Login /></div>} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <div className="panel"><Dashboard /></div>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<div className="panel"><Login /></div>} />
          </Routes>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-inner container">
          <p>© 2025 Auth Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
