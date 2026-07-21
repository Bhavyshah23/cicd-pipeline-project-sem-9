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
            toast.success(`Welcome back, ${res.data.username}!`);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <div className="login-logo-mark">CS</div>
                    <h1>CloudShop Admin</h1>
                    <p>Sign in to access the admin dashboard</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            required
                            placeholder="Enter username"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            placeholder="Enter password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{ width: '100%', marginTop: '0.5rem' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-hint">
                    <strong>Default Credentials</strong><br />
                    Username: <code>admin</code> | Password: <code>admin123</code>
                </div>

                <p className="login-footer">
                    M.Sc. IT — Cloud &amp; Application Development Project
                </p>
            </div>
        </div>
    );
};

export default Login;
