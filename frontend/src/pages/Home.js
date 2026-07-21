import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
    ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { getProducts, getCategories, getOrders, getUsers, getTotalRevenue } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatCard from '../components/ui/StatCard';
import ProductCard from '../components/ui/ProductCard';
import EmptyState from '../components/ui/EmptyState';
import './Home.css';

const statusColors = ['var(--color-warning)', 'var(--color-info)', 'var(--color-success)', 'var(--color-danger)'];
const statuses = ['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'];

const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="chart-tooltip">
            <strong>{label || payload[0].name}</strong>
            {payload.map((item) => <span key={item.dataKey}>{item.name}: {item.value}</span>)}
        </div>
    );
};

const Home = () => {
    const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, users: 0, revenue: 0 });
    const [recentProducts, setRecentProducts] = useState([]);
    const [charts, setCharts] = useState({ status: [], ordersOverTime: [], categories: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsResponse, categoriesResponse, ordersResponse, usersResponse, revenueResponse] = await Promise.all([
                    getProducts(), getCategories(), getOrders(), getUsers(), getTotalRevenue()
                ]);
                const products = productsResponse.data;
                const categories = categoriesResponse.data;
                const orders = ordersResponse.data;

                const statusData = statuses.map((status) => ({
                    name: status.charAt(0) + status.slice(1).toLowerCase(),
                    value: orders.filter((order) => order.status === status).length
                }));

                const orderDates = orders.reduce((groups, order) => {
                    if (!order.orderDate) return groups;
                    const date = new Date(order.orderDate);
                    if (Number.isNaN(date.getTime())) return groups;
                    const key = date.toISOString().slice(0, 10);
                    groups[key] = (groups[key] || 0) + 1;
                    return groups;
                }, {});
                const ordersOverTime = Object.entries(orderDates)
                    .sort(([first], [second]) => first.localeCompare(second))
                    .map(([date, orderCount]) => ({
                        date: new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                        orders: orderCount
                    }));

                const categoryCounts = products.reduce((counts, product) => {
                    const category = product.category?.name || 'Uncategorized';
                    counts[category] = (counts[category] || 0) + 1;
                    return counts;
                }, {});
                const categoryData = [
                    ...categories.map((category) => ({ name: category.name, products: categoryCounts[category.name] || 0 })),
                    ...(categoryCounts.Uncategorized ? [{ name: 'Uncategorized', products: categoryCounts.Uncategorized }] : [])
                ];

                setStats({ products: products.length, categories: categories.length, orders: orders.length, users: usersResponse.data.length, revenue: revenueResponse.data });
                setRecentProducts(products.slice(0, 6));
                setCharts({ status: statusData, ordersOverTime, categories: categoryData });
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="stats-grid">{[1, 2, 3, 4, 5].map((item) => <div key={item} className="skeleton skeleton-stat" />)}</div>
                <div className="dashboard-skeleton-grid"><div className="skeleton skeleton-chart" /><div className="skeleton skeleton-chart" /></div>
                <LoadingSpinner compact message="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <section className="hero dashboard-hero">
                <span className="eyebrow">CLOUDCART OVERVIEW</span>
                <h1>Your store, at a glance.</h1>
                <p>Keep inventory moving and orders on track from one clear workspace.</p>
                <div className="hero-actions">
                    <Link to="/products" className="btn btn-light btn-lg">Manage products</Link>
                    <Link to="/orders" className="btn btn-warning btn-lg">Review orders</Link>
                </div>
            </section>

            <section className="stats-grid" aria-label="Store statistics">
                <StatCard icon="📦" value={stats.products} label="Total Products" />
                <StatCard icon="🏷️" value={stats.categories} label="Categories" />
                <StatCard icon="🛒" value={stats.orders} label="Total Orders" />
                <StatCard icon="👥" value={stats.users} label="Customers" />
                <StatCard icon="₹" value={`₹${Number(stats.revenue).toFixed(0)}`} label="Total Revenue" />
            </section>

            <section className="dashboard-chart-grid">
                <article className="card dashboard-chart-card">
                    <div className="dashboard-section-heading"><div><span className="eyebrow">OPERATIONS</span><h2>Orders by status</h2></div><span className="dashboard-caption">{stats.orders} total</span></div>
                    {stats.orders ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={charts.status} dataKey="value" nameKey="name" innerRadius={62} outerRadius={96} paddingAngle={3}>
                                    {charts.status.map((entry, index) => <Cell key={entry.name} fill={statusColors[index]} />)}
                                </Pie>
                                <Tooltip content={<ChartTooltip />} />
                                <Legend verticalAlign="bottom" iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <EmptyState icon="🛒" title="No order activity yet" description="Order status trends will appear here once orders are created." />}
                </article>

                <article className="card dashboard-chart-card">
                    <div className="dashboard-section-heading"><div><span className="eyebrow">ACTIVITY</span><h2>Orders over time</h2></div><span className="dashboard-caption">By day</span></div>
                    {charts.ordersOverTime.length ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={charts.ordersOverTime} margin={{ top: 10, right: 12, left: -22, bottom: 0 }}>
                                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis allowDecimals={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <Line type="monotone" dataKey="orders" name="Orders" stroke="var(--color-primary)" strokeWidth={3} dot={{ fill: 'var(--color-primary)', r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <EmptyState icon="📈" title="No dated orders yet" description="Order activity will appear here once order dates are available." />}
                </article>

                <article className="card dashboard-chart-card dashboard-category-chart">
                    <div className="dashboard-section-heading"><div><span className="eyebrow">CATALOGUE</span><h2>Products per category</h2></div><Link className="dashboard-text-link" to="/categories">Manage categories</Link></div>
                    {charts.categories.length ? (
                        <ResponsiveContainer width="100%" height={Math.max(220, charts.categories.length * 48)}>
                            <BarChart data={charts.categories} layout="vertical" margin={{ top: 0, right: 18, left: 26, bottom: 0 }}>
                                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" allowDecimals={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <YAxis type="category" dataKey="name" width={100} tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} tickLine={false} axisLine={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <Bar dataKey="products" name="Products" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <EmptyState icon="🏷️" title="No categories yet" description="Create categories to see your catalogue mix." />}
                </article>
            </section>

            <section className="card dashboard-recent-products">
                <div className="dashboard-section-heading"><div><span className="eyebrow">CATALOGUE</span><h2>Recent products</h2></div><Link to="/products" className="btn btn-secondary btn-sm">View all products</Link></div>
                {recentProducts.length === 0 ? <EmptyState icon="📦" title="No products yet" description="Add your first product to start building your catalogue." /> : <div className="grid">{recentProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
            </section>
        </div>
    );
};

export default Home;
