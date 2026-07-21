import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    getProducts, createProduct, updateProduct,
    deleteProduct, getCategories, searchProducts
} from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: '', description: '', price: '', quantity: '', categoryId: ''
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [p, c] = await Promise.all([getProducts(), getCategories()]);
            setProducts(p.data);
            setCategories(c.data);
        } catch (err) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) { fetchData(); return; }
        try {
            const res = await searchProducts(searchTerm);
            setProducts(res.data);
        } catch { toast.error('Search failed'); }
    };

    const openAddModal = () => {
        setEditProduct(null);
        setForm({ name: '', description: '', price: '', quantity: '', categoryId: '' });
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditProduct(product);
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            categoryId: product.category?.id || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                quantity: parseInt(form.quantity),
                category: form.categoryId ? { id: parseInt(form.categoryId) } : null
            };
            if (editProduct) {
                await updateProduct(editProduct.id, payload);
                toast.success('Product updated!');
            } else {
                await createProduct(payload);
                toast.success('Product created!');
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            toast.error('Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await deleteProduct(id);
            toast.success('Product deleted!');
            fetchData();
        } catch { toast.error('Failed to delete'); }
    };

    if (loading) return <LoadingSpinner message="Loading products..." />;

    return (
        <div>
            <PageHeader
                title="Products"
                subtitle="Manage your product catalog"
                action={
                    <button type="button" className="btn btn-primary" onClick={openAddModal}>
                        Add Product
                    </button>
                }
            />

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button type="button" className="btn btn-primary" onClick={handleSearch}>Search</button>
                <button type="button" className="btn btn-secondary" onClick={() => { setSearchTerm(''); fetchData(); }}>Clear</button>
            </div>

            <div className="card">
                {products.length === 0 ? (
                    <EmptyState
                        icon="📦"
                        title="No products found"
                        description={searchTerm ? 'Try a different search term.' : 'Add your first product to get started.'}
                    />
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td><strong>{product.name}</strong></td>
                                        <td>{product.description?.substring(0, 40)}...</td>
                                        <td><strong style={{ color: 'var(--color-success)' }}>₹{product.price}</strong></td>
                                        <td>
                                            <span className={`badge ${product.quantity > 5 ? 'badge-success' : product.quantity > 0 ? 'badge-warning' : 'badge-danger'}`}>
                                                {product.quantity}
                                            </span>
                                        </td>
                                        <td>
                                            {product.category
                                                ? <span className="badge badge-info">{product.category.name}</span>
                                                : '-'}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.375rem' }}>
                                                <Link to={`/products/${product.id}`} className="btn btn-secondary btn-sm">View</Link>
                                                <button type="button" className="btn btn-warning btn-sm" onClick={() => openEditModal(product)}>Edit</button>
                                                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <Modal
                    title={editProduct ? 'Edit Product' : 'Add Product'}
                    onClose={() => setShowModal(false)}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Product Name *</label>
                            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter product name" disabled={saving} />
                        </div>
                        <div className="form-group">
                            <label>Description *</label>
                            <input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Enter description" disabled={saving} />
                        </div>
                        <div className="form-group">
                            <label>Price (₹) *</label>
                            <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Enter price" disabled={saving} />
                        </div>
                        <div className="form-group">
                            <label>Quantity *</label>
                            <input required type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Enter quantity" disabled={saving} />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} disabled={saving}>
                                <option value="">-- Select Category --</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="modal-buttons">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : editProduct ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default Products;
