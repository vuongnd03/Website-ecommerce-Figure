import { useEffect, useState } from "react";
import styles from "../Css/Payment.module.css";
import zalobanking from "../assets/image_banking/ZaloPay.jpg";
export default function Paymentzalopay({ onClose, onSuccess }) {
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
        <img src={zalobanking} alt="Mã QR MoMo" />
        <div className={styles.timer}>{formatTime(time)}</div>
        <div className={styles.buttonGroup}>
          <button onClick={onClose} className={styles.cancelBtn}>Huỷ</button>
          <button onClick={onSuccess} className={styles.successBtn}>Đã thanh toán</button>
        </div>
      </div>
    </div>
  );
}
