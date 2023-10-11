//App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import "../views/App.scss";
import Home from "./Home/Home";
import Nav from "./Nav/Nav";
import Footer from "./Footer/Footer";
import Detail from "./Detail/Detail";
import Login from "./Login/Login.js";
import AdminPage from "./QuanLyAdmin/QuanLyAdmin";
import Admin from "./QuanLyAdmin/Admin";
import Search from "./Search/Search";
import Sale from "./Menu/Sale";
import QLdonhang from "./QuanLyAdmin/QLdonhang";
import ShowRoom from "./Menu/ShowRoom";
import Tintuc from "./Menu/Tintuc";
import Support from "./Menu/Support";
import OrderHistory from "./OrderHistory/HistoryOrder";
import Cart from "./Cart/Cart";
import { CartProvider } from "./Cart/CartContext";
import CheckSP from "./Menu/CheckSP";
import Profile from "./Profile/Profile";
import MobileNav from "./Nav/MobileNav";
import AllProduct from "./ProductPages/AllProduct/AllProduct";
import AllProductPhone from "./ProductPages/AllProduct/AllProductPhone";
import axios from "axios";
import Buy from "./Buy/Buy";
import Noidung from "./Menu/Noidung";
import CreateOrder from "./VnPay/CreateOrder";
const App = () => {
  const [user, setUser] = useState(null);
  const idUser = localStorage.getItem("idUser");
  const getUser = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });
      localStorage.setItem("idUser", data.user.id);
      setUser(data.user);
    } catch (e) {
      console.log(e);
      localStorage.removeItem("idUser");
    }
  };

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
              <Route path="/" element={<Home />} />
              <Route path="/detail/:id" element={<Detail />} />
              <Route path="/login" element={user ? <Navigate to='/' /> : <Login />} />
              {/* <Route path="/adminPage" element={<AdminPage />} />
             <Route path="/admin" element={<Admin />} /> */}

              <Route path="/admin/*" element={<> <Admin /> <Outlet /> </>} />
              <Route path="/search" element={<Search />} />
              <Route path="/showroom" element={<ShowRoom />} />
              <Route path="/tin-tuc" element={<Tintuc />} />
              <Route path="/noi-dung" element={<Noidung />} />
              <Route path="/support" element={<Support />} />
              <Route path="/checkSP" element={<CheckSP />} />
              <Route path="/sale" element={<Sale />} />
              <Route path="/orderhistory/:phone" element={<OrderHistory />} />
              <Route path='/quanly/orders' element={<QLdonhang />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/buy" element={<Buy user={user} />} />
              <Route path="/profile" element={idUser ? <Profile user={user}/> : <Navigate to='/' />} />
              <Route path="/tat-ca-san-pham-laptop" element={<AllProduct />} />
              <Route path="/tat-ca-san-pham-phone" element={<AllProductPhone />} />
              <Route path="/createorder" element={<CreateOrder />} />
            </Routes>
          </header>
          <MobileNav user={user} />
          <Footer />
        </CartProvider>
      </BrowserRouter>
    </div>

  );
};

export default App;
