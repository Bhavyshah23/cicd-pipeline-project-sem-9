import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories, getOrders, getUsers, getTotalRevenue } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatCard from '../components/ui/StatCard';
import ProductCard from '../components/ui/ProductCard';
import EmptyState from '../components/ui/EmptyState';

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

    if (loading) {
        return (
            <div>
                <div className="stats-grid">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="skeleton skeleton-stat" />
                    ))}
                </div>
                <LoadingSpinner message="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div>
            <div className="hero">
                <h1>Welcome to CloudShop</h1>
                <p>Cloud-native e-commerce platform built with Spring Boot and AWS</p>
                <div className="hero-actions">
                    <Link to="/products" className="btn btn-warning btn-lg">Browse Products</Link>
                    <Link to="/orders" className="btn btn-light btn-lg">View Orders</Link>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard icon="📦" value={stats.products} label="Total Products" />
                <StatCard icon="🏷️" value={stats.categories} label="Categories" />
                <StatCard icon="🛒" value={stats.orders} label="Total Orders" />
                <StatCard icon="👥" value={stats.users} label="Users" />
                <StatCard icon="💰" value={`₹${stats.revenue.toFixed(0)}`} label="Total Revenue" />
            </div>

            <div className="card">
                <div className="page-header">
                    <h2>Recent Products</h2>
                    <Link to="/products" className="btn btn-primary btn-sm">View All</Link>
                </div>

                {recentProducts.length === 0 ? (
                    <EmptyState
                        icon="📦"
                        title="No products yet"
                        description="Add your first product to see it here."
                    />
                ) : (
                    <div className="grid">
                        {recentProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
