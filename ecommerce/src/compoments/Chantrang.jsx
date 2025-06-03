//import css
import styles from "../Css/Footter.module.css";
//import logo
import logo from "../assets/images/tải xuống.png";
import logofb from "../assets/images/logoFacebook.png";
import logoyt from "../assets/images/logoYt.png";
import momo from "../assets/images/momo.png";
import zalopay from "../assets/images/zalopay.png";
export default function Chantrang() {
  return (
    <div className={styles.footter}>
      <div className={styles.container}>
        <div className={styles.column}>
          <h3>Về chúng tôi</h3>
          <img src={logo} alt="MHGX" className={styles.logo} />
          <p>CÔNG TY TNHH SẢN XUẤT VÀ THƯƠNG MẠI MHGX</p>
          <p>Mst: 0601254344 , Ngày cấp: 23-02-2025</p>
          <p>Nơi cấp: Sở Kế Hoạch và Đầu Tư Tỉnh Thành Phố Hà Nội</p>
          <p>Cung cấp sản phẩm chất lượng từ các thương hiệu hàng đầu.</p>
          <p>
            <strong>Địa chỉ:</strong> Số nhà 127 Tổ 9 làng nhân trạch, Phú Lương, Quận Hà Đông, Thành Phố Hà Nội
          </p>
          <p><strong>SĐT:</strong> 0342088618</p>
          <p><strong>Email:</strong> vuongnguyenduc556@gmail.com</p>
        <div className={styles.socials}>
          <a href="https://web.facebook.com/profile.php?id=61567948576093" target="_blank" rel="noopener noreferrer"  className={styles.socialLink}>
            <img src={logofb} alt="Facebook" />
          </a>
          <a href="https://www.youtube.com/@maphongba5617" target="_blank" rel="noopener noreferrer"  className={styles.socialLink}>
            <img src={logoyt} alt="YouTube" />
          </a>
        </div>

        </div>
        <div className={styles.column}>
        <h3>Chính sách</h3>
        <a href="/chinh-sach-bao-mat">Chính Sách Bảo Mật Thông Tin</a>
        <a href="/chinh-sach-van-chuyen-va-giao-hang">Chính Sách Vận Chuyển Và Giao Hàng</a>
        <a href="/chinh-sach-thanh-toan">Chính Sách Thanh Toán</a>
        <a href="/Dieu-khoan-giao-dich-chung">Điều Khoản Giao Dịch Chung</a>
      </div>
      <div className={styles.column}>
        <h3>Hỗ trợ</h3>
        <a href="/Huong-dan-mua-hang">Hướng dẫn mua hàng</a>
        <a href="/Huong-dan-mua-hang">Hướng dẫn thanh toán</a>
        <a href="/Huong-dan-mua-hang">Hướng dẫn giao nhận</a>
        <a href="/Huong-dan-mua-hang">Điều khoản dịch vụ</a>
      </div>

        <div className={styles.column}>
          <h3>Đăng ký nhận tin</h3>
          <div className={styles.newsletter}>
            <input type="email" placeholder="Nhập địa chỉ email" />
            <button>Đăng ký</button>
          </div>
          <p>Phương thức thanh toán</p>
          <div className={styles.payments}>
            <img src={momo} alt="Momo" />
            <img src={zalopay} alt="ZaloPay" />
          </div>
          {/*<img src="/dathongbao.png" alt="Đã thông báo" className={styles.certification} />*/}
        </div>
      </div>
      <div className={styles.copyRight}>
        © Bản quyền thuộc về <strong>MÔ HÌNH FIGUE</strong> | Cung cấp bởi Nguyễn Đức Vượng
      </div>
    </div>
  );
}
