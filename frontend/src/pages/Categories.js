import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editCategory, setEditCategory] = useState(null);
    const [saving, setSaving] = useState(false);
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
        setSaving(true);
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
        } finally {
            setSaving(false);
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

    if (loading) return <LoadingSpinner message="Loading categories..." />;

    return (
        <div>
            <PageHeader
                title="Categories"
                subtitle="Organize products into categories"
                action={
                    <button type="button" className="btn btn-primary" onClick={openAddModal}>Add Category</button>
                }
            />

            {categories.length === 0 ? (
                <div className="card">
                    <EmptyState
                        icon="🏷️"
                        title="No categories yet"
                        description="Create your first category to organize products."
                    />
                </div>
            ) : (
                <div className="grid">
                    {categories.map((category) => (
                        <div key={category.id} className="card card-hover category-card">
                            <div className="category-card-icon">{category.name.charAt(0).toUpperCase()}</div>
                            <h3 style={{ color: 'var(--color-text)', marginBottom: '0.5rem' }}>{category.name}</h3>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                {category.description || 'No description'}
                            </p>
                            <div className="category-card-actions">
                                <button type="button" className="btn btn-warning btn-sm" onClick={() => openEditModal(category)}>Edit</button>
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(category.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <Modal title={editCategory ? 'Edit Category' : 'Add Category'} onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Category Name *</label>
                            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Electronics" disabled={saving} />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Category description" disabled={saving} />
                        </div>
                        <div className="modal-buttons">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : editCategory ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default Categories;
