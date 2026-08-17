import React, { useState } from "react";
import "./App.css";
import products from "./products";

function App() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const product = products.find(
      (item) => item.name.toLowerCase() === value.toLowerCase()
    );

    if (product) {
      setSelectedProduct({ ...product, quantity: 1 });
    } else {
      setSelectedProduct(null);
    }
  };

  // Add product to cart
  const handleAddProduct = () => {
    if (selectedProduct) {
      const existingIndex = cart.findIndex(
        (item) => item.name === selectedProduct.name
      );

      if (existingIndex !== -1) {
        // If already in cart, increase quantity
        const newCart = [...cart];
        newCart[existingIndex].quantity += selectedProduct.quantity;
        setCart(newCart);
      } else {
        setCart([...cart, selectedProduct]);
      }

      setSearch("");
      setSelectedProduct(null);
    }
  };

  // Update quantity in cart
  const handleQuantityChange = (index, qty) => {
    const newCart = [...cart];
    newCart[index].quantity = qty > 0 ? qty : 1; // avoid zero/negative qty
    setCart(newCart);
  };

  // Remove product from cart
  const handleRemove = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  // Clear entire cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Calculate totals
  const totalBeforeGST = cart.reduce(
    (sum, item) => sum + item.amount * item.quantity,
    0
  );
  const totalGST = cart.reduce(
    (sum, item) => sum + ((item.amount * item.gst) / 100) * item.quantity,
    0
  );
  const grandTotal = totalBeforeGST + totalGST;

  // Print Invoice
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pos-container">
      <div className="pos-header">
        <h1>POS System with GST</h1>
      </div>

      <div className="search-section">
        <label>Search Product:</label>
        <div className="search-input-group">
          <input
            className="search-input"
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Enter product name"
          />
          <button
            className="btn btn-primary"
            onClick={handleAddProduct}
            disabled={!selectedProduct}
          >
            Add Product
          </button>
        </div>
        {selectedProduct && (
          <div className="product-preview">
            <p>
              <strong>{selectedProduct.name}</strong> - ₹{selectedProduct.amount} (GST: {selectedProduct.gst}%)
            </p>
          </div>
        )}
      </div>

      <div className="cart-section">
        {cart.length === 0 ? (
          <p className="cart-empty">No items in cart</p>
        ) : (
          <>
            {cart.map((item, index) => {
              const gstAmount = ((item.amount * item.gst) / 100) * item.quantity;
              const finalPrice = item.amount * item.quantity + gstAmount;
              return (
                <div key={index} className="cart-item">
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-details">
                      <span>Price: ₹{item.amount}</span>
                      <span>GST: {item.gst}%</span>
                    </div>
                  </div>
                  <div className="cart-item-quantity">
                    <label>Qty:</label>
                    <input
                      className="quantity-input"
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="cart-item-prices">
                    <span>GST Amt: ₹{gstAmount.toFixed(2)}</span>
                    <span>Total: ₹{finalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}

            <div className="totals-section">
              <p>Total Before GST: ₹{totalBeforeGST.toFixed(2)}</p>
              <p>Total GST: ₹{totalGST.toFixed(2)}</p>
              <p className="total-grand">Grand Total: ₹{grandTotal.toFixed(2)}</p>
            </div>

            <div className="actions-section">
              <button className="btn btn-secondary" onClick={handleClearCart}>
                Clear Cart
              </button>
              <button className="btn btn-primary" onClick={handlePrint}>
                Print Invoice
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
