import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthPopup from "../components/AuthPopup";
import "./Home.css";
import .meta.env.NEXT_PUBLIC_API_URL 

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart: contextAddToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products
  useEffect(() => {
    fetch(`http://localhost:3000/products/`)
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

  // Hero slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Popup handling
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

  // Get unique categories and a representative image
  const categories = Array.from(new Set(products.map((p) => p.category))).map((category) => {
    const product = products.find((p) => p.category === category);
    return {
      name: category,
      imageUrl: product ? product.imageUrl : "https://via.placeholder.com/100"
    };
  });

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="home">
      <div className="hero-slideshow">
        <div className="slide" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          <div className="hero-section">
            <h1>Welcome to <span className="highlight">GadgetStore ⚡</span></h1>
            <p>Discover the latest tech innovations and gadgets.</p>
            <button className="shop-btn" onClick={() => navigate("/products")}>Explore Now</button>
          </div>
          <div className="hero-section">
            <h1>Unbox the Future <span className="highlight">Today!</span></h1>
            <p>Shop cutting-edge devices at unbeatable prices.</p>
            <button className="shop-btn" onClick={() => navigate("/products")}>Shop Deals</button>
          </div>
          <div className="hero-section">
            <h1>Tech for Everyone <span className="highlight">⚙️</span></h1>
            <p>From beginners to pros, find your perfect gadget.</p>
            <button className="shop-btn" onClick={() => navigate("/products")}>Learn More</button>
          </div>
        </div>
        <div className="dots">
          {[0, 1, 2].map((idx) => (
            <span key={idx} className={`dot ${currentSlide === idx ? "active" : ""}`} onClick={() => setCurrentSlide(idx)} />
          ))}
        </div>
      </div>

      <section className="featured">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {products.slice(12, 20).map((product) => (
            <div className="product-card" key={product._id}>
              <img src={product.imageUrl} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">R {parseFloat(product.price).toFixed(2)}</p>
              <p className="desc">{product.description || "No description available"}</p>
              <div className="button-group">
                <button className="add-btn" onClick={() => handleAddToCart(product)} disabled={!user}>
                  {user ? "Add to Cart" : "Sign In to Add"}
                </button>
                <a href="#" className="details-link" onClick={(e) => { e.preventDefault(); openPopup(product); }}>
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="category-scroll">
        <h2>Shop by Category</h2>
        <div className="category-container">
          <div className="category-track">
            {[...categories, ...categories].map((category, i) => ( // Duplicate for infinite loop
              <div
                className="category-card"
                key={`${category.name}-${i}`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <img src={category.imageUrl} alt={category.name} className="category-img" />
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="latest">
        <h2>Latest Gadgets 🔥</h2>
        <div className="latest-slideshow">
          <div className="latest-slide" style={{ transform: `translateX(-${currentSlide * 50}%)` }}>
            {products.slice(6, 12).map((product) => (
              <div className="product-card" key={product._id}>
                <img src={product.imageUrl} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="price">R {parseFloat(product.price).toFixed(2)}</p>
                <div className="button-group">
                  <button className="add-btn" onClick={() => handleAddToCart(product)} disabled={!user}>
                    {user ? "Add to Cart" : "Sign In to Add"}
                  </button>
                  <a href="#" className="details-link" onClick={(e) => { e.preventDefault(); openPopup(product); }}>
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="dots">
          {[0, 1].map((idx) => (
            <span key={idx} className={`dot ${currentSlide === idx ? "active" : ""}`} onClick={() => setCurrentSlide(idx)} />
          ))}
        </div>
      </section>

      {isPopupOpen && selectedProduct && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePopup}>×</button>
            <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="popup-img" />
            <div className="popup-details">
              <h2 className="popup-name">{selectedProduct.name}</h2>
              <p className="popup-price">R {parseFloat(selectedProduct.price).toFixed(2)}</p>
              {selectedProduct.description && <p className="popup-desc">{selectedProduct.description}</p>}
              {selectedProduct.category && <p className="popup-category"><strong>Category:</strong> {selectedProduct.category}</p>}
              {selectedProduct.rating && <p className="popup-rating">Rating: ★ {selectedProduct.rating}/5</p>}
              <button className="popup-add-btn" onClick={() => handleAddToCart(selectedProduct)} disabled={!user}>
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

export default Home;