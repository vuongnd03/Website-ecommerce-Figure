import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Danhmucnoibat from './compoments/Allsanpham';
import MenuTrangchu from './compoments/MenuTrangchu';
import Bodytrangchu from './compoments/Bodytrangchu';
import Chantrang from './compoments/Chantrang';
import DragonBall from './compoments/DragonBall';
import Hangmoive from './compoments/Hangmoive';
import KitmestuNoYaiba from './compoments/KitmestuNoYaiba';
import Naruto from './compoments/Naruto';
import Ngokhong from './compoments/Ngokhong';
import Onepice from './compoments/Onepice';
import Sanphamout from './compoments/sanphamout';
import Sanphamyeuthich from './compoments/Sanphamyeuthich';
import PageSanPham from "./PageSanPham";
import Danhsachsanpham from "./compoments/Danhsachsanpham";
import Gioithieu from "./Gioithieu";
import Csbaomathongtin from "./policies/Csbaomatthongtin";
import Csvanchuyenvagiaohang from "./policies/Csvanchuyenvagiaohang";
import CsThanhToan from "./policies/CsThanhToan";
import SearchResults from './compoments/SearchResults';


import Login from "./Login_Register/Login";
import Register from "./Login_Register/Register";
import ProductDetail from "./ProductDetail/Productdetail";
import LoginAdmin from "./Admin/compoments/LoginAdmin";
import UIAdmin from "./Admin/UILoginAdmin/UIAdmin";
import Addproduct from "./Admin/UILoginAdmin/Addproduct";
import Deleteproduct from "./Admin/UILoginAdmin/Deleteproduct";
import { CartProvider } from "./CartContext";
import ProductChinh from "./SanPhamChinh/ProductChinh";
import Dieukhoangiaodichchung from "./policies/Dieukhoangiaodichchung";
import Huongdanmuahang from "./policies/Huongdanmuahang";
import Cart from "./Cart";
import CheckoutPayment from "./CheckoutPayment";
import CustomerCare from "./Admin/UILoginAdmin/CustomerCare";
import EmployeeManagement from "./Admin/UILoginAdmin/EmployeeManagement";
import Ship from "./Admin/UILoginAdmin/Ship";
import Revenue from "./Admin/UILoginAdmin/Revenue";
import Reports from "./Admin/UILoginAdmin/reports";


function AppContent() {
  const location = useLocation();

  // Danh sách các path KHÔNG cần hiển thị MenuTrangchu và Chantrang
  const noLayoutPaths = ["/login", "/register","/forgot-password","/admin","/admin/Uiadmin","/admin/Uiadmin/Addproduct",
                        "/admin/Uiadmin/Deleteproduct","/admin/Uiadmin/CustomerCare",
                        "/admin/Uiadmin/EmployeeManagement","/admin/Uiadmin/Ship",
                        "/admin/Uiadmin/Revenue","/admin/Uiadmin/Reports"
                        ];
  const nouiadminPath = ["/Uiadmin/Ship"]

  const showlayoutadmin = ["/Uiadmin"];

  const hideLayout = noLayoutPaths.includes(location.pathname);

  return (
    <>
      {!hideLayout && <MenuTrangchu />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Bodytrangchu />
              <Sanphamout />
              <Danhmucnoibat />
              <Sanphamyeuthich />
              <Hangmoive />
              <Onepice />
              <Naruto />
              <DragonBall />
              <KitmestuNoYaiba />
              <Ngokhong />
            </>
          }
        />
        <Route path="/san-pham" element={<><PageSanPham /><Danhsachsanpham /><ProductDetail/> </>} />
        <Route path="/products/:type" element={<><PageSanPham /><ProductChinh/></>}></Route>
        <Route path="/products" element={<><PageSanPham/><Danhsachsanpham /></>} />
        <Route path="/product/:id" element={<ProductDetail/>}></Route>
        <Route path="/gioi-thieu" element={<Gioithieu/>}></Route>
        <Route path="/lien-he" element={<Lienhe/>}></Route>
        <Route path="/chinh-sach-bao-mat" element={<Csbaomathongtin/>}></Route>
        <Route path="/chinh-sach-van-chuyen-va-giao-hang" element={<Csvanchuyenvagiaohang/>} ></Route>
        <Route path="/chinh-sach-thanh-toan" element={<CsThanhToan/>}></Route>
        <Route path="/Dieu-khoan-giao-dich-chung" element={<Dieukhoangiaodichchung/>}></Route>
        <Route path="/Huong-dan-mua-hang" element={<Huongdanmuahang/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/Cart" element={<Cart/>}></Route>
        <Route path="/checkout" element={<CheckoutPayment/>}></Route>
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/hotro" element={<SupportUser/>}></Route>
        <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
    

         {/* chức năng admin */}
         <Route path="/admin" element={<LoginAdmin />}></Route>
         <Route path="/admin/Uiadmin" element={<UIAdmin/>}>
          <Route path="Addproduct" element={<Addproduct/>}></Route>
          <Route path="Deleteproduct" element={<Deleteproduct/>}></Route>
          <Route path="CustomerCare" element={<CustomerCare/>}></Route>
          <Route path="EmployeeManagement" element={<EmployeeManagement/>}></Route>
          <Route path="Ship" element={<Ship/>}></Route>
          <Route path="Revenue" element={<Revenue/>}></Route>
          <Route path="Reports" element={<Reports/>}></Route>
         </Route>  
         
      </Routes>
      {!hideLayout && <Chantrang />}
      {!hideLayout && <Chatboxai/>}
    </>
  );
}

function App() {
  return (
     <CartProvider>
    <Router>
      <AppContent />
    </Router>
    </CartProvider>
  );
}

export default App;

// In your Cart component
import { Link } from "react-router-dom";
import Lienhe from "./Lienhe";
import Chatboxai from "./Chatboxai";
import SupportUser from "./SupportUser";
import ForgotPassword from "./Login_Register/ForgotPassword";


// Add a checkout button somewhere in your Cart component's return statement
<Link to="/checkout" className="checkout-button">
  Tiến hành thanh toán
</Link>
