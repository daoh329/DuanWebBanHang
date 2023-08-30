//App.js
import React from 'react';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import '../views/App.scss';
import Home from './Home/Home';
import Nav from './Nav/Nav'
import Footer from './Footer/Footer';
import Detail from './Detail/Detail';
import Login from './Login/Login.js';
import AdminPage from './QuanLyAdmin/QuanLyAdmin';
import Search from './Search/Search';
import Sale from './Menu/Sale';
import QLdonhang from './QuanLyAdmin/QLdonhang';
import ShowRoom from './Menu/ShowRoom';
import OrderHistory from './OrderHistory/HistoryOrder';
import Cart from './Cart/Cart';
import { CartProvider } from './Cart/CartContext';
import CheckSP from './Menu/CheckSP';
const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
      <CartProvider>
          <Nav />
        <header>
          <Routes>
          <Route path="" element={<Home />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/search" element={<Search/>} />
          <Route path="/showroom" element={<ShowRoom/>} />
          <Route path="/checkSP" element={<CheckSP/>} />
          <Route path="/sale" element={<Sale/>} />
          <Route path="/orderhistory/:phone" element={<OrderHistory/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path='/order/json' element={<QLdonhang/>} /> 
          </Routes>
        </header>
        <Footer />
      </CartProvider>
      
      </BrowserRouter>
    </div>
  );
};

export default App;