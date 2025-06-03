import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../CssAdmin/CustomerCare.module.css";

export default function CustomerCare() {
  const [vouchers, setVouchers] = useState([]);
  const [voucher, setVoucher] = useState({
    voucherCode: '',
    discout: '',
    type: 1, // Default to percentage (1)
    createDate: new Date().toISOString().split('T')[0],
    endDate: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch all vouchers when component mounts
  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://localhost:7048/api/Voucher");
      setVouchers(response.data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      showMessage("Không thể tải danh sách mã giảm giá", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 3000);
  };

  const handleVoucherChange = (e) => {
    const { name, value } = e.target;
    setVoucher({
      ...voucher,
      [name]: name === 'type' ? parseInt(value) : value
    });
  };
  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setVoucher({
      ...voucher,
      voucherCode: result
    });
  };
  const resetForm = () => {
    setVoucher({
      voucherCode: '',
      discout: '',
      type: 1, // Default to percentage (1)
      createDate: new Date().toISOString().split('T')[0],
      endDate: '',
      note: ''
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const addVoucher = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing) {
        // Update existing voucher
        await axios.put(`https://localhost:7048/api/Voucher/Update/${editingId}`, voucher,
          {headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
      });
        showMessage("Cập nhật mã giảm giá thành công");
      } else {
        // Add new voucher
        await axios.post("https://localhost:7048/api/Voucher/Add", voucher,
          {headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }}
        );
        showMessage("Thêm mã giảm giá thành công");
      }
      fetchVouchers();
      resetForm();
    } catch (error) {
      if (error.response && error.response.status === 401) {
                // Token hết hạn hoặc không hợp lệ
                localStorage.removeItem('token');
                // Hiển thị thông báo hoặc chuyển hướng về trang đăng nhập
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                window.location.href = '/admin'; // hoặc route login của bạn
            } 
      console.error("Error saving voucher:", error);
      showMessage("Lỗi khi lưu mã giảm giá", "error");
    } finally {
      setLoading(false);
    }
  };

  const editVoucher = (v) => {
    setVoucher({
      voucherCode: v.voucherCode,
      discout: v.discout,
      type: v.type,
      createDate: new Date(v.createDate).toISOString().split('T')[0],
      endDate: new Date(v.endDate).toISOString().split('T')[0],
      note: v.note
    });
    setIsEditing(true);
    setEditingId(v.voucherId);
  };

  const deleteVoucher = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
      setLoading(true);
      try {
        await axios.delete(`https://localhost:7048/api/Voucher/Delete/${id}`,
          {headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }}
        );
        showMessage("Xóa mã giảm giá thành công");
        fetchVouchers();
      } catch (error) {
        if (error.response && error.response.status === 401) {
                // Token hết hạn hoặc không hợp lệ
                localStorage.removeItem('token');
                // Hiển thị thông báo hoặc chuyển hướng về trang đăng nhập
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                window.location.href = '/admin'; // hoặc route login của bạn
        } 
        console.error("Error deleting voucher:", error);
        showMessage("Xóa mã giảm giá thất bại", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const sendVoucher = (code) => {
    // You can implement email functionality here
    alert(`Đã gửi mã giảm giá ${code} đến tất cả khách hàng!`);
  };

  return (
    <div className={styles.customerCareContainer}>
      <h1>Quản lý Mã Giảm Giá</h1>
      
      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}
      
      <div className={styles.voucherSection}>
        <h2>{isEditing ? 'Cập Nhật Mã Giảm Giá' : 'Tạo Mã Giảm Giá'}</h2>
        <form onSubmit={addVoucher}>
          <div className={styles.formGroup}>
            <label>Mã giảm giá:</label>
            <div className={styles.codeInputGroup}>
              <input
                type="text"
                name="voucherCode"
                placeholder="Nhập mã giảm giá"
                value={voucher.voucherCode}
                onChange={handleVoucherChange}
                required
              />
              <button 
                type="button" 
                className={styles.generateButton}
                onClick={generateRandomCode}
              >
                Tạo mã
              </button>
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Loại giảm giá:</label>
              <select 
                name="type" 
                value={voucher.type}
                onChange={handleVoucherChange}
                required
              >
                <option value={1}>Phần trăm (%)</option>
                <option value={0}>Số tiền cố định (VNĐ)</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Giá trị:</label>
              <input
                type="number"
                name="discout"
                placeholder={voucher.type === 1 ? "Nhập % giảm giá" : "Nhập số tiền giảm"}
                value={voucher.discout}
                onChange={handleVoucherChange}
                required
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Ngày tạo:</label>
              <input
                type="date"
                name="createDate"
                value={voucher.createDate}
                onChange={handleVoucherChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Ngày hết hạn:</label>
              <input
                type="date"
                name="endDate"
                value={voucher.endDate}
                onChange={handleVoucherChange}
                required
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Mô tả:</label>
            <textarea
              name="note"
              placeholder="Mô tả về mã giảm giá"
              value={voucher.note}
              onChange={handleVoucherChange}
              rows="3"
              required
            ></textarea>
          </div>
          
          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.addButton}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Thêm Mã Giảm Giá')}
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
      
      <div className={styles.voucherList}>
        <h2>Danh Sách Mã Giảm Giá</h2>
        {loading && <p className={styles.loading}>Đang tải...</p>}
        
        <table className={styles.voucherTable}>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Loại</th>
              <th>Giá trị</th>
              <th>Ngày tạo</th>
              <th>Ngày hết hạn</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map(v => (
              <tr key={v.voucherId} className={new Date(v.endDate) < new Date() ? styles.expired : ''}>
                <td>{v.voucherCode}</td>
                <td>{v.type === 1 ? 'Phần trăm' : 'Cố định'}</td>
                <td>{v.discout}{v.type === 1 ? '%' : ' VNĐ'}</td>
                <td>{new Date(v.createDate).toLocaleDateString('vi-VN')}</td>
                <td>{new Date(v.endDate).toLocaleDateString('vi-VN')}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.editButton}
                      onClick={() => editVoucher(v)}
                      disabled={loading}
                    >
                      Sửa
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => deleteVoucher(v.voucherId)}
                      disabled={loading}
                    >
                      Xóa
                    </button>
                    <button 
                      className={styles.sendButton}
                      onClick={() => sendVoucher(v.voucherCode)}
                      disabled={loading || new Date(v.endDate) < new Date()}
                    >
                      Gửi
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && vouchers.length === 0 && (
              <tr>
                <td colSpan="6" className={styles.emptyMessage}>
                  Chưa có mã giảm giá nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}