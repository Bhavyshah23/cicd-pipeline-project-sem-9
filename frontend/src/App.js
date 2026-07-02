import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Users from './pages/Users';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;
    return children;
};

// Layout with Navbar and Footer
const AdminLayout = ({ children }) => (
    <div className="app">
        <Navbar />
        <main className="main-content">{children}</main>
        <Footer />
    </div>
);

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />

                {/* Protected Admin Routes */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <AdminLayout><Home /></AdminLayout>
                    </ProtectedRoute>
                } />
                <Route path="/products" element={
                    <ProtectedRoute>
                        <AdminLayout><Products /></AdminLayout>
                    </ProtectedRoute>
                } />
                <Route path="/products/:id" element={
                    <ProtectedRoute>
                        <AdminLayout><ProductDetail /></AdminLayout>
                    </ProtectedRoute>
                } />
                <Route path="/categories" element={
                    <ProtectedRoute>
                        <AdminLayout><Categories /></AdminLayout>
                    </ProtectedRoute>
                } />
                <Route path="/orders" element={
                    <ProtectedRoute>
                        <AdminLayout><Orders /></AdminLayout>
                    </ProtectedRoute>
                } />
                <Route path="/users" element={
                    <ProtectedRoute>
                        <AdminLayout><Users /></AdminLayout>
                    </ProtectedRoute>
                } />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
        </Router>
    );
}

export default App;