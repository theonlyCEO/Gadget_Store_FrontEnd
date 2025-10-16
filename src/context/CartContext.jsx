import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, logout } = useAuth(); // Assume logout clears user
  const [cart, setCart] = useState([]); // No localStorage – sync with server

  // Load cart from server on login/user change
  useEffect(() => {
    if (user && user.email) {
      fetch(`http://localhost:3000/cart?email=${user.email}`)
        .then(res => res.json())
        .then(data => setCart(data || []))
        .catch(err => console.error("Load cart error:", err));
    } else {
      setCart([]); // Clear if logged out
    }
  }, [user]);

  // Sync function: Add/Update item
  const syncAddToCart = async (product) => {
    if (!user || !user.email) return false;

    try {
      const response = await fetch("http://localhost:3000/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, product: { ...product, quantity: product.quantity || 1 } })
      });
      if (response.ok) {
        // Refresh local cart from server
        const items = await fetch(`http://localhost:3000/cart?email=${user.email}`).then(r => r.json());
        setCart(items);
        return true;
      }
    } catch (err) {
      console.error("Sync add error:", err);
    }
    return false;
  };

  const addToCart = (product, onAuthRequired) => {
    if (!user) {
      if (onAuthRequired) onAuthRequired("signin");
      return;
    }
    // Local optimistic update
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    // Sync to server
    syncAddToCart({ ...product, quantity: 1 }); // Or calculate delta
  };

  // Remove item
  const removeFromCart = async (productId) => {
    if (!user || !user.email) return;
    setCart((prev) => prev.filter(item => item._id !== productId));
    try {
      await fetch("http://localhost:3000/cart/item", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, productId })
      });
    } catch (err) {
      console.error("Remove sync error:", err);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user || !user.email) return;
    setCart([]);
    try {
      await fetch("http://localhost:3000/cart/clear", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email })
      });
    } catch (err) {
      console.error("Clear sync error:", err);
    }
  };

  // Quantity update (reuse add logic or dedicated)
  const updateQuantity = async (productId, newQuantity) => {
    if (!user || !user.email || newQuantity < 1) return;
    setCart(prev => prev.map(item => item._id === productId ? { ...item, quantity: newQuantity } : item));
    // Sync by removing and re-adding or direct update – here: use add endpoint with delta
    const item = cart.find(i => i._id === productId);
    if (item) syncAddToCart({ ...item, quantity: newQuantity - (item.quantity || 1) }); // Delta inc
  };

  const getCartCount = () => cart.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartCount, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);