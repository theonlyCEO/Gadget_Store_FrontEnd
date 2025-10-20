import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import AuthPopup from "../components/AuthPopup";
import "./Products.css";

function Products() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { addToCart: contextAddToCart } = useCart();
  const { user } = useAuth();
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/products/`)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const openPopup = (product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    if (isPopupOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isPopupOpen]);

  const handleAddToCart = (product) => {
    contextAddToCart(product, () => setIsAuthPopupOpen(true));
  };

  const filteredProducts = selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="products-page">
      <header className="products-header">
        <h1 className="products-title">Our Products</h1>
        <p className="products-subtitle">Discover the latest in tech and innovation</p>
      </header>

      <div className="filter-menu">
        <label htmlFor="category-filter" className="filter-label">Filter by Category:</label>
        <select 
          id="category-filter" 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)} 
          className="category-select"
          aria-label="Filter products by category"
        >
          <option value="all">All Categories</option>
          <option value="laptopsAndComputer">Laptops & Computers</option>
          <option value="smartphones">Smartphones</option>
          <option value="gaming">Gaming</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-image-container">
              <img src={product.imageUrl} alt={product.name} className="product-img" />
              <div className="overlay">
                <button className="quick-view-btn" onClick={() => openPopup(product)} aria-label={`Quick view ${product.name}`}>Quick View</button>
              </div>
            </div>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">R{product.price.toFixed(2)}</p>
            {product.rating && <p className="product-rating">★ {product.rating}/5</p>}
            <div className="button-group">
              <button 
                className="add-btn" 
                onClick={() => handleAddToCart(product)} 
                disabled={!user}
                aria-label={user ? `Add ${product.name} to cart` : "Sign in to add to cart"}
              >
                {user ? "Add to Cart" : "Sign In to Add"}
              </button>
              <a 
                href="#" 
                className="details-link" 
                onClick={(e) => { e.preventDefault(); openPopup(product); }}
                aria-label={`View details for ${product.name}`}
              >
                View Details
              </a>
            </div>
          </div>
        ))}
      </div>

      {isPopupOpen && selectedProduct && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePopup} aria-label="Close popup">×</button>
            <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="popup-img" />
            <div className="popup-details">
              <h2 className="popup-name">{selectedProduct.name}</h2>
              <p className="popup-price">R{selectedProduct.price.toFixed(2)}</p> {/* Consistent with site */}
              {selectedProduct.description && <p className="popup-desc">{selectedProduct.description}</p>}
              {selectedProduct.category && <p className="popup-category"><strong>Category:</strong> {selectedProduct.category}</p>}
              {selectedProduct.rating && <p className="popup-rating">Rating: ★ {selectedProduct.rating}/5</p>}
              <button 
                className="popup-add-btn" 
                onClick={() => handleAddToCart(selectedProduct)} 
                disabled={!user}
                aria-label={user ? `Add ${selectedProduct.name} to cart` : "Sign in to add to cart"}
              >
                {user ? "Add to Cart" : "Sign In to Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthPopup isOpen={isAuthPopupOpen} onClose={() => setIsAuthPopupOpen(false)} initialMode="signin" />
    </div>
  );
}

export default Products;