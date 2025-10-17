import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Orders.css";


function Orders() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, navigate]);

  // Fetch orders
  useEffect(() => {
    if (user?.email) {
      fetch(`${apiUrl}/orders?email=${user.email}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch orders");
          return res.json();
        })
        .then((data) => {
          setOrders(data || []);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [user]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const calculateArrival = (createdAt) => {
    const arrival = new Date(createdAt);
    arrival.setDate(arrival.getDate() + 3);
    return formatDate(arrival);
  };

  // Open tracking modal
  const handleTrack = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="orders-title">My Orders</h1>
        <p className="orders-subtitle">View and track your order history</p>

        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : orders.length > 0 ? (
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
                  <td>{order._id.slice(-6)}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.items.length} item(s)</td>
                  <td>R {parseFloat(order.total).toFixed(2)}</td>
                  <td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                  <td>
                    <button className="track-btn" onClick={() => handleTrack(order)}>
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-message">No orders yet. <a href="/products">Start shopping!</a></p>
        )}
      </div>

      {/* Tracking Modal */}
      {isModalOpen && selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2>Tracking Order {selectedOrder._id.slice(-6)}</h2>
            <p className="modal-summary">
              Placed on: {formatDate(selectedOrder.createdAt)} | Total: R {parseFloat(selectedOrder.total).toFixed(2)} | Items: {selectedOrder.items.length}
            </p>
            <div className="tracking-timeline">
              <div className="step completed">
                <div className="check">✓</div>
                <span>Order Placed</span>
              </div>
              <div className="step completed">
                <div className="check">✓</div>
                <span>Processing</span>
              </div>
              <div className="step active">
                <div className="truck">truck</div>
                <span>Shipped</span>
              </div>
              <div className="step future">
                <span>Delivered</span>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <p className="arrival-note">
              Expected arrival: {calculateArrival(selectedOrder.createdAt)} (in 3 days)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;