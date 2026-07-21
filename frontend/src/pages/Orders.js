import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getOrders, updateOrderStatus, deleteOrder, getTotalRevenue, getUsers, getProducts, createOrder } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/ui/Modal';
import StatCard from '../components/ui/StatCard';
import EmptyState from '../components/ui/EmptyState';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revenue, setRevenue] = useState(0);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showNewOrderModal, setShowNewOrderModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [newOrder, setNewOrder] = useState({ userId: '', productId: '', quantity: 1 });
    const [savingOrder, setSavingOrder] = useState(false);

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
            toast.success(`Order ${status.toLowerCase()}!`);
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

    const handleCopyOrderId = async (id) => {
        try {
            await navigator.clipboard.writeText(String(id));
            toast.success(`Order #${id} copied to clipboard`);
        } catch {
            toast.error('Unable to copy order ID');
        }
    };

    const handlePrintOrder = () => window.print();

    const openNewOrderModal = async () => {
        try {
            const [usersResponse, productsResponse] = await Promise.all([getUsers(), getProducts()]);
            setUsers(usersResponse.data);
            setProducts(productsResponse.data);
            setNewOrder({ userId: '', productId: '', quantity: 1 });
            setShowNewOrderModal(true);
        } catch {
            toast.error('Failed to load customers and products');
        }
    };

    const selectedProduct = products.find((product) => String(product.id) === String(newOrder.productId));
    const orderTotal = selectedProduct ? Number(selectedProduct.price) * Number(newOrder.quantity || 0) : 0;

    const handleCreateOrder = async (event) => {
        event.preventDefault();
        setSavingOrder(true);
        try {
            await createOrder({
                user: { id: Number(newOrder.userId) },
                product: { id: Number(newOrder.productId) },
                quantity: Number(newOrder.quantity)
            });
            toast.success('Order created!');
            setShowNewOrderModal(false);
            fetchOrders();
        } catch (err) {
            toast.error(err.response?.data || 'Failed to create order');
        } finally {
            setSavingOrder(false);
        }
    };

    const filteredOrders = filterStatus === 'ALL'
        ? orders
        : orders.filter((o) => o.status === filterStatus);

    const getStatusBadge = (status) => {
        const map = {
            PENDING: 'badge-warning',
            CONFIRMED: 'badge-info',
            DELIVERED: 'badge-success',
            CANCELLED: 'badge-danger'
        };
        return map[status] || 'badge-info';
    };

    const stats = {
        total: orders.length,
        pending: orders.filter((o) => o.status === 'PENDING').length,
        confirmed: orders.filter((o) => o.status === 'CONFIRMED').length,
        delivered: orders.filter((o) => o.status === 'DELIVERED').length,
        cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
    };

    if (loading) return <LoadingSpinner message="Loading orders..." />;

    return (
        <div>
            <PageHeader
                title="Order Management"
                subtitle="Track and manage customer orders"
                action={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div className="revenue-banner">Total Revenue: ₹{revenue.toFixed(2)}</div>
                        <button type="button" className="btn btn-primary" onClick={openNewOrderModal}>New Order</button>
                    </div>
                }
            />

            <div className="stats-grid">
                <StatCard icon="📋" value={stats.total} label="Total Orders" />
                <StatCard icon="⏳" value={stats.pending} label="Pending" valueColor="var(--color-warning)" />
                <StatCard icon="✅" value={stats.confirmed} label="Confirmed" valueColor="var(--color-info)" />
                <StatCard icon="📦" value={stats.delivered} label="Delivered" valueColor="var(--color-success)" />
                <StatCard icon="❌" value={stats.cancelled} label="Cancelled" valueColor="var(--color-danger)" />
            </div>

            <div className="filter-pills">
                {['ALL', 'PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map((s) => (
                    <button
                        key={s}
                        type="button"
                        className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilterStatus(s)}
                    >
                        {s} {s !== 'ALL' && `(${stats[s.toLowerCase()]})`}
                    </button>
                ))}
            </div>

            <div className="card">
                {filteredOrders.length === 0 ? (
                    <EmptyState
                        icon="🛒"
                        title="No orders found"
                        description={filterStatus !== 'ALL' ? `No ${filterStatus.toLowerCase()} orders at the moment.` : 'Orders will appear here once placed.'}
                    />
                ) : (
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
                                {filteredOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td><strong style={{ color: 'var(--color-primary-dark)' }}>#{order.id}</strong></td>
                                        <td>
                                            <div>
                                                <strong>{order.user?.name || 'Unknown'}</strong>
                                                <br />
                                                <small style={{ color: 'var(--color-text-secondary)' }}>{order.user?.email || '-'}</small>
                                                <br />
                                                <small style={{ color: 'var(--color-text-secondary)' }}>{order.user?.phone || '-'}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <strong>{order.product?.name || '-'}</strong>
                                                <br />
                                                <small style={{ color: 'var(--color-success)' }}>₹{order.product?.price} per unit</small>
                                            </div>
                                        </td>
                                        <td><span className="badge badge-info">{order.quantity}</span></td>
                                        <td><strong style={{ color: 'var(--color-success)', fontSize: 'var(--font-size-base)' }}>₹{order.totalPrice}</strong></td>
                                        <td><span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span></td>
                                        <td>
                                            <small>
                                                {order.orderDate
                                                    ? new Date(order.orderDate).toLocaleDateString('en-IN', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    })
                                                    : '-'}
                                            </small>
                                            <br />
                                            <small style={{ color: 'var(--color-text-muted)' }}>
                                                {order.orderDate
                                                    ? new Date(order.orderDate).toLocaleTimeString('en-IN', {
                                                        hour: '2-digit', minute: '2-digit'
                                                    })
                                                    : ''}
                                            </small>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => openDetail(order)}>View</button>
                                                {order.status === 'PENDING' && (
                                                    <button type="button" className="btn btn-success btn-sm" onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}>Confirm</button>
                                                )}
                                                {order.status === 'CONFIRMED' && (
                                                    <button type="button" className="btn btn-primary btn-sm" onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}>Deliver</button>
                                                )}
                                                {order.status === 'PENDING' && (
                                                    <button type="button" className="btn btn-warning btn-sm" onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}>Cancel</button>
                                                )}
                                                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(order.id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showDetailModal && selectedOrder && (
                <Modal
                    title={`Order #${selectedOrder.id} Details`}
                    onClose={() => setShowDetailModal(false)}
                    size="large"
                >
                    <div className="order-detail-header">
                        <div>
                            <span className="order-detail-kicker">Order reference</span>
                            <div className="order-detail-id-row">
                                <strong>#{selectedOrder.id}</strong>
                                <button type="button" className="order-detail-text-action" onClick={() => handleCopyOrderId(selectedOrder.id)}>Copy ID</button>
                            </div>
                        </div>
                        <span className={`badge order-status-badge ${getStatusBadge(selectedOrder.status)}`}>{selectedOrder.status}</span>
                    </div>

                    <ol className={`order-status-timeline ${selectedOrder.status === 'CANCELLED' ? 'is-cancelled' : ''}`} aria-label="Order status progress">
                        {['PENDING', 'CONFIRMED', 'DELIVERED'].map((stage, index) => {
                            const currentIndex = ['PENDING', 'CONFIRMED', 'DELIVERED'].indexOf(selectedOrder.status);
                            return <li key={stage} className={index <= currentIndex ? 'is-complete' : ''}><span>{index + 1}</span>{stage.charAt(0) + stage.slice(1).toLowerCase()}</li>;
                        })}
                    </ol>
                    {selectedOrder.status === 'CANCELLED' && <p className="order-cancelled-note">This order has been cancelled.</p>}

                    <section className="detail-section detail-section-info order-detail-section">
                        <h3 className="detail-section-title">Customer information</h3>
                        <div className="detail-section-grid">
                            <div className="detail-field">
                                <label>Full Name</label>
                                <p>{selectedOrder.user?.name || '-'}</p>
                            </div>
                            <div className="detail-field">
                                <label>Email</label>
                                <p>{selectedOrder.user?.email || '-'}</p>
                            </div>
                            <div className="detail-field">
                                <label>Phone</label>
                                <p>{selectedOrder.user?.phone || '-'}</p>
                            </div>
                            <div className="detail-field">
                                <label>Address</label>
                                <p>{selectedOrder.user?.address || '-'}</p>
                            </div>
                        </div>
                    </section>

                    <section className="detail-section detail-section-neutral order-detail-section">
                        <h3 className="detail-section-title">Product information</h3>
                        <div className="detail-section-grid">
                            <div className="detail-field">
                                <label>Product Name</label>
                                <p>{selectedOrder.product?.name || '-'}</p>
                            </div>
                            <div className="detail-field">
                                <label>Category</label>
                                <p>{selectedOrder.product?.category?.name || '-'}</p>
                            </div>
                            <div className="detail-field">
                                <label>Unit Price</label>
                                <p className="order-price-value">₹{selectedOrder.product?.price}</p>
                            </div>
                            <div className="detail-field">
                                <label>Quantity Ordered</label>
                                <p>{selectedOrder.quantity} units</p>
                            </div>
                        </div>
                    </section>

                    <section className="detail-section detail-section-success order-detail-summary">
                        <h3 className="detail-section-title">Order summary</h3>
                        <div className="order-summary-content">
                            <div className="detail-field">
                                <label>Order Date</label>
                                <p>{selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleString('en-IN') : '-'}</p>
                            </div>
                            <div className="order-total">
                                <label>Total amount</label>
                                <p>
                                    ₹{selectedOrder.totalPrice}
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="order-modal-footer">
                        <p className="order-modal-shortcut"><kbd>Esc</kbd> closes this window</p>
                        <div className="modal-buttons">
                        {selectedOrder.status === 'PENDING' && (
                            <>
                                <button type="button" className="btn btn-success" onClick={() => { handleStatusUpdate(selectedOrder.id, 'CONFIRMED'); setShowDetailModal(false); }}>Confirm Order</button>
                                <button type="button" className="btn btn-warning" onClick={() => { handleStatusUpdate(selectedOrder.id, 'CANCELLED'); setShowDetailModal(false); }}>Cancel Order</button>
                            </>
                        )}
                        {selectedOrder.status === 'CONFIRMED' && (
                            <button type="button" className="btn btn-primary" onClick={() => { handleStatusUpdate(selectedOrder.id, 'DELIVERED'); setShowDetailModal(false); }}>Mark as Delivered</button>
                        )}
                        <button type="button" className="btn btn-secondary" onClick={handlePrintOrder}>Print</button>
                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(selectedOrder.id)}>Delete Order</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
                        </div>
                    </div>
                </Modal>
            )}

            {showNewOrderModal && (
                <Modal title="Create New Order" onClose={() => setShowNewOrderModal(false)}>
                    <form onSubmit={handleCreateOrder}>
                        <div className="form-group">
                            <label htmlFor="order-user">Customer *</label>
                            <select id="order-user" required value={newOrder.userId} onChange={(event) => setNewOrder({ ...newOrder, userId: event.target.value })} disabled={savingOrder}>
                                <option value="">Select a customer</option>
                                {users.map((user) => <option key={user.id} value={user.id}>{user.name} ({user.email})</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="order-product">Product *</label>
                            <select id="order-product" required value={newOrder.productId} onChange={(event) => setNewOrder({ ...newOrder, productId: event.target.value })} disabled={savingOrder}>
                                <option value="">Select a product</option>
                                {products.map((product) => <option key={product.id} value={product.id}>{product.name} — ₹{product.price}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="order-quantity">Quantity *</label>
                            <input id="order-quantity" type="number" min="1" max={selectedProduct?.quantity || undefined} required value={newOrder.quantity} onChange={(event) => setNewOrder({ ...newOrder, quantity: event.target.value })} disabled={savingOrder} />
                            {selectedProduct && <small style={{ display: 'block', marginTop: '0.375rem', color: 'var(--color-text-muted)' }}>{selectedProduct.quantity} available in stock</small>}
                        </div>
                        <div className="detail-section detail-section-success">
                            <div className="detail-field">
                                <label>Estimated total</label>
                                <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success-text)' }}>₹{orderTotal.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="modal-buttons">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowNewOrderModal(false)} disabled={savingOrder}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={savingOrder}>{savingOrder ? 'Creating...' : 'Create Order'}</button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default Orders;
