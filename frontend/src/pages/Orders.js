import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getOrders, updateOrderStatus, deleteOrder, getTotalRevenue } from '../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revenue, setRevenue] = useState(0);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const [o, r] = await Promise.all([getOrders(), getTotalRevenue()]);
            setOrders(o.data);
            setRevenue(r.data);
        } catch { toast.error('Failed to load orders'); }
        finally { setLoading(false); }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateOrderStatus(id, status);
            toast.success(`Order ${status.toLowerCase()}! ✅`);
            fetchOrders();
        } catch { toast.error('Failed to update status'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this order?')) return;
        try {
            await deleteOrder(id);
            toast.success('Order deleted!');
            fetchOrders();
            if (showDetailModal) setShowDetailModal(false);
        } catch { toast.error('Failed to delete order'); }
    };

    const openDetail = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const filteredOrders = filterStatus === 'ALL'
        ? orders
        : orders.filter(o => o.status === filterStatus);

    const getStatusBadge = (status) => {
        const map = {
            'PENDING': 'badge-warning',
            'CONFIRMED': 'badge-info',
            'DELIVERED': 'badge-success',
            'CANCELLED': 'badge-danger'
        };
        return map[status] || 'badge-info';
    };

    const getStatusEmoji = (status) => {
        const map = {
            'PENDING': '⏳',
            'CONFIRMED': '✅',
            'DELIVERED': '📦',
            'CANCELLED': '❌'
        };
        return map[status] || '📋';
    };

    // Stats
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'PENDING').length,
        confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
        delivered: orders.filter(o => o.status === 'DELIVERED').length,
        cancelled: orders.filter(o => o.status === 'CANCELLED').length,
    };

    if (loading) return <div className="loading">⏳ Loading Orders...</div>;

    return (
        <div>
            <div className="page-header">
                <h1>🛒 Order Management</h1>
                <div style={{
                    background: 'linear-gradient(135deg, #28a745, #20c997)',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: '600'
                }}>
                    💰 Total Revenue: ₹{revenue.toFixed(2)}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                <div className="stat-card">
                    <div className="stat-icon">📋</div>
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Orders</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-value" style={{ color: '#856404' }}>{stats.pending}</div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-value" style={{ color: '#0c5460' }}>{stats.confirmed}</div>
                    <div className="stat-label">Confirmed</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-value" style={{ color: '#155724' }}>{stats.delivered}</div>
                    <div className="stat-label">Delivered</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">❌</div>
                    <div className="stat-value" style={{ color: '#721c24' }}>{stats.cancelled}</div>
                    <div className="stat-label">Cancelled</div>
                </div>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {['ALL', 'PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map(s => (
                    <button
                        key={s}
                        className={`btn ${filterStatus === s ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '6px 16px', fontSize: '13px' }}
                        onClick={() => setFilterStatus(s)}
                    >
                        {getStatusEmoji(s)} {s} {s !== 'ALL' && `(${stats[s.toLowerCase()]})`}
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer Info</th>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Total Price</th>
                                <th>Status</th>
                                <th>Order Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                                        No orders found
                                    </td>
                                </tr>
                            ) : filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td>
                                        <strong style={{ color: '#1F4E79' }}>#{order.id}</strong>
                                    </td>
                                    <td>
                                        <div>
                                            <strong>👤 {order.user?.name || 'Unknown'}</strong>
                                            <br/>
                                            <small style={{ color: '#666' }}>
                                                📧 {order.user?.email || '-'}
                                            </small>
                                            <br/>
                                            <small style={{ color: '#666' }}>
                                                📱 {order.user?.phone || '-'}
                                            </small>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <strong>📦 {order.product?.name || '-'}</strong>
                                            <br/>
                                            <small style={{ color: '#28a745' }}>
                                                ₹{order.product?.price} per unit
                                            </small>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-info">{order.quantity}</span>
                                    </td>
                                    <td>
                                        <strong style={{ color: '#28a745', fontSize: '16px' }}>
                                            ₹{order.totalPrice}
                                        </strong>
                                    </td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(order.status)}`}>
                                            {getStatusEmoji(order.status)} {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <small>
                                            {order.orderDate
                                                ? new Date(order.orderDate).toLocaleDateString('en-IN', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })
                                                : '-'}
                                        </small>
                                        <br/>
                                        <small style={{ color: '#888' }}>
                                            {order.orderDate
                                                ? new Date(order.orderDate).toLocaleTimeString('en-IN', {
                                                    hour: '2-digit', minute: '2-digit'
                                                })
                                                : ''}
                                        </small>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                            <button
                                                className="btn btn-secondary"
                                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                                onClick={() => openDetail(order)}
                                            >
                                                👁️ View
                                            </button>
                                            {order.status === 'PENDING' && (
                                                <button
                                                    className="btn btn-success"
                                                    style={{ padding: '4px 8px', fontSize: '11px' }}
                                                    onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                                                >
                                                    ✅ Confirm
                                                </button>
                                            )}
                                            {order.status === 'CONFIRMED' && (
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ padding: '4px 8px', fontSize: '11px' }}
                                                    onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                                                >
                                                    📦 Deliver
                                                </button>
                                            )}
                                            {order.status === 'PENDING' && (
                                                <button
                                                    className="btn btn-warning"
                                                    style={{ padding: '4px 8px', fontSize: '11px' }}
                                                    onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                                >
                                                    ❌ Cancel
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-danger"
                                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                                onClick={() => handleDelete(order.id)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Detail Modal */}
            {showDetailModal && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
                    <div className="modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2>📋 Order #{selectedOrder.id} Details</h2>
                            <span className={`badge ${getStatusBadge(selectedOrder.status)}`} style={{ fontSize: '14px', padding: '6px 14px' }}>
                                {getStatusEmoji(selectedOrder.status)} {selectedOrder.status}
                            </span>
                        </div>

                        {/* Customer Section */}
                        <div style={{ background: '#EBF3FB', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                            <h3 style={{ color: '#1F4E79', marginBottom: '12px' }}>👤 Customer Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div>
                                    <small style={{ color: '#666' }}>Full Name</small>
                                    <p><strong>{selectedOrder.user?.name || '-'}</strong></p>
                                </div>
                                <div>
                                    <small style={{ color: '#666' }}>Email</small>
                                    <p><strong>{selectedOrder.user?.email || '-'}</strong></p>
                                </div>
                                <div>
                                    <small style={{ color: '#666' }}>Phone</small>
                                    <p><strong>{selectedOrder.user?.phone || '-'}</strong></p>
                                </div>
                                <div>
                                    <small style={{ color: '#666' }}>Address</small>
                                    <p><strong>{selectedOrder.user?.address || '-'}</strong></p>
                                </div>
                            </div>
                        </div>

                        {/* Product Section */}
                        <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                            <h3 style={{ color: '#1F4E79', marginBottom: '12px' }}>📦 Product Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div>
                                    <small style={{ color: '#666' }}>Product Name</small>
                                    <p><strong>{selectedOrder.product?.name || '-'}</strong></p>
                                </div>
                                <div>
                                    <small style={{ color: '#666' }}>Category</small>
                                    <p><strong>{selectedOrder.product?.category?.name || '-'}</strong></p>
                                </div>
                                <div>
                                    <small style={{ color: '#666' }}>Unit Price</small>
                                    <p><strong style={{ color: '#28a745' }}>₹{selectedOrder.product?.price}</strong></p>
                                </div>
                                <div>
                                    <small style={{ color: '#666' }}>Quantity Ordered</small>
                                    <p><strong>{selectedOrder.quantity} units</strong></p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div style={{ background: '#d4edda', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                            <h3 style={{ color: '#155724', marginBottom: '12px' }}>💰 Order Summary</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <small style={{ color: '#155724' }}>Order Date</small>
                                    <p><strong>{selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleString('en-IN') : '-'}</strong></p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <small style={{ color: '#155724' }}>Total Amount</small>
                                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#155724' }}>
                                        ₹{selectedOrder.totalPrice}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            {selectedOrder.status === 'PENDING' && (
                                <>
                                    <button className="btn btn-success"
                                        onClick={() => { handleStatusUpdate(selectedOrder.id, 'CONFIRMED'); setShowDetailModal(false); }}>
                                        ✅ Confirm Order
                                    </button>
                                    <button className="btn btn-warning"
                                        onClick={() => { handleStatusUpdate(selectedOrder.id, 'CANCELLED'); setShowDetailModal(false); }}>
                                        ❌ Cancel Order
                                    </button>
                                </>
                            )}
                            {selectedOrder.status === 'CONFIRMED' && (
                                <button className="btn btn-primary"
                                    onClick={() => { handleStatusUpdate(selectedOrder.id, 'DELIVERED'); setShowDetailModal(false); }}>
                                    📦 Mark as Delivered
                                </button>
                            )}
                            <button className="btn btn-danger"
                                onClick={() => handleDelete(selectedOrder.id)}>
                                🗑️ Delete Order
                            </button>
                            <button className="btn btn-secondary"
                                onClick={() => setShowDetailModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;