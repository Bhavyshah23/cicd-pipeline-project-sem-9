import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await login(form);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('adminUser', res.data.username);
            toast.success(`Welcome back, ${res.data.username}! 👋`);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1F4E79, #2E75B6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ fontSize: '56px', marginBottom: '12px' }}>☁️</div>
                    <h1 style={{ color: '#1F4E79', fontSize: '26px', marginBottom: '6px' }}>
                        CloudShop Admin
                    </h1>
                    <p style={{ color: '#888', fontSize: '14px' }}>
                        Sign in to access the admin dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>👤 Username</label>
                        <input
                            type="text"
                            required
                            placeholder="Enter username"
                            value={form.username}
                            onChange={e => setForm({...form, username: e.target.value})}
                            style={{ fontSize: '15px', padding: '12px 14px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>🔒 Password</label>
                        <input
                            type="password"
                            required
                            placeholder="Enter password"
                            value={form.password}
                            onChange={e => setForm({...form, password: e.target.value})}
                            style={{ fontSize: '15px', padding: '12px 14px' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '8px' }}
                    >
                        {loading ? '⏳ Signing in...' : '🔐 Sign In'}
                    </button>
                </form>

                <div style={{
                    marginTop: '24px',
                    padding: '14px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '13px',
                    color: '#666'
                }}>
                    <strong>Default Credentials</strong><br/>
                    Username: <code>admin</code> | Password: <code>admin123</code>
                </div>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#aaa' }}>
                    M.Sc. IT — Cloud & Application Development Project
                </p>
            </div>
        </div>
    );
};

export default Login;