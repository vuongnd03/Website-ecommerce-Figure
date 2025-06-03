import { useState } from "react";
import axios from 'axios'; 
import { useNavigate } from "react-router-dom";
export default function LoginAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (event) => {
    event.preventDefault();

    const loginData = {
      username: username,
      password: password
    };

    try {
      const response = await axios.post('https://localhost:7048/api/Auth/LoginAdmin', loginData);
      

      // Nếu đăng nhập thành công
      const data = response.data;
      //localStorage.setItem('token', data.token);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      console.log('Token:', data.token);
      // Lưu thông tin người dùng
      if (data.user.rights !== undefined) {
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        //alert('Đăng nhập thành công:', data.user);
        // Kiểm tra quyền và điều hướng
        if (data.user.rights == 1) {
          // Nhân viên (rights = 1) - chuyển đến trang Ship
          navigate('/admin/Uiadmin/Ship');
        } else {
          // Admin (rights = 0) - chuyển đến trang thêm sản phẩm
          navigate('/admin/Uiadmin/Addproduct');
        }
      } else {
        // Nếu API không trả về thông tin user, lưu thông tin username
        localStorage.setItem('adminUser', JSON.stringify({ username: username }));
        // Mặc định chuyển đến trang admin
        navigate('/admin/Uiadmin/Addproduct');
      }
    } catch (err) {
      // Nếu lỗi từ phía server (ví dụ: 401 Unauthorized)
      if (err.response) {
        setError(err.response.data.message || 'Đăng nhập thất bại');
      } else {
        // Lỗi không kết nối được hoặc lỗi khác
        setError('Lỗi kết nối tới server: ' + err.message);
      }
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f0f2f5"
    }}>
      <form onSubmit={handleLogin} style={{
        background: "white",
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        width: "300px"
      }}>
        <h2 style={{ textAlign: "center" }}>Admin Login</h2>
        
        {/* Error message display */}
        {error && (
          <div style={{
            backgroundColor: "#ffebee",
            color: "#d32f2f",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "10px",
            fontSize: "14px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "10px", margin: "10px 0" }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "10px", margin: "10px 0" }}
          required
        />
        <button type="submit" style={{
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}>
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
