import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Fleet from './pages/Fleet';
import Offers from './pages/Offers';
import Contact from './pages/Contact';
import Booking from './pages/booking';
import Confirmation from './pages/confirmation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';


const App = () => {
  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="page-content">
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/fleet' element={<Fleet />} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/booking' element={<Booking />} />
          <Route path='/confirmation' element={<Confirmation />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
