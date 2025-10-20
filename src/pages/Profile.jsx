import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const { user, logout } = useAuth();
  const { cart, getCartCount } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  // Fetch order history from backend
  useEffect(() => {
    if (user?.email) {
      fetch(`${apiUrl}/orders?email=${user.email}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch orders");
          return res.json();
        })
        .then((data) => {
          setOrders(data || []);
          setLoadingOrders(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoadingOrders(false);
        });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    localStorage.clear(); // Debug
    navigate("/");
  };

  const handleClearStorage = () => {
    localStorage.clear();
    logout();
    navigate("/");
  };

  // Format date (assume ISO from MongoDB)
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const subtotal = cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0).toFixed(2);

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-title">My Profile</h1>

        {/* User Info Card */}
        <section className="info-card" aria-labelledby="info-title">
          <h2 id="info-title">User Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Username:</span>
              <span className="value">{user?.userName || "N/A"}</span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{user?.email || "N/A"}</span>
            </div>
            <div className="info-item">
              <span className="label">User ID:</span>
              <span className="value">{user?.userId || "N/A"}</span>
            </div>
            <div className="info-item">
              <span className="label">Member Since:</span>
              <span className="value">{user?.createdAt ? formatDate(user.createdAt) : "N/A"}</span>
            </div>
          </div>
          <div className="action-buttons">
            <button className="logout-btn" onClick={handleLogout} aria-label="Logout">Logout</button>
            <button className="clear-btn" onClick={handleClearStorage} aria-label="Clear browser data">Clear Browser Data (Debug)</button>
          </div>
        </section>

        {/* Current Cart Section */}
        <section className="cart-card" aria-labelledby="cart-title">
          <h2 id="cart-title">Current Cart ({getCartCount()} items)</h2>
          {cart.length > 0 ? (
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-history-item">
                  <img src={item.imageUrl} alt={item.name} className="item-img" />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity || 1} | Price: R {item.price.toFixed(2)}</p>
                  </div>
                  <span className="item-total">R {(item.price * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              ))}
              <div className="cart-total">
                <strong>Subtotal: R {subtotal}</strong>
              </div>
            </div>
          ) : (
            <p className="empty-message">Your cart is empty. <a href="/products">Shop now!</a></p>
          )}
        </section>

        {/* Order History Section */}
        <section className="orders-card" aria-labelledby="orders-title">
          <h2 id="orders-title">Order History</h2>
          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : error ? (
            <p className="error-message" role="alert">{error}</p>
          ) : orders.length > 0 ? (
            <div className="table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id.slice(-6)}</td> {/* Short ID */}
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{order.items.length} item(s)</td>
                      <td>R {order.total}</td>
                      <td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                      <td><button className="view-btn" aria-label={`View details for order ${order._id}`}>View Details</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-message">No past orders. <a href="/products">Start shopping!</a></p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;