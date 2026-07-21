import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getOrders } from '../services/api';

const icons = {
    Home: '⌂', Products: '▦', Categories: '◇', Orders: '▣', Users: '◉'
};

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
                setPendingCount(res.data.filter((order) => order.status === 'PENDING').length);
            } catch { /* The navigation should remain usable if this supporting request fails. */ }
        };
        fetchPendingOrders();
        setMenuOpen(false);
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
    const isActive = (path, exact) => exact ? location.pathname === path : location.pathname.startsWith(path);

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <span className="navbar-brand-mark">C</span>
                    <span>CloudCart <small>ADMIN</small></span>
                </Link>
                <button type="button" className="navbar-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation menu" aria-expanded={menuOpen}>
                    <span /><span /><span />
                </button>
                <div className={`navbar-nav-wrapper ${menuOpen ? 'open' : ''}`}>
                    <div className="navbar-nav">
                        <div className="navbar-links">
                            {navLinks.map((link) => (
                                <Link key={link.path} to={link.path} className={`navbar-link ${isActive(link.path, link.exact) ? 'active' : ''}`}>
                                    <span className="nav-icon" aria-hidden="true">{icons[link.label]}</span>{link.label}
                                    {link.label === 'Orders' && pendingCount > 0 && <span className="navbar-badge">{pendingCount}</span>}
                                </Link>
                            ))}
                        </div>
                        <div className="navbar-actions">
                            <span className="user-avatar" aria-hidden="true">{adminUser?.charAt(0).toUpperCase() || 'A'}</span>
                            <span className="navbar-user">{adminUser || 'Administrator'}</span>
                            <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>Sign out</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
