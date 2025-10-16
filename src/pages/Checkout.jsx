import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const { cart, removeFromCart, clearCart, getCartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Shipping form state
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("South Africa"); // Default
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in or empty cart
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    } else if (cart.length === 0) {
      navigate("/cart");
    }
  }, [user, cart, navigate]);

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0).toFixed(2);
  const shipping = 0; // Free
  const total = (parseFloat(subtotal) + shipping).toFixed(2);

  const handleRemove = (productId) => {
 that.removeFromCart(productId);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  if (!address || !city || !postalCode || !country) {
    setError("Please fill in all shipping details");
    setLoading(false);
    return;
  }

  // Prepare order data
  const orderData = {
    email: user.email,
    items: cart, // Array of products with quantity
    total: total,
    status: "Placed", // Initial status
    shipping: { address, city, postalCode, country }
  };

  try {
    const response = await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) throw new Error("Order failed");

    // Clear cart (client-side) – backend also clears in your route
    clearCart();
    setLoading(false);
    navigate("/orders"); // Redirect to orders page
  } catch (err) {
    setError(err.message || "Order placement failed");
    setLoading(false);
  }
};

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>
      
      <div className="checkout-container">
        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary ({getCartCount()} items)</h2>
          {cart.map((item) => (
            <div key={item._id} className="summary-item">
              <img src={item.imageUrl} alt={item.name} className="summary-img" />
              <div className="summary-details">
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity || 1}</p>
                <p>Price: R {item.price.toFixed(2)}</p>
              </div>
            
            </div>
          ))}
          <div className="totals">
            <p>Subtotal: R {subtotal}</p>
            <p>Shipping: Free</p>
            <p className="total">Total: R {total}</p>
          </div>
        </div>

        {/* Shipping Form */}
        <div className="shipping-form-section">
          <h2>Shipping Address</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit} className="shipping-form">
            <input
              type="text"
              placeholder="Street Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="form-input"
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="form-input"
            />
            <input
              type="text"
              placeholder="  Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
              className="form-input"
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="form-input"
            />
            <button type="submit" className="place-order-btn" onClick={()=>navigate("/orders")} disabled={loading}>
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
          <p className="back-link">
            <Link to="/cart">Back to Cart</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;