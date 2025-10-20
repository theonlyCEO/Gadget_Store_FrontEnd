import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaUser, FaBars, FaTimes } from "react-icons/fa";  // Added FaBars and FaTimes
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);  // New state for mobile menu
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const mobileMenuRef = useRef(null);  // For outside click if needed

  // Extract display name for avatar
  const displayName = user?.userName || (user?.email ? user.email.charAt(0).toUpperCase() : "U");
  const fullName = user?.userName || user?.email || "User";

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.hamburger')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search input (unchanged)
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearchOpen(!!query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/products?search=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    }
  };

  // Handle logout (unchanged)
  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    localStorage.clear();
    navigate("/");
  };

  // Navigate to product page (unchanged)
  const handleProductClick = (productId) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);  // Close mobile menu if open
    navigate(`/products/${productId}`);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu on link click
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/" className="logo-text">
          GadgetStore
        </Link>
      </div>

      {/* Hamburger Button - visible only on mobile */}
      <button className="hamburger" onClick={toggleMobileMenu} aria-label="Toggle menu">
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Nav Links - hidden on mobile, toggleable */}
      <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`} ref={mobileMenuRef}>
        <li><Link to="/" onClick={handleMobileLinkClick}>Home</Link></li>
        <li><Link to="/products" onClick={handleMobileLinkClick}>Categories</Link></li>
        <li><Link to="/about" onClick={handleMobileLinkClick}>About</Link></li>
        <li><Link to="/contact" onClick={handleMobileLinkClick}>Contact</Link></li>
      </ul>

      <div className="nav-actions">
        <div className="search-bar" ref={searchRef}>
          <input
            type="text"
            placeholder="Search gadgets..."
            value={searchQuery}
            onChange={handleSearch}
            aria-label="Search products"
          />
          <button aria-label="Search">
            <FaSearch />
          </button>
          {isSearchOpen && (
            <div className="search-results">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <div
                    key={product._id}
                    className="search-result-item"
                    onClick={() => handleProductClick(product._id)}
                  >
                    <img src={product.imageUrl} alt={product.name} className="search-result-img" />
                    <div className="search-result-details">
                      <span className="search-result-name">{product.name}</span>
                      <span className="search-result-price">R {parseFloat(product.price).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="search-result-empty">No products found</div>
              )}
            </div>
          )}
        </div>

        <div className="user-dropdown" ref={dropdownRef}>
          <button
            className="icon-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label={user ? `User menu for ${fullName}` : "User menu"}
          >
            {user ? (
              <div className="user-avatar">{displayName.charAt(0)}</div>
            ) : (
              <FaUser />
            )}
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {!user ? (
                <>
                  <Link to="/signin" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/signup" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="dropdown-header">Hi, {fullName}!</div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    View Profile
                  </Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                    My Orders
                  </Link>
                  <div className="dropdown-item" onClick={handleLogout}>
                    Sign Out
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <Link to="/cart" className="icon-btn cart" onClick={handleMobileLinkClick}>
          <FaShoppingCart />
          <span className="cart-count">{getCartCount()}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;