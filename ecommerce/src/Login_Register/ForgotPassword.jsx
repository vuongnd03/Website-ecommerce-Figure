import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../Css/Loginn.module.css';
import logo1 from '../assets/images/tải xuống.png';
import img1 from '../assets/images/Gold_Suozi_Armor_Set.webp';
import { useNavigate } from 'react-router-dom';
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'code'
  const [timer, setTimer] = useState(60); // 10 phút

  const navigate = useNavigate();

  // Reset timer và bắt đầu đếm ngược khi bước chuyển sang nhập code
  useEffect(() => {
    let interval;

    if (step === 'code') {
      setTimer(60); // Reset về 1 phút mỗi lần chuyển bước

      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('https://localhost:7048/api/Forgotpassword/forgot-password', { email });
          console.log('Kết quả từ API:', res.data);

      if (res.data === 'Code sent') {
        setStep('code'); // Đảm bảo setStep trước, timer sẽ reset trong useEffect
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('Không thể gửi email. Kiểm tra lại.');
      }
    }
  };
  const handleCodeSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try {
        const res = await axios.post('https://localhost:7048/api/Forgotpassword/verify-code', {
          email:email,
          code:code
        });
         console.log('Kết quả từ API:', res.data);

        if (res.data === 'Code valid') {
          setStep('new-password');
        } else {
          setError('Mã OTP không hợp lệ.');
        }
      } catch (err) {
        setError('Lỗi xác thực mã OTP.');
      }
};
const handleResetPassword = async (e) => {
  e.preventDefault();
  setError('');

  if (newPassword !== confirmPassword) {
    setError('Mật khẩu không khớp.');
    return;
  }

  try {
    const res = await axios.post('https://localhost:7048/api/Forgotpassword/reset-password', {
      email,
      newPassword,
    });
    console.log('step hiện tại:', res.data);

    if (res.data === 'lưu mật khẩu mới thành công') {
      alert('Đổi mật khẩu thành công!');
      navigate('/login'); 
    } else {
      setError('Lỗi khi đặt lại mật khẩu.');
    }
  } catch (err) {
    setError('Lỗi máy chủ.');
  }
};

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img src={img1} alt="warrior" className={styles.image} />
      </div>

      <div className={styles.right}>
        <div className={styles.logo}>
          <img src={logo1} alt="logo" className={styles.logoImg} />
          <h1 className={styles.title}>FIRGUE SHOP</h1>
        </div>

        <h2 className={styles.header}>Quên mật khẩu</h2>
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={step === 'email' ? handleSendEmail : handleCodeSubmit} className={styles.form}>
          {step === 'email' && (
            <>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className={styles.loginBtn}>
                Gửi mã
              </button></>)}
          {step === 'code' && (
            <>
              <input
                type="email"
                placeholder="Nhập lại email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Nhập mã OTP"
                className={styles.input}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <div className={styles.timer}>Thời gian còn lại: {formatTime(timer)}</div>
              <button type="submit" className={styles.loginBtn}>
                Xác nhận mã
              </button>
            </>
          )}

          {step === 'new-password' && (
            <>
              <input
                type="password"
                placeholder="Mật khẩu mới"
                className={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button onClick={handleResetPassword} className={styles.loginBtn}>
                Đặt lại mật khẩu
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
