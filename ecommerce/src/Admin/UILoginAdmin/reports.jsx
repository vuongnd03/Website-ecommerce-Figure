import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../CssAdmin/Reports.module.css";

export default function Reports() {
  const [dateRange, setDateRange] = useState({
    startDate: '2025-05-01',
    endDate: '2025-05-20'
  });
  
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    completedOrders: 0,
    totalOrders: 0,
    completionRate: 0,
    dailyData: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };
  
  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  
  const handle401 = () => {
    localStorage.removeItem('token');
    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    window.location.href = '/admin'; // hoặc route login của bạn
  };
  
  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Format dates for API
      const formattedStartDate = `${dateRange.startDate}T00:00:00`;
      const formattedEndDate = `${dateRange.endDate}T23:59:59`;
      
      // Fetch total revenue
      const revenueResponse = await axios.get(
        `https://localhost:7048/api/Payments/revenue?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        getAuthHeaders()
      );
      
      // Fetch completed orders count
      const completedOrdersResponse = await axios.get(
        `https://localhost:7048/api/Payments/revenuecount?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        getAuthHeaders()
      );
      
      // Fetch all orders count
      const allOrdersResponse = await axios.get(
        `https://localhost:7048/api/Payments/allcount?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        getAuthHeaders()
      );
      
      const totalRevenue = revenueResponse.data;
      const completedOrders = completedOrdersResponse.data;
      const totalOrders = allOrdersResponse.data;
      
      // Calculate completion rate
      const completionRate = totalOrders > 0 
        ? ((completedOrders / totalOrders) * 100).toFixed(1) 
        : 0;
      
      // Fetch daily data
      const dailyData = await fetchDailyData(formattedStartDate, formattedEndDate);
      
      setReportData({
        totalRevenue,
        completedOrders,
        totalOrders,
        completionRate,
        dailyData
      });
      
    } catch (err) {
      if (err.response && err.response.status === 401) {
        handle401();
      } else {
        console.error("Error fetching report data:", err);
        setError("Không thể tải dữ liệu báo cáo. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDailyData = async (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const days = Math.min(dayDiff, 30);
    const dailyData = [];
    
    for (let i = 0; i <= days; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + i);
      
      // Skip future dates
      if (currentDate > new Date()) break;
      
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const formattedCurrentDate = currentDate.toISOString().split('T')[0] + 'T00:00:00';
      const formattedNextDate = nextDate.toISOString().split('T')[0] + 'T00:00:00';
      
      try {
        // Fetch revenue for the day
        const revenueResponse = await axios.get(
          `https://localhost:7048/api/Payments/revenue?startDate=${formattedCurrentDate}&endDate=${formattedNextDate}`,
          getAuthHeaders()
        );
        
        // Fetch order count for the day
        const orderCountResponse = await axios.get(
          `https://localhost:7048/api/Payments/revenuecount?startDate=${formattedCurrentDate}&endDate=${formattedNextDate}`,
          getAuthHeaders()
        );
        
        const displayDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
        
        dailyData.push({
          date: displayDate,
          orders: orderCountResponse.data,
          revenue: revenueResponse.data
        });
      } catch (err) {
        if (err.response && err.response.status === 401) {
          handle401();
          break;
        } else {
          console.error("Error fetching daily data:", err);
        }
      }
    }
    
    return dailyData.reverse();
  };
  
  useEffect(() => {
    // Initial data load
    fetchReportData();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Báo Cáo Bán Hàng</h1>
      
      <div className={styles.reportContainer}>
        <div className={styles.reportHeader}>
          <div className={styles.dateFilter}>
            <label>
              Từ ngày:
              <input 
                type="date" 
                name="startDate" 
                value={dateRange.startDate}
                onChange={handleDateChange}
              />
            </label>
            <label>
              Đến ngày:
              <input 
                type="date" 
                name="endDate" 
                value={dateRange.endDate}
                onChange={handleDateChange}
              />
            </label>
            <button 
              className={styles.applyBtn} 
              onClick={fetchReportData}
              disabled={loading}
            >
              {loading ? 'Đang tải...' : 'Áp dụng'}
            </button>
          </div>
        </div>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        {loading ? (
          <div className={styles.loading}>Đang tải dữ liệu báo cáo...</div>
        ) : (
          <div className={styles.reportContent}>
            <div className={styles.summaryCards}>
              <div className={styles.summaryCard}>
                <h3>Tổng doanh thu</h3>
                <p className={styles.summaryValue}>{reportData.totalRevenue.toLocaleString()}đ</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Số đơn hàng hoàn thành</h3>
                <p className={styles.summaryValue}>{reportData.completedOrders}</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Tỷ lệ hoàn thành</h3>
                <p className={styles.summaryValue}>{reportData.completionRate}%</p>
              </div>
            </div>
            
            <div className={styles.reportTable}>
              <h3>Doanh thu theo ngày</h3>
              <table>
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Đơn hàng</th>
                    <th>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.dailyData.length > 0 ? (
                    reportData.dailyData.map((day, index) => (
                      <tr key={index}>
                        <td>{day.date}</td>
                        <td>{day.orders}</td>
                        <td>{day.revenue.toLocaleString()}đ</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className={styles.noData}>Không có dữ liệu trong khoảng thời gian này</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}