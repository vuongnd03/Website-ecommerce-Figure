import { useEffect, useState } from "react";
import styles from "../Css/Payment.module.css";
//import ảnh thanh toán MoMo
import momobanking from "../assets/image_banking/momo.jpg";
export default function Paymentmomo({ onClose, onSuccess , productIds}) {
  const [time, setTime] = useState(180);

  useEffect(() => {
    if (time <= 0) {
      onClose();
      return;
    }
    const timer = setInterval(() => setTime((pre) => pre - 1), 1000);
    return () => clearInterval(timer);
  }, [time]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`; 
  };
  return (
    <div className={styles.showframe}>
      <div className={styles.modal}>  
        <img src={momobanking} alt="Mã QR MoMo" />
        <div className={styles.timer}>{formatTime(time)}</div>
        <div className={styles.noidungchuyenkhoan}>
          <p><strong>Nội dung chuyển khoản: Nhập sđt của khách hàng</strong></p>
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={onClose} className={styles.cancelBtn}>Huỷ</button>
          <button onClick={onSuccess} className={styles.successBtn}>Đã thanh toán</button>
        </div>
      </div>
    </div>
  );
}
