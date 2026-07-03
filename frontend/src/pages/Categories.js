import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [form, setForm] = useState({ name: '', description: '' });

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(res.data);
        } catch { toast.error('Failed to load categories'); }
        finally { setLoading(false); }
    };

    const openAddModal = () => {
        setEditCategory(null);
        setForm({ name: '', description: '' });
        setShowModal(true);
    };

    const openEditModal = (category) => {
        setEditCategory(category);
        setForm({ name: category.name, description: category.description });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editCategory) {
                await updateCategory(editCategory.id, form);
                toast.success('Category updated!');
            } else {
                await createCategory(form);
                toast.success('Category created!');
            }
            setShowModal(false);
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data || 'Failed to save category');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await deleteCategory(id);
            toast.success('Category deleted!');
            fetchCategories();
        } catch { toast.error('Failed to delete category'); }
    };

    if (loading) return <div className="loading">⏳ Loading Categories...</div>;

    return (
        <div>
            <div className="page-header">
                <h1>🏷️ Categories</h1>
                <button className="btn btn-primary" onClick={openAddModal}>➕ Add Category</button>
            </div>

            <div className="grid">
                {categories.map(category => (
                    <div key={category.id} className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏷️</div>
                        <h3 style={{ color: '#1F4E79', marginBottom: '8px' }}>{category.name}</h3>
                        <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>
                            {category.description}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button className="btn btn-warning" style={{ padding: '6px 12px', fontSize: '12px' }}
                                onClick={() => openEditModal(category)}>✏️ Edit</button>
                            <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }}
                                onClick={() => handleDelete(category.id)}>🗑️ Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{editCategory ? '✏️ Edit Category' : '➕ Add Category'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category Name *</label>
                                <input required value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                    placeholder="e.g. Electronics" />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input value={form.description}
                                    onChange={e => setForm({...form, description: e.target.value})}
                                    placeholder="Category description" />
                            </div>
                            <div className="modal-buttons">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editCategory ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;