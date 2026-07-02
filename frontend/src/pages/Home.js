import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories, getOrders, getUsers, getTotalRevenue } from '../services/api';

const Home = () => {
    const [stats, setStats] = useState({
        products: 0, categories: 0,
        orders: 0, users: 0, revenue: 0
    });
    const [recentProducts, setRecentProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [products, categories, orders, users, revenue] = await Promise.all([
                    getProducts(), getCategories(),
                    getOrders(), getUsers(), getTotalRevenue()
                ]);
                setStats({
                    products: products.data.length,
                    categories: categories.data.length,
                    orders: orders.data.length,
                    users: users.data.length,
                    revenue: revenue.data
                });
                setRecentProducts(products.data.slice(0, 6));
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading">⏳ Loading Dashboard...</div>;

    return (
        <div>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #1F4E79, #2E75B6)',
                color: 'white',
                padding: '50px 40px',
                borderRadius: '12px',
                marginBottom: '30px',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>
                    ☁️ Welcome to CloudShop
                </h1>
                <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '24px' }}>
                    Cloud-Native E-Commerce Platform built with Spring Boot + AWS
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <Link to="/products" className="btn btn-warning">
                        🛍️ Browse Products
                    </Link>
                    <Link to="/orders" className="btn" style={{ background: 'white', color: '#1F4E79' }}>
                        📋 View Orders
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-value">{stats.products}</div>
                    <div className="stat-label">Total Products</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🏷️</div>
                    <div className="stat-value">{stats.categories}</div>
                    <div className="stat-label">Categories</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-value">{stats.orders}</div>
                    <div className="stat-label">Total Orders</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-value">{stats.users}</div>
                    <div className="stat-label">Users</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-value">₹{stats.revenue.toFixed(0)}</div>
                    <div className="stat-label">Total Revenue</div>
                </div>
            </div>

            {/* Recent Products */}
            <div className="card">
                <div className="page-header">
                    <h2 style={{ color: '#1F4E79' }}>🆕 Recent Products</h2>
                    <Link to="/products" className="btn btn-primary">View All</Link>
                </div>
                <div className="grid">
                    {recentProducts.map(product => (
                        <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ fontSize: '40px', textAlign: 'center', marginBottom: '12px' }}>
                                    📦
                                </div>
                                <h3 style={{ marginBottom: '8px', color: '#1F4E79' }}>{product.name}</h3>
                                <p style={{ color: '#666', fontSize: '13px', marginBottom: '10px' }}>
                                    {product.description?.substring(0, 60)}...
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '20px', fontWeight: '700', color: '#28a745' }}>
                                        ₹{product.price}
                                    </span>
                                    <span className="badge badge-info">
                                        Stock: {product.quantity}
                                    </span>
                                </div>
                                {product.category && (
                                    <div style={{ marginTop: '8px' }}>
                                        <span className="badge badge-success">{product.category.name}</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;