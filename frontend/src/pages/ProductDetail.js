import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductById, createOrder, getUsers } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [orderForm, setOrderForm] = useState({ userId: '', quantity: 1 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [p, u] = await Promise.all([getProductById(id), getUsers()]);
                setProduct(p.data);
                setUsers(u.data);
            } catch { toast.error('Failed to load product'); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [id]);

    const handleOrder = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createOrder({
                user: { id: parseInt(orderForm.userId) },
                product: { id: product.id },
                quantity: parseInt(orderForm.quantity)
            });
            toast.success('Order placed successfully!');
            setShowOrderModal(false);
            navigate('/orders');
        } catch (err) {
            toast.error(err.response?.data || 'Failed to place order');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner message="Loading product..." />;

    if (!product) {
        return (
            <EmptyState
                icon="📦"
                title="Product not found"
                description="The product you are looking for does not exist."
            />
        );
    }

    return (
        <div>
            <button type="button" className="btn btn-secondary" style={{ marginBottom: '1.25rem' }} onClick={() => navigate('/products')}>
                ← Back to Products
            </button>

            <div className="card">
                <div className="product-detail-grid">
                    <div>
                        <div className="product-detail-image">Product Image</div>
                        {product.category && (
                            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                <span className="badge badge-info">{product.category.name}</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.75rem' }}>{product.name}</h1>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>{product.description}</p>
                        <div className="product-detail-price">₹{product.price}</div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <span className={`badge ${product.quantity > 5 ? 'badge-success' : product.quantity > 0 ? 'badge-warning' : 'badge-danger'}`}
                                style={{ fontSize: 'var(--font-size-sm)', padding: '0.375rem 0.875rem' }}>
                                {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of Stock'}
                            </span>
                        </div>
                        <div className="product-card-rating" style={{ marginBottom: '1.5rem' }}>★★★★☆ 4.0 rating</div>
                        <button
                            type="button"
                            className="btn btn-primary btn-lg"
                            disabled={product.quantity === 0}
                            onClick={() => setShowOrderModal(true)}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>

            {showOrderModal && (
                <Modal title="Place Order" onClose={() => setShowOrderModal(false)}>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
                        Ordering: <strong>{product.name}</strong> @ ₹{product.price}
                    </p>
                    <form onSubmit={handleOrder}>
                        <div className="form-group">
                            <label>Select Customer *</label>
                            <select required value={orderForm.userId} onChange={(e) => setOrderForm({ ...orderForm, userId: e.target.value })} disabled={submitting}>
                                <option value="">-- Select Customer --</option>
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Quantity *</label>
                            <input
                                type="number"
                                min="1"
                                max={product.quantity}
                                required
                                value={orderForm.quantity}
                                onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                                disabled={submitting}
                            />
                        </div>
                        <div style={{ background: 'var(--color-bg)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', border: '1px solid var(--color-border)' }}>
                            <strong>Total: ₹{(product.price * orderForm.quantity).toFixed(2)}</strong>
                        </div>
                        <div className="modal-buttons">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowOrderModal(false)} disabled={submitting}>Cancel</button>
                            <button type="submit" className="btn btn-success" disabled={submitting}>
                                {submitting ? 'Placing...' : 'Confirm Order'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default ProductDetail;
