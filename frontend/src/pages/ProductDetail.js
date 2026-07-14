import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductById, createOrder, getUsers } from '../services/api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showOrderModal, setShowOrderModal] = useState(false);
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
        try {
            await createOrder({
                user: { id: parseInt(orderForm.userId) },
                product: { id: product.id },
                quantity: parseInt(orderForm.quantity)
            });
            toast.success('Order placed successfully! 🎉');
            setShowOrderModal(false);
            navigate('/orders');
        } catch (err) {
            toast.error(err.response?.data || 'Failed to place order');
        }
    };

    if (loading) return <div className="loading">⏳ Loading...</div>;
    if (!product) return <div className="loading">Product not found</div>;

    return (
        <div>
            <button className="btn btn-secondary" style={{ marginBottom: '20px' }} onClick={() => navigate('/products')}>
                ← Back to Products
            </button>

            <div className="card">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div style={{ textAlign: 'center', padding: '40px', background: '#f8f9fa', borderRadius: '10px' }}>
                        <div style={{ fontSize: '80px' }}>📦</div>
                        {product.category && (
                            <span className="badge badge-info" style={{ marginTop: '12px', display: 'inline-block' }}>
                                {product.category.name}
                            </span>
                        )}
                    </div>
                    <div>
                        <h1 style={{ color: '#1F4E79', marginBottom: '12px' }}>{product.name}</h1>
                        <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.6' }}>{product.description}</p>
                        <div style={{ fontSize: '36px', fontWeight: '700', color: '#28a745', marginBottom: '16px' }}>
                            ₹{product.price}
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <span className={`badge ${product.quantity > 5 ? 'badge-success' : product.quantity > 0 ? 'badge-warning' : 'badge-danger'}`}
                                style={{ fontSize: '14px', padding: '6px 14px' }}>
                                {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of Stock'}
                            </span>
                        </div>
                        <button
                            className="btn btn-primary"
                            disabled={product.quantity === 0}
                            onClick={() => setShowOrderModal(true)}
                            style={{ fontSize: '16px', padding: '12px 30px' }}
                        >
                            🛒 Place Order
                        </button>
                    </div>
                </div>
            </div>

            {showOrderModal && (
                <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>🛒 Place Order</h2>
                        <p style={{ color: '#666', marginBottom: '20px' }}>
                            Ordering: <strong>{product.name}</strong> @ ₹{product.price}
                        </p>
                        <form onSubmit={handleOrder}>
                            <div className="form-group">
                                <label>Select Customer *</label>
                                <select required value={orderForm.userId} onChange={e => setOrderForm({...orderForm, userId: e.target.value})}>
                                    <option value="">-- Select Customer --</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Quantity *</label>
                                <input type="number" min="1" max={product.quantity} required
                                    value={orderForm.quantity}
                                    onChange={e => setOrderForm({...orderForm, quantity: e.target.value})} />
                            </div>
                            <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                                <strong>Total: ₹{(product.price * orderForm.quantity).toFixed(2)}</strong>
                            </div>
                            <div className="modal-buttons">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowOrderModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-success">✅ Confirm Order</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;