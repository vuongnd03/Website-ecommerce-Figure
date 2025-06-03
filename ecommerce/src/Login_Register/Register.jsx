import styles from '../Css/Register.module.css';
import logo1 from '../assets/images/tải xuống.png';
import img1 from '../assets/images/Gold_Suozi_Armor_Set.webp';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [phone, setPhone] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleRegister = async () => {
        // Kiểm tra các trường rỗng
        if (!phone || !fullname || !email || !password || !confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        // Kiểm tra mật khẩu khớp
        if (password !== confirmPassword) {
            setError("Mật khẩu không khớp");
            return;
        }

        const data = {
            phonenumber: phone,
            fullname: fullname,
            email: email,
            password: password
        };

        setLoading(true);
        try {
            const response = await fetch("https://localhost:7048/api/Auth/Register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                navigate('/login'); // Chuyển hướng khi đăng ký thành công
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Đăng ký thất bại");
            }
        } catch (err) {
            setError("Lỗi kết nối đến server: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <img src={img1} alt="armor" className={styles.image} />
            </div>
            <div className={styles.right}>
                <div className={styles.logo}>
                    <img src={logo1} alt='logo' className={styles.logoImg} />
                    <h1 className={styles.title}>FIRGUE SHOP</h1>
                </div>
                
                <h2 className={styles.header}>Đăng Ký Tài Khoản</h2>
                
                {error && <div className={styles.error}>{error}</div>}
                
                <input 
                    type="text" 
                    placeholder="Số điện thoại" 
                    className={styles.input} 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                />
                
                <input 
                    type="text" 
                    placeholder="Họ và Tên" 
                    className={styles.input} 
                    value={fullname} 
                    onChange={(e) => setFullname(e.target.value)} 
                />
                
                <input 
                    type="email" 
                    placeholder="Email" 
                    className={styles.input} 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                
                <input 
                    type="password" 
                    placeholder="Mật khẩu" 
                    className={styles.input} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                
                <input 
                    type="password" 
                    placeholder="Nhập lại mật khẩu" 
                    className={styles.input} 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                />
                
                <button 
                    className={styles.registerBtn} 
                    onClick={handleRegister}
                    disabled={loading}
                >
                    {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                </button>
                
                <div className={styles.social}>
                    <button style={{ backgroundColor: '#3b5998', color: 'white' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127c-.82-.088-1.643-.13-2.467-.129-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
                        </svg>
                        Facebook
                    </button>
                    <button style={{ backgroundColor: '#db4437', color: 'white' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                        </svg>
                        Google
                    </button>
                </div>
                
                <p className={styles.policy}>
                    Bằng việc đăng ký, bạn đồng ý với điều khoản dịch vụ và chính sách bảo mật
                </p>
                
                <p className={styles.registerText}>
                    Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}
