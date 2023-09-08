//App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import '../views/App.scss';
import Home from './Home/Home';
import Nav from './Nav/Nav'
import Footer from './Footer/Footer';
import Detail from './Detail/Detail';
import Login from './Login/Login.js';
import AdminPage from './QuanLyAdmin/QuanLyAdmin';
import Admin from './QuanLyAdmin/Admin';
import Search from './Search/Search';
import Sale from './Menu/Sale';
import QLdonhang from './QuanLyAdmin/QLdonhang';
import QLsanpham from './QuanLyAdmin/QLsanpham';
import ShowRoom from './Menu/ShowRoom';
import OrderHistory from './OrderHistory/HistoryOrder';
import Cart from './Cart/Cart';
import { CartProvider } from './Cart/CartContext';
import CheckSP from './Menu/CheckSP';
import axios from 'axios';
const App = () => {

  const [user, setUser] = useState(null);

  const getUser = async () => {

    try {
      const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
      const {data} = await axios.get(url, {withCredentials:true});
      setUser(data.user._json);
      // alert(data)
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className='App'>
    <BrowserRouter>
      <CartProvider>
        <Nav user={user} />
        <header>
          <Routes>
          <Route path="" element={<Home />} />
             <Route path="/detail/:id" element={<Detail />} />
             <Route path="/login" element={<Login />} />
             <Route path="/adminPage" element={<AdminPage />} />
             <Route path="/admin" element={<Admin />} />
             <Route path="/admin/*" element={<> <Admin /> <Outlet /> </>} />
             <Route path="/search" element={<Search />} />
             <Route path="/showroom" element={<ShowRoom />} />
             <Route path="/checkSP" element={<CheckSP />} />
             <Route path="/sale" element={<Sale />} />
             <Route path="/orderhistory/:phone" element={<OrderHistory />} />
             <Route path="/cart" element={<Cart />} />
             <Route path='/order/json' element={<QLdonhang/>} />
             <Route path='/product/json' element={<QLsanpham/>}/>
          </Routes>
        </header>
        <Footer />
      </CartProvider>
    </BrowserRouter>
  </div>
  );
};

export default App;