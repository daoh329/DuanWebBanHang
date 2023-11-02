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
import QLshipping from "./QuanLyAdmin/QLshipping";
import QLdelivered from "./QuanLyAdmin/QLdelivered";
import QLdeliveryfailed from "./QuanLyAdmin/QLdeliveryfailed";
import QLAlldelivered from "./QuanLyAdmin/QLAlldelivered";
import QLAlldonhang from "./QuanLyAdmin/QLAlldonhang";
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
import AllNewProductLaptop from "./ProductPages/AllProduct/AllNewProductLaptop";
import AllProductPhone from "./ProductPages/AllProduct/AllProductPhone";
import AllNewProductPhone from "./ProductPages/AllProduct/AllNewProductPhone";
import AllProductPhonecopy from "./ProductPages/AllProduct/AllProductPhonecopy";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import Buy from "./Buy/Buy";
import Noidung from "./Menu/Noidung";
import Chatbot from "./ChatBot/Chatbot";
import CreateOrder from "./VnPay/CreateOrder";
import BuySuccess from "./Buy/BuySuccess";
import { update } from "../redux/userSlice";
import { addNotification } from "../redux/notificationsSlice";
import TabsQLdonhang from "./QuanLyAdmin/Pages/TabsQLdonhang";
import TabsQLdagiao from "./QuanLyAdmin/Pages/TabsQLdagiao.js";
import TabsQLgiaohuy from "./QuanLyAdmin/Pages/TabsQLgiaohuy.js";
import TabsDonDatHang from "./QuanLyAdmin/Pages/Tabsdondathang.js";
import TabsVanChuyen from "./QuanLyAdmin/Pages/Tabsvanchuyen.js";
import TabsXacNhanGiaoHuy from "./QuanLyAdmin/Pages/Tabsxacnhangiaohuy.js";

const App = () => {
  const user = useSelector((state) => state.user);
  const isLogin = localStorage.getItem("isLogin");
  const dispatch = useDispatch();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
      const result = await axios.get(url, { withCredentials: true });
      let data = result.data;
      const u = {
        id: data.user.id,
        name: data.user.name,
        phone: data.user.phone,
        email: data.user.email,
        picture: data.user.picture,
        permission: data.user.permission,
      };
      if (result.status === 200) {
        if (!isLogin) {
          localStorage.setItem("isLogin", u.permission.toLowerCase());
        }
        dispatch(update(u));
        getNotifications(u.id);
      } else {
        localStorage.removeItem("isLogin");
      }
    } catch (e) {
      localStorage.removeItem("isLogin");
      console.log(e);
    }
  };

  const getNotifications = async (id) => {
    try {
      const api = `${process.env.REACT_APP_API_URL}/auth/get-notifications/${id}`;
      const results = await axios.get(api);
      if (results.status === 200) {
        const notifications = results.data;
        Array.isArray(notifications) &&
          notifications.forEach((notification) => {
            dispatch(addNotification(notification));
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <CartProvider>
          <Nav />
          <header>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detail/:id" element={<Detail />} />
              <Route
                path="/login"
                element={isLogin ? <Navigate to="/" /> : <Login />}
              />
              {/* <Route path="/adminPage" element={<AdminPage />} />
             <Route path="/admin" element={<Admin />} /> */}

              <Route
                path="/admin/*"
                element={
                  isLogin === "admin" ? (
                    <>
                      <Admin /> <Outlet />
                    </>
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route path="/search" element={<Search />} />
              <Route path="/showroom" element={<ShowRoom />} />
              <Route path="/tin-tuc" element={<Tintuc />} />
              <Route path="/noi-dung" element={<Noidung />} />
              <Route path="/support" element={<Support />} />
              <Route path="/checkSP" element={<CheckSP />} />
              <Route path="/sale" element={<Sale />} />
              <Route path="/orderhistory/:phone" element={<OrderHistory />} />
              <Route path="/orders" element={<QLdonhang />} />
              <Route path="/shippingOrder" element={<QLshipping />} />
              <Route path="/deliveredOrder" element={<QLdelivered />} />

              <Route path="/dondathang" element={<TabsDonDatHang />} />
              <Route path="/vanchuyen" element={<TabsVanChuyen />} />
              <Route path="/xacnhangiaohang" element={<TabsXacNhanGiaoHuy />} />
              <Route path="/quanlydonhang" element={<TabsQLdonhang />} />
              <Route path="/quanlydagiao" element={<TabsQLdagiao />} />
              <Route path="/quanlygiaohuy" element={<TabsQLgiaohuy />} />

              <Route
                path="/deliveryfailedOrder"
                element={<QLdeliveryfailed />}
              />
              <Route path="/alldelivered" element={<QLAlldelivered />} />
              <Route path="/allorders" element={<QLAlldonhang />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/buy" element={<Buy user={user} />} />
              <Route path="/success" element={<BuySuccess />} />
              <Route
                path="/profile"
                element={isLogin ? <Profile /> : <Navigate to="/" />}
              />
              <Route path="/tat-ca-san-pham-laptop" element={<AllProduct />} />
              <Route
                path="/tat-ca-san-pham-laptop-moi"
                element={<AllNewProductLaptop />}
              />
              <Route
                path="/tat-ca-san-pham-phone"
                element={<AllProductPhone />}
              />
              <Route
                path="/tat-ca-san-pham-phone-moi"
                element={<AllNewProductPhone />}
              />

              <Route path="/danhmuc-dienthoai" element={<AllProductPhone />} />
              <Route path="/danhmuc-laptop" element={<AllProduct />} />

              <Route path="/createorder" element={<CreateOrder />} />

              <Route path="/chat" element={<Chatbot />} />
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
