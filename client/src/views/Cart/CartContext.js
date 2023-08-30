import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Khi component được render, lấy giỏ hàng từ Session Storage (nếu có)
  useEffect(() => {
    const storedCartItems = JSON.parse(window.sessionStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, []);

  // Khi giỏ hàng thay đổi, lưu lại vào Session Storage
  useEffect(() => {
    window.sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
