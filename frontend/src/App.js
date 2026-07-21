import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Users from './pages/Users';
import './App.css';

const ProtectedRoute = () => {
    // Read synchronously so protected content is never painted before redirecting.
    const [authenticated] = useState(() => Boolean(localStorage.getItem('token')));
    return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const RouteContent = () => {
    const location = useLocation();
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        setTransitioning(true);
        const timer = window.setTimeout(() => setTransitioning(false), 120);
        return () => window.clearTimeout(timer);
    }, [location.pathname]);

    return (
        <div className="route-content" aria-busy={transitioning}>
            {transitioning ? <LoadingSpinner compact message="Loading workspace..." /> : <Outlet />}
        </div>
    );
};

const AdminLayout = () => (
    <div className="app-shell">
        <Navbar />
        <main className="main-content">
            <RouteContent />
        </main>
        <Footer />
    </div>
);

const NotFound = () => (
    <section className="not-found">
        <span className="eyebrow">Error 404</span>
        <h1>This page is off the shelf.</h1>
        <p>The address may be incorrect or the page may no longer exist.</p>
        <a className="btn btn-primary" href="/">Back to dashboard</a>
    </section>
);

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/users" element={<Users />} />
                    </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </Router>
    );
}

export default App;
