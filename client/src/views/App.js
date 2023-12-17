//App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

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
import CheckSP from "./Menu/CheckSP";
import Profile from "./Profile/Profile";
import MobileNav from "./Nav/MobileNav";
import AllProduct from "./ProductPages/AllProduct/AllProduct";
import AllNewProductLaptop from "./ProductPages/AllProduct/AllNewProductLaptop";
import AllProductPhone from "./ProductPages/AllProduct/AllProductPhone";
import AllNewProductPhone from "./ProductPages/AllProduct/AllNewProductPhone";
import Buy from "./Buy/Buy";
import Noidung from "./Menu/Noidung";
import Chatbot from "./ChatBot/Chatbot";
import CreateOrder from "./VnPay/CreateOrder";
import BuySuccess from "./Buy/BuySuccess";
import { update } from "../redux/userSlice";
import { addNotification } from "../redux/notificationsSlice";
import { addProductToCart, updateProductCart } from "../redux/cartSlice.jsx";
import TabsQLdonhang from "./QuanLyAdmin/Pages/TabsQLdonhang";
import TabsQLdagiao from "./QuanLyAdmin/Pages/TabsQLdagiao.js";
import TabsQLgiaohuy from "./QuanLyAdmin/Pages/TabsQLgiaohuy.js";
import TabsDonDatHang from "./QuanLyAdmin/Pages/Tabsdondathang.js";
import TabsVanChuyen from "./QuanLyAdmin/Pages/Tabsvanchuyen.js";
import TabsXacNhanGiaoHuy from "./QuanLyAdmin/Pages/Tabsxacnhangiaohuy.js";
import BillSuccess from "./Buy/BillSuccess.js";
import QLOrder from "./Profile/OrderInformations/QLOrder.jsx";
import HuongDanMuaHang from "./Footer/MenuFooter/HuongDanMuaHang.js";
import ChinhSachThanhToan from "./Footer/MenuFooter/ChinhSachThanhToan.js";
import GiaiQuyetKhieuNai from "./Footer/MenuFooter/GiaiQuyetKhieuNai.js";
import ChinhSachBaoHanh from "./Footer/MenuFooter/ChinhSachBaoHanh.js";
import ChinhSachDoiTra from "./Footer/MenuFooter/ChinhSachDoiTra.js";
import ScrollToTop from "../util/scrollToTop.js";
import NotFound from "./404/NotFound.js";
import { getUser } from '../util/servicesGlobal'
import NotificationsLayout from "./Profile/NotificationsManager/NotificationsLayout.jsx";

const App = () => {
  const user = useSelector((state) => state.user);
  const isLogin = localStorage.getItem("isLogin");
  const dispatch = useDispatch();

  useEffect(() => {
    // lưu giỏ hàng vào redux
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart && cart.length !== 0) {
      dispatch(addProductToCart(cart));
    }
    getUser(dispatch);
  }, []);

useEffect(() => {
  if (user) {
    getNotifications(user.id)
  }
}, [user])

  const getNotifications = async (id) => {
    try {
      const api = `${process.env.REACT_APP_API_URL}/auth/get-notifications/${id}`;
      const results = await axios.get(api, { withCredentials: true });
      if (results.status === 200) {
        const notifications = results.data;
        dispatch(addNotification(notifications));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Nav />
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
              isLogin === "admin" || isLogin === "superadmin" ? (
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
          <Route path="/deliveryfailedOrder" element={<QLdeliveryfailed />} />
          <Route path="/alldelivered" element={<QLAlldelivered />} />
          <Route path="/allorders" element={<QLAlldonhang />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/buy" element={<Buy user={user} />} />
          <Route path="/success" element={<BuySuccess />} />
          <Route path="/thanks" element={<BillSuccess />} />
          <Route path="/qlbillorder/:id" element={<QLOrder />} />
          <Route
            path="/profile/*"
            element={isLogin ? <Profile /> : <Navigate to="/" />}
          />
          <Route
            path="/tat-ca-san-pham-laptop"
            element={<AllNewProductLaptop />}
          />
          <Route
            path="/tat-ca-san-pham-laptop-moi"
            element={<AllNewProductLaptop />}
          />
          <Route
            path="/tat-ca-san-pham-phone"
            element={<AllNewProductPhone />}
          />
          <Route
            path="/tat-ca-san-pham-phone-moi"
            element={<AllNewProductPhone />}
          />
          <Route path="/danhmuc-dienthoai" element={<AllProductPhone />} />
          <Route path="/danhmuc-laptop" element={<AllProduct />} />
          <Route path="/createorder" element={<CreateOrder />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/huong-dan-mua-hang" element={<HuongDanMuaHang />} />
          <Route
            path="/chinh-sach-thanh-toan"
            element={<ChinhSachThanhToan />}
          />
          <Route path="/tra-cuu-don-hang" element={<CheckSP />} />
          <Route path="/giai-quyet-khieu-nai" element={<GiaiQuyetKhieuNai />} />
          <Route path="/chinh-sach-bao-hanh" element={<ChinhSachBaoHanh />} />
          <Route path="/chinh-sach-doi-tra" element={<ChinhSachDoiTra />} />

          <Route path="/thongbao" element={<NotificationsLayout/>}/>
          {/* Route cho trang 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <MobileNav user={user} />
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
