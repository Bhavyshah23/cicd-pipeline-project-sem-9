import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const adminUser = localStorage.getItem('adminUser');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminUser');
        toast.success('Logged out successfully!');
        navigate('/login');
    };

    const navLinks = [
        { path: '/', label: '🏠 Home' },
        { path: '/products', label: '📦 Products' },
        { path: '/categories', label: '🏷️ Categories' },
        { path: '/orders', label: '🛒 Orders' },
        { path: '/users', label: '👥 Users' },
    ];

    return (
        <nav style={{
            background: 'linear-gradient(135deg, #1F4E79, #2E75B6)',
            padding: '0 30px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1200px',
                margin: '0 auto',
                height: '65px'
            }}>
                <Link to="/" style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '20px',
                    fontWeight: '700'
                }}>
                    ☁️ CloudShop Admin
                </Link>

                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{
                                color: 'white',
                                textDecoration: 'none',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontWeight: '500',
                                background: location.pathname === link.path
                                    ? 'rgba(255,255,255,0.2)'
                                    : 'transparent'
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div style={{
                        marginLeft: '12px',
                        paddingLeft: '12px',
                        borderLeft: '1px solid rgba(255,255,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>
                            👤 {adminUser}
                        </span>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.3)',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '13px'
                            }}
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;