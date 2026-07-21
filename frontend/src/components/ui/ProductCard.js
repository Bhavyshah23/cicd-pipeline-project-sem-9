import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <Link to={`/products/${product.id}`} className="product-card">
    <article className="card card-hover">
      <div className="product-card-image" aria-label={`${product.name} product placeholder`}>
        <span>{product.name?.slice(0, 1).toUpperCase() || 'P'}</span>
        {product.category && <small>{product.category.name}</small>}
      </div>
      <div className="product-card-body">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-desc">{product.description || 'No description available.'}</p>
        <div className="product-card-footer">
          <span className="product-card-price">₹{product.price}</span>
          <span className={`badge ${product.quantity > 5 ? 'badge-success' : product.quantity > 0 ? 'badge-warning' : 'badge-danger'}`}>{product.quantity} in stock</span>
        </div>
      </div>
    </article>
  </Link>
);

export default ProductCard;
