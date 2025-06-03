import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import styles from "../CssAdmin/DesignAdmin.module.css";
import iconsLogOut from '../Icons/icons8-logout-50.png';

export default function UIAdmin() {
  const fetchProducts = () => {
    console.log("Fetch products");
  };
  const DeleteProduct = ()=>{
    console.log("DeleteProduct");
  }
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Ẩn menu nếu ở trang Ship
  const hideMenu = location.pathname === "/admin/Uiadmin/Ship";

  return (
    <div>
      {!hideMenu && (
        <div className={styles.designadmin}>
          <nav>
            <ul>
              <li><Link to="Addproduct">Thêm sản phẩm</Link></li>
              <li><Link to="Deleteproduct">Xoá sản phẩm</Link></li>
              <li><Link to="Revenue">Doanh Thu</Link></li>
              <li><Link to="Reports">Báo cáo sản phẩm</Link></li>
              <li><Link to="CustomerCare">Khuyến mãi</Link></li>
              <li><Link to="EmployeeManagement">Thêm nhân viên</Link></li>
              <li><Link to="Ship">Quản lí giao hàng</Link></li>
              <button onClick={handleLogout}>
                <img src={iconsLogOut} alt="Log Out" />
              </button>
            </ul>
          </nav>
        </div>
      )}

      <Outlet context={{ fetchProducts, DeleteProduct }} />

    </div>
  );
}