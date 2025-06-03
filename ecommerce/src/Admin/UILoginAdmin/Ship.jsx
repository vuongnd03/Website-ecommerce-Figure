import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../CssAdmin/Ship.module.css";

export default function DeliveryManagement() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [showDetails, setShowDetails] = useState(false);
  const [detailData, setDetailData] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrderDetails = async (orderId) => {
  try {
    const res = await axios.get(
      `https://localhost:7048/api/Payments/chitiethoadon?Paymentid=${orderId}`,
      getAuthHeaders()
    );
    setDetailData(res.data);
    setSelectedOrderId(orderId);
    setShowDetails(true);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
    setMessage("Không thể tải chi tiết hóa đơn.");
  }
};

  // Admin ID for tracking who made the change
  const adminId = 1; // You should get this from authentication context

  // Helper: lấy headers có token
  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  // Xử lý khi token hết hạn
  const handle401 = () => {
    localStorage.removeItem('token');
    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    window.location.href = '/admin'; // hoặc route login của bạn
  };
  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://localhost:7048/api/Payments/AllUndone"
        , getAuthHeaders()
      );
      
      // Transform API data to match our component's structure
      const transformedOrders = response.data.map(payment => ({
        id: payment.paymentId,
        customerName: payment.customerName || 'Khách hàng',
        phone: payment.phonerecei || 'Chưa có SĐT',
        address: payment.address || 'Chưa có địa chỉ',
        note: payment.note || 'Không có ghi chú',
        items: payment.itemCount || 0,
        totalAmount: payment.sum || 0,
        orderDate: new Date(payment.paymentDate || Date.now()).toISOString().split('T')[0],
        status: mapStatusCodeToText(payment.paymentstatus)
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handle401();
      }else {
        console.error("Error fetching orders:", error);
        setMessage("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Map numeric status codes from API to text values
  const mapStatusCodeToText = (statusCode) => {
    switch (statusCode) {
      case 0: return 'pending';
      case 1: return 'confirmed';
      case 2: return 'shipping';
      case 3: return 'delivered';
      default: return 'cancelled';
    }
  };

  
  // Map text status to numeric codes for API
  const mapStatusTextToCode = (statusText) => {
    switch (statusText) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'shipping': return 2;
      case 'delivered': return 3;
      case 'cancelled': return 4;
      default: return 0;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const statusCode = mapStatusTextToCode(newStatus);
      
      const response = await axios.put(
        `https://localhost:7048/api/Payments/${orderId}?x=${statusCode}&nvid=${adminId}`,
         null,
         getAuthHeaders()
      );
      
      // Update local state after successful API call
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      ));
      
      setMessage(`Cập nhật trạng thái đơn hàng #${orderId} thành công!`);
    } catch (error) {
      console.error("Error updating order status:", error);
      setMessage(`Lỗi khi cập nhật trạng thái đơn hàng #${orderId}!`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipping': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return styles.pending;
      case 'confirmed': return styles.confirmed;
      case 'shipping': return styles.shipping;
      case 'delivered': return styles.delivered;
      case 'cancelled': return styles.cancelled;
      default: return '';
    }
  };
  const handlexacnhan = async (orderId) => {
  try {
    setLoading(true);

    // Gọi API xác nhận trạng thái đơn hàng thành "confirmed"
    await axios.put(
      `https://localhost:7048/api/Payments/${orderId}?x=1&nvid=${adminId}`,
      null,
      getAuthHeaders()
    );

    // Gọi API gửi hóa đơn về mail
    await axios.post(
      `https://localhost:7048/api/Order/checkout-success?orderidl=${orderId}`,
      getAuthHeaders()
    );

    // Cập nhật trạng thái trong danh sách
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: 'confirmed' }
        : order
    ));

    setMessage(`Xác nhận và gửi hóa đơn đơn hàng #${orderId} thành công!`);
  } catch (error) {
    console.error("Lỗi khi xác nhận và gửi hóa đơn:", error);
    setMessage(`Lỗi xác nhận đơn hàng #${orderId}.`);
    if (error.response?.status === 401) handle401();
  } finally {
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  }
};

  return (
    <div className={styles.container}>
      <h1>Quản Lý Giao Hàng</h1>
      
      {message && <div className={styles.message}>{message}</div>}
      
      <div className={styles.filterSection}>
        <label>Lọc theo trạng thái:</label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="pending">Chờ xử lý</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="shipping">Đang giao</option>
          <option value="delivered">Đã giao</option>
          <option value="cancelled">Đã hủy</option>
        </select>
        
        <button 
          className={styles.refreshButton}
          onClick={fetchOrders}
          disabled={loading}
        >
          {loading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>
      
      <div className={styles.orderList}>
        {loading && <div className={styles.loading}>Đang tải dữ liệu...</div>}
        
        <table>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Liên hệ</th>
              <th>Địa chỉ</th>
              <th>Ghi chú</th>
              <th>Ngày đặt</th>
              <th>Giá trị</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>
                  <button
                    className={styles.orderIdButton}
                    onClick={() => fetchOrderDetails(order.id)}
                  >
                    #{order.id}
                  </button>
                </td>

                <td>{order.customerName}</td>
                <td>{order.phone}</td>
                <td className={styles.addressColumn}>{order.address}</td>
                <td className={styles.noteColumn}>
                  {order.note ? order.note : <span className={styles.emptyNote}>Không có ghi chú</span>}
                </td>
                <td>{order.orderDate}</td>
                <td>{order.totalAmount.toLocaleString()}đ</td>
                <td>
                  <span className={`${styles.status} ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td>
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className={styles.actions}>
                      {order.status === 'pending' && (
                        <>
                      <button 
                        className={styles.confirmedButton}
                        onClick={() => handlexacnhan(order.id)}
                        disabled={loading}
                      >
                        Xác nhận</button>

                          <button 
                            className={styles.cancelButton}
                            onClick={() => handleStatusChange(order.id, 'cancelled')} disabled={loading}>
                            Hủy </button>
                        </>
                      )}
                      
                      {order.status === 'confirmed' && (
                        <button 
                          className={styles.shippingButton}
                          onClick={() => handleStatusChange(order.id, 'shipping')}
                          disabled={loading}> Giao hàng </button>
                      )}
                      
                      {order.status === 'shipping' && (
                        <button 
                          className={styles.deliveredButton}
                          onClick={() => handleStatusChange(order.id, 'delivered')}
                          disabled={loading}
                        >
                          Đã giao
                        </button>
                      )}
                    </div>
                  )}
                  
                  {(order.status === 'delivered' || order.status === 'cancelled') && (
                    <span>-</span>
                  )}
                </td>
              </tr>
            ))}
            {!loading && filteredOrders.length === 0 && (
              <tr>
                <td colSpan="9" className={styles.emptyMessage}>
                  Không có đơn hàng nào
                </td>
              </tr>
            )}
            
          </tbody>
        </table>
        
      </div>

        {showDetails && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <button className={styles.closeButton} onClick={() => setShowDetails(false)}>×</button>
      <h2>Chi tiết đơn hàng #{selectedOrderId}</h2>
      <table className={styles.detailTable}>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {detailData.map((item, index) => (
            <tr key={index}>
              <td>{item.productId}</td>
              <td>{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

    </div>
    
  );
  
}