import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, authApi, clearToken, getToken } from '../api/client';


function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const init = async () => {
      if (!getToken()) {
        navigate('/admin/login');
        return;
      }
      try {
        const me = await authApi.me();
        if (!me.user?.isAdmin) {
          navigate('/admin/login');
          return;
        }
        const list = await adminApi.listBookings();
        setBookings(list);
      } catch (e) {
        navigate('/admin/login');
      }
    };
    init();
  }, [navigate]);

  const handleApprove = async (id) => {
    const updated = await adminApi.approveBooking(id);
    setBookings((prev) => prev.map((b) => (b._id === id ? updated : b)));
  };

  const handleReject = async (id) => {
    const updated = await adminApi.rejectBooking(id);
    setBookings((prev) => prev.map((b) => (b._id === id ? updated : b)));
  };

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem('currentUser');
    navigate('/admin/login');
  };

  // Calculate statistics
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => !b.adminStatus || b.adminStatus === 'Pending').length;
  const approvedBookings = bookings.filter(b => b.adminStatus === 'Approved').length;
  const rejectedBookings = bookings.filter(b => b.adminStatus === 'Rejected').length;
  const totalRevenue = bookings
    .filter(b => b.adminStatus === 'Approved')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.ride?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'pending' && (!booking.adminStatus || booking.adminStatus === 'Pending')) ||
      booking.adminStatus?.toLowerCase() === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    if (!status || status === 'Pending') {
      return <span className="status-badge pending">Pending</span>;
    } else if (status === 'Approved') {
      return <span className="status-badge approved">Approved</span>;
    } else if (status === 'Rejected') {
      return <span className="status-badge rejected">Rejected</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString() || 0}`;
  };

  return (
    <div className="admin-dashboard-page">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title">
            <h1>🛡️ RentalHub Admin Dashboard</h1>
            <p>Manage bookings, monitor performance, and oversee operations</p>
          </div>
          <div className="admin-actions">
            <span className="admin-welcome">Welcome, Admin</span>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-container">
        {/* Statistics Cards */}
        <div className="dashboard-stats">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Bookings</h3>
              <span className="stat-number">{totalBookings}</span>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Pending</h3>
              <span className="stat-number">{pendingBookings}</span>
            </div>
          </div>

          <div className="stat-card approved">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Approved</h3>
              <span className="stat-number">{approvedBookings}</span>
            </div>
          </div>

          <div className="stat-card rejected">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <h3>Rejected</h3>
              <span className="stat-number">{rejectedBookings}</span>
            </div>
          </div>

          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <span className="stat-number">{formatCurrency(totalRevenue)}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            🚗 Bookings
          </button>
          <button
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>📋 Recent Activity</h3>
                <div className="recent-activities">
                  {bookings.slice(0, 5).map((booking, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-info">
                        <span className="activity-name">{booking.name}</span>
                        <span className="activity-action">booked {booking.ride}</span>
                      </div>
                      <span className="activity-time">
                        {formatDate(booking.bookingDate)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overview-card">
                <h3>🎯 Quick Actions</h3>
                <div className="quick-actions">
                  <button className="quick-action-btn">
                    📊 Generate Report
                  </button>
                  <button className="quick-action-btn">
                    🚗 Manage Fleet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="tab-content">
            {/* Search and Filter */}
            <div className="bookings-controls">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search by customer name, email, or car..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-controls">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bookings-table-container">
              {filteredBookings.length === 0 ? (
                <div className="no-bookings">
                  <div className="no-bookings-icon">📋</div>
                  <h3>No Bookings Found</h3>
                  <p>No bookings match your current search and filter criteria.</p>
                </div>
              ) : (
                <table className="enhanced-admin-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Contact</th>
                      <th>Vehicle</th>
                      <th>Journey</th>
                      <th>Duration</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id || booking.id} className="booking-row">
                        <td>
                          <div className="customer-info">
                            <strong>{booking.name}</strong>
                            <small>ID: RH{(booking.bookingDate ? Date.parse(booking.bookingDate) : Date.parse(booking.createdAt || new Date())).toString().slice(-6)}</small>
                          </div>
                        </td>
                        <td>
                          <div className="contact-info">
                            <div>{booking.email}</div>
                            <div>{booking.phone}</div>
                          </div>
                        </td>
                        <td>
                          <div className="vehicle-info">
                            <strong>{booking.ride || booking.carDetails?.name}</strong>
                            {booking.carDetails && (
                              <small>{booking.carDetails.category} • {booking.carDetails.transmission}</small>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="journey-info">
                            <div>📍 {booking.pickup}</div>
                            <div>🏁 {booking.dropoff}</div>
                          </div>
                        </td>
                        <td>
                          <div className="duration-info">
                            {booking.startDate && booking.endDate ? (
                              <>
                                <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                                <div>{booking.rentalDays || 1} day(s)</div>
                              </>
                            ) : (
                              <div>{booking.datetime || 'N/A'}</div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="amount-info">
                            <strong>{formatCurrency(booking.totalAmount)}</strong>
                          </div>
                        </td>
                        <td>
                          <span className={`payment-badge ${booking.paymentStatus?.toLowerCase()}`}>
                            {booking.paymentStatus || 'Pending'}
                          </span>
                        </td>
                        <td>
                          {getStatusBadge(booking.adminStatus)}
                        </td>
                        <td>
                          <div className="action-buttons">
                            {(!booking.adminStatus || booking.adminStatus === 'Pending') && (
                              <>
                                <button
                                  onClick={() => handleApprove(booking._id)}
                                  className="approve-btn"
                                  title="Approve Booking"
                                >
                                  ✅
                                </button>
                                <button
                                  onClick={() => handleReject(booking._id)}
                                  className="reject-btn"
                                  title="Reject Booking"
                                >
                                  ❌
                                </button>
                              </>
                            )}
                            <button className="view-btn" title="View Details">
                              👁️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="tab-content">
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>📊 Booking Trends</h3>
                <div className="trend-stats">
                  <div className="trend-item">
                    <span>Today's Bookings</span>
                    <span className="trend-value">
                      {bookings.filter(b => {
                        const today = new Date().toDateString();
                        const bookingDate = new Date(b.bookingDate || new Date()).toDateString();
                        return bookingDate === today;
                      }).length}
                    </span>
                  </div>
                  <div className="trend-item">
                    <span>This Week</span>
                    <span className="trend-value">
                      {bookings.filter(b => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        const bookingDate = new Date(b.bookingDate || new Date());
                        return bookingDate >= weekAgo;
                      }).length}
                    </span>
                  </div>
                  <div className="trend-item">
                    <span>Success Rate</span>
                    <span className="trend-value">
                      {totalBookings > 0 ? Math.round((approvedBookings / totalBookings) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="analytics-card">
                <h3>🚗 Popular Vehicles</h3>
                <div className="popular-vehicles">
                  {(() => {
                    const vehicleCounts = {};
                    bookings.forEach(booking => {
                      const vehicle = booking.ride || booking.carDetails?.name || 'Unknown';
                      vehicleCounts[vehicle] = (vehicleCounts[vehicle] || 0) + 1;
                    });

                    return Object.entries(vehicleCounts)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([vehicle, count]) => (
                        <div key={vehicle} className="vehicle-stat">
                          <span>{vehicle}</span>
                          <span className="vehicle-count">{count} bookings</span>
                        </div>
                      ));
                  })()}
                </div>
              </div>

              <div className="analytics-card">
                <h3>💰 Revenue Analytics</h3>
                <div className="revenue-stats">
                  <div className="revenue-item">
                    <span>Average Booking Value</span>
                    <span className="revenue-value">
                      {formatCurrency(approvedBookings > 0 ? totalRevenue / approvedBookings : 0)}
                    </span>
                  </div>
                  <div className="revenue-item">
                    <span>Monthly Target</span>
                    <span className="revenue-value">₹50,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="admin-footer">
        © {new Date().getFullYear()} RentalHub Admin Portal. All rights reserved.
      </footer>
    </div>
  );
}

export default AdminDashboard;
