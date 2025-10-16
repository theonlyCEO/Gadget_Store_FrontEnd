import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile"; // NEW
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders"
import ProductDetail from "./pages/ProductDetails";


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main style={{ minHeight: "80vh", padding: "20px" }}>
              <Routes>
                <Route path="/" element={<Home />} />
                
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart/>} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/signup" element={<Signup/>} />
                <Route path="/signin" element={<Signin/>} />
                <Route path="/profile" element={<Profile />} /> {/* NEW */}
                <Route path="/orders" element={<Orders />} />
                <Route path="/products/:id" element={<ProductDetail />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;