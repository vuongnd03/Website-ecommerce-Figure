import { useState } from 'react';
import axios from 'axios';
import styles from '../Css/Loginn.module.css';
import logo1 from '../assets/images/tải xuống.png';
import img1 from '../assets/images/Gold_Suozi_Armor_Set.webp';
import { useNavigate, Link } from 'react-router-dom';
import { LoginSocialFacebook } from "reactjs-social-login";
import { LoginSocialGoogle } from 'reactjs-social-login';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    
    if (!phone || !password) {
      setError("Vui lòng nhập đầy đủ thông tin đăng nhập");
      return;
    }
    const loginData = {
      phonenumber: phone,
      password: password
    };
    
    setLoading(true);
    try {
      const response = await axios.post("https://localhost:7048/api/Auth/Login", loginData);
      console.log("Login API response:", response.data);
      const data = response.data;
      console.log("Login successful:", data);
      // Lưu thông tin đăng nhập khi thành công
      localStorage.setItem('token', data.token);
      localStorage.setItem('fullname', data.fullname);
      localStorage.setItem('id', data.id);
      
      // Chuyển về trang chủ
      navigate('/');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Đăng nhập thất bại');
      } else {
        setError('Lỗi kết nối tới server: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
 const handleSocialLogin = ({ provider, data }) => {
  console.log("Social login data:", data);
  
  // Lưu tên vào localStorage hoặc state
  localStorage.setItem("fullname", data.name); // lấy tên từ Facebook
  navigate('/');
};

  
  const handleSocialLoginFailure = (error) => {
    console.error(error);
    setError('Đăng nhập bằng mạng xã hội thất bại');
  };
  const fullname = localStorage.getItem("fullname");


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
        
        <h2 className={styles.header}>Đăng Nhập</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="text"
            placeholder="Số điện thoại"
            className={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          
          <input
            type="password"
            placeholder="Mật khẩu"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Link to="/forgot-password" className={styles.forgotPassword}>
            Quên mật khẩu?
          </Link>
          
          <button 
            type="submit" 
            className={styles.loginBtn}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
        
        <div className={styles.divider}>
          <p>Hoặc</p>
        </div>
        
        <div className={styles.social}>
          <LoginSocialFacebook
            appId="4302841329944043"
            onResolve={handleSocialLogin}
            onReject={handleSocialLoginFailure}
          >
            <button style={{ backgroundColor: '#3b5998', color: 'white' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127c-.82-.088-1.643-.13-2.467-.129-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
              </svg>
              Facebook
            </button>
          </LoginSocialFacebook>
          
          <LoginSocialGoogle
            client_id="683979562409-ck6ilg6res4nj2lk62p81a784spvldp6.apps.googleusercontent.com"
            onResolve={handleSocialLogin}
            onReject={handleSocialLoginFailure}
          >
            <button style={{ backgroundColor: '#db4437', color: 'white' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
              Google
            </button>
          </LoginSocialGoogle>
        </div>
        
        <p className={styles.registerText}>
          Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </div>
    </div>
  );
}
