import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getOrders } from '../services/api';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const adminUser = localStorage.getItem('adminUser');
    const [menuOpen, setMenuOpen] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const fetchPendingOrders = async () => {
            try {
                const res = await getOrders();
                const pending = res.data.filter((order) => order.status === 'PENDING').length;
                setPendingCount(pending);
            } catch {
                // Silently fail — navbar should not block the app
            }
        };
        fetchPendingOrders();
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminUser');
        toast.success('Logged out successfully!');
        navigate('/login');
    };

    const navLinks = [
        { path: '/', label: 'Home', exact: true },
        { path: '/products', label: 'Products' },
        { path: '/categories', label: 'Categories' },
        { path: '/orders', label: 'Orders' },
        { path: '/users', label: 'Users' },
    ];

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand" onClick={closeMenu}>
                    <span className="navbar-brand-mark">CS</span>
                    CloudShop Admin
                </Link>

                <button
                    type="button"
                    className="navbar-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={menuOpen}
                >
                    ☰
                </button>

                <div className={`navbar-nav-wrapper ${menuOpen ? 'open' : ''}`}>
                    <div className="navbar-nav">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`navbar-link ${isActive(link.path, link.exact) ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="navbar-actions">
                            <Link
                                to="/orders"
                                className={`navbar-orders-link ${location.pathname === '/orders' ? 'active' : ''}`}
                                title="Pending orders"
                                onClick={closeMenu}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                                {pendingCount > 0 && (
                                    <span className="navbar-badge">{pendingCount}</span>
                                )}
                            </Link>

                            <span className="navbar-user">{adminUser}</span>

                            <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
