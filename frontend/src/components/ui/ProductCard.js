import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <Link to={`/products/${product.id}`} className="product-card">
    <div className="card card-hover">
      <div className="product-card-image">Product Image</div>
      <h3 className="product-card-title">{product.name}</h3>
      <p className="product-card-desc">
        {product.description?.substring(0, 80) || 'No description available.'}
      </p>
      <div className="product-card-footer">
        <span className="product-card-price">₹{product.price}</span>
        <span className="badge badge-info">Stock: {product.quantity}</span>
      </div>
      <div className="product-card-rating">★★★★☆ 4.0</div>
      {product.category && (
        <div style={{ marginTop: '0.5rem' }}>
          <span className="badge badge-success">{product.category.name}</span>
        </div>
      )}
    </div>
  </Link>
);

export default ProductCard;
