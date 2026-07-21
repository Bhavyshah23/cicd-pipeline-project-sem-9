import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitted(true);
        if (!form.username.trim() || !form.password) return;
        setLoading(true);
        try {
            const res = await login(form);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('adminUser', res.data.username);
            toast.success(`Welcome back, ${res.data.username}!`);
            navigate('/home');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <aside className="login-aside">
                <div className="login-aside-content">
                    <div className="login-logo-mark">C</div>
                    <span className="eyebrow">CLOUDCART ADMIN</span>
                    <h1>Commerce, under control.</h1>
                    <p>A focused workspace for your catalogue, customers, and orders.</p>
                    <div className="login-aside-stat"><strong>One place</strong><span>to run your store with confidence.</span></div>
                </div>
            </aside>
            <div className="login-panel">
                <div className="login-card">
                    <div className="login-logo">
                        <span className="eyebrow">WELCOME BACK</span>
                        <h2>Sign in to CloudCart</h2>
                        <p>Use your administrator account to continue.</p>
                    </div>
                    <form onSubmit={handleSubmit} noValidate>
                        <div className={`form-group ${submitted && !form.username.trim() ? 'has-error' : ''}`}>
                            <label htmlFor="username">Username</label>
                            <input id="username" type="text" placeholder="Enter username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} disabled={loading} aria-invalid={submitted && !form.username.trim()} />
                            {submitted && !form.username.trim() && <span className="field-error">Enter your username to continue.</span>}
                        </div>
                        <div className={`form-group ${submitted && !form.password ? 'has-error' : ''}`}>
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" placeholder="Enter password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} disabled={loading} aria-invalid={submitted && !form.password} />
                            {submitted && !form.password && <span className="field-error">Enter your password to continue.</span>}
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg login-submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
                    </form>
                    <div className="login-hint"><strong>Demo credentials</strong><br />Username: <code>admin</code> <span>·</span> Password: <code>admin123</code></div>
                </div>
            </div>
        </div>
    );
};

export default Login;
