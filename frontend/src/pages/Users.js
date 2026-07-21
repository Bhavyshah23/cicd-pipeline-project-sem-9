import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data);
        } catch { toast.error('Failed to load users'); }
        finally { setLoading(false); }
    };

    const openAddModal = () => {
        setEditUser(null);
        setForm({ name: '', email: '', phone: '', address: '' });
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setEditUser(user);
        setForm({ name: user.name, email: user.email, phone: user.phone, address: user.address });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editUser) {
                await updateUser(editUser.id, form);
                toast.success('User updated!');
            } else {
                await createUser(form);
                toast.success('User created!');
            }
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data || 'Failed to save user');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await deleteUser(id);
            toast.success('User deleted!');
            fetchUsers();
        } catch { toast.error('Failed to delete user'); }
    };

    if (loading) return <LoadingSpinner message="Loading users..." />;

    return (
        <div>
            <PageHeader
                title="Users"
                subtitle="Manage customer accounts"
                action={
                    <button type="button" className="btn btn-primary" onClick={openAddModal}>Add User</button>
                }
            />

            <div className="card">
                {users.length === 0 ? (
                    <EmptyState
                        icon="👥"
                        title="No users found"
                        description="Add your first customer to get started."
                    />
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td><strong>{user.name}</strong></td>
                                        <td>{user.email}</td>
                                        <td>{user.phone || '-'}</td>
                                        <td>{user.address || '-'}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.375rem' }}>
                                                <button type="button" className="btn btn-warning btn-sm" onClick={() => openEditModal(user)}>Edit</button>
                                                <button type="button" className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>
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
                <Modal title={editUser ? 'Edit User' : 'Add User'} onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" disabled={saving} />
                        </div>
                        <div className="form-group">
                            <label>Email *</label>
                            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter email" disabled={saving} />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Enter phone number" disabled={saving} />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Enter address" disabled={saving} />
                        </div>
                        <div className="modal-buttons">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? 'Saving...' : editUser ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default Users;
