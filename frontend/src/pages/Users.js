import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
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

    if (loading) return <div className="loading">⏳ Loading Users...</div>;

    return (
        <div>
            <div className="page-header">
                <h1>👥 Users</h1>
                <button className="btn btn-primary" onClick={openAddModal}>➕ Add User</button>
            </div>

            <div className="card">
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
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td><strong>{user.name}</strong></td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || '-'}</td>
                                    <td>{user.address || '-'}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button className="btn btn-warning" style={{ padding: '6px 10px', fontSize: '12px' }}
                                                onClick={() => openEditModal(user)}>✏️</button>
                                            <button className="btn btn-danger" style={{ padding: '6px 10px', fontSize: '12px' }}
                                                onClick={() => handleDelete(user.id)}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{editUser ? '✏️ Edit User' : '➕ Add User'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input required value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                    placeholder="Enter full name" />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input required type="email" value={form.email}
                                    onChange={e => setForm({...form, email: e.target.value})}
                                    placeholder="Enter email" />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input value={form.phone}
                                    onChange={e => setForm({...form, phone: e.target.value})}
                                    placeholder="Enter phone number" />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input value={form.address}
                                    onChange={e => setForm({...form, address: e.target.value})}
                                    placeholder="Enter address" />
                            </div>
                            <div className="modal-buttons">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editUser ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;