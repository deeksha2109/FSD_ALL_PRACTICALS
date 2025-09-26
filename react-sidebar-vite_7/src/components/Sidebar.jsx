import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    return (
        <>
            <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">Navigation</h2>
                </div>
                <nav className="sidebar-nav">
                    <Link
                        to="/"
                        onClick={toggleSidebar}
                        className={location.pathname === '/' ? 'active' : ''}
                    >
                        🏠 Home
                    </Link>
                    <Link
                        to="/about"
                        onClick={toggleSidebar}
                        className={location.pathname === '/about' ? 'active' : ''}
                    >
                        ℹ️ About
                    </Link>
                    <Link
                        to="/contact"
                        onClick={toggleSidebar}
                        className={location.pathname === '/contact' ? 'active' : ''}
                    >
                        📞 Contact
                    </Link>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
