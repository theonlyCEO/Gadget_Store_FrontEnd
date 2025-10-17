import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Use Link for checkout
import "./Cart.css";

function Cart() {
  
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartCount, clearCart } = useCart();
  const { user } = useAuth();

  // If not logged in, redirect to signin (or handle in context)
  if (!user) {
    navigate("/signin");
    return null;
  }

  const handleQuantityChange = (productId, change) => {
    const item = cart.find(i => i._id === productId);
    if (item) updateQuantity(productId, (item.quantity || 1) + change);
  };

  const handleRemove = (productId) => {
    if (window.confirm("Remove item?")) removeFromCart(productId);
  };

  const hasItems = cart.length > 0;
  const subtotal = cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0).toFixed(2);

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart ({getCartCount()})</h1>

      {hasItems ? (
        <div className="cart-container">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">R {item.price.toFixed(2)}</p>
                  <div className="cart-item-quantity">
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item._id, -1)}>-</button>
                    <span className="quantity-value">{item.quantity || 1}</span>
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item._id, 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => handleRemove(item._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-details">
              <p>Subtotal ({getCartCount()} items): <span className="summary-value">R {subtotal}</span></p>
              <p>Shipping: <span className="summary-value">Free</span></p>
              <p>Total: <span className="summary-value">R {subtotal}</span></p>
            </div>
           <button className="checkout-btn" onClick={()=> navigate("/checkout")}>Proceed to Checkout</button> 
            <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
          </div>
        </div>
      ) : (
        <div className="cart-empty">
          <p>Your cart is empty!</p>
          <button className="shop-now-btn"><Link to="/" style={{ color: "inherit", textDecoration: "none" }}>Shop Now</Link></button>
        </div>
      )}
    </div>
  );
}

export default Cart;