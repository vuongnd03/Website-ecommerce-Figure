import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../CssAdmin/EmployeeManagement.module.css";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    username: '',
    password: '',
    dchi: '',
    phonenumber: '',
    rights: 1 // Setting rights=1 for employees
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://localhost:7048/api/Auth/GetAllEmployees",
        {headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }}
      );
      setEmployees(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
                // Token hết hạn hoặc không hợp lệ
                localStorage.removeItem('token');
                // Hiển thị thông báo hoặc chuyển hướng về trang đăng nhập
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                window.location.href = '/admin'; // hoặc route login của bạn
            } 
      console.error("Error fetching employees:", error);
      setMessage("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value
    });
  };

  const resetForm = () => {
    setNewEmployee({
      username: '',
      password: '',
      dchi: '',
      phonenumber: '',
      rights: 1
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const addEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing) {
        // Update existing employee
        await axios.put(`https://localhost:7048/api/Auth/UpdateEmployee/${editingId}`, newEmployee,
          {headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }}
        );
        setMessage('Cập nhật nhân viên thành công!');
      } else {
        // Add new employee
        await axios.post("https://localhost:7048/api/Auth/RegisterADmin", newEmployee,
          {headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }}
        );
        setMessage('Thêm nhân viên thành công!');
      }
      
      // Refresh employee list
      fetchEmployees();
      resetForm();
    } catch (error) {
      if (error.response && error.response.status === 401) {
                // Token hết hạn hoặc không hợp lệ
                localStorage.removeItem('token');
                // Hiển thị thông báo hoặc chuyển hướng về trang đăng nhập
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                window.location.href = '/admin'; // hoặc route login của bạn
            } 
      console.error("Error saving employee:", error);
      setMessage(isEditing 
        ? 'Cập nhật nhân viên thất bại!'
        : 'Thêm nhân viên thất bại!');
    } finally {
      setLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const editEmployee = (employee) => {
    setNewEmployee({
      username: employee.username,
      password: '', // Don't populate password for security
      dchi: employee.dchi,
      phonenumber: employee.phonenumber,
      rights: employee.rights
    });
    setIsEditing(true);
    setEditingId(employee.id);
  };

  const deleteEmployee = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
    setLoading(true);
    try {
      await axios.delete(`https://localhost:7048/api/Auth/DeleteEmployee/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage('Đã xóa nhân viên!');
      fetchEmployees();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        window.location.href = '/admin';
      } else {
        console.error("Error deleting employee:", error);
        setMessage('Xóa nhân viên thất bại!');
      }
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  }
};


  return (
    <div className={styles.container}>
      <h1>Quản Lý Nhân Viên</h1>
      
      {message && <div className={styles.message}>{message}</div>}
      
      <div className={styles.addEmployeeForm}>
        <h2>{isEditing ? 'Cập Nhật Nhân Viên' : 'Thêm Nhân Viên Mới'}</h2>
        <form onSubmit={addEmployee}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Tên đăng nhập:</label>
              <input
                type="text"
                name="username"
                value={newEmployee.username}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Mật khẩu{isEditing ? ' (để trống nếu không thay đổi)' : ''}:</label>
              <input
                type="password"
                name="password"
                value={newEmployee.password}
                onChange={handleInputChange}
                required={!isEditing}
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Địa chỉ:</label>
              <input
                type="text"
                name="dchi"
                value={newEmployee.dchi}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Số điện thoại:</label>
              <input
                type="tel"
                name="phonenumber"
                value={newEmployee.phonenumber}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button type="submit" className={styles.addButton} disabled={loading}>
              {loading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Thêm nhân viên')}
            </button>
            
            {isEditing && (
              <button 
                type="button" 
                className={styles.cancelButton} 
                onClick={resetForm}
                disabled={loading}
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>
      
      <div className={styles.employeeList}>
        <h2>Danh Sách Nhân Viên</h2>
        {loading && <p>Đang tải...</p>}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Quyền hạn</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.username}</td>
                <td>{employee.phonenumber}</td>
                <td>{employee.dchi}</td>
                <td>{employee.rights === 1 ? 'Nhân viên' : 'Admin'}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.editButton}
                      onClick={() => editEmployee(employee)}
                      disabled={loading}
                    >
                      Sửa
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => deleteEmployee(employee.id)}
                      disabled={loading}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && employees.length === 0 && (
              <tr>
                <td colSpan="6" className={styles.emptyMessage}>
                  Chưa có nhân viên nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}