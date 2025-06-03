import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../CssAdmin/Revenue.module.css";

export default function Revenue() {
  const [timeFilter, setTimeFilter] = useState('thisMonth');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchRevenueData();
    // eslint-disable-next-line
  }, [timeFilter]);

  const fetchRevenueData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Tính toán khoảng thời gian dựa trên bộ lọc
      const { startDate, endDate } = getDateRange(timeFilter);

      // Format ngày cho API
      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);

      // Gọi API lấy tổng doanh thu
      const totalResponse = await axios.get(
        `https://localhost:7048/api/Payments/revenue?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        getAuthHeaders()
      );

      setTotalRevenue(totalResponse.data);

      // Lấy dữ liệu doanh thu theo ngày
      await fetchDailyRevenueData(startDate, endDate, timeFilter);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        handle401();
      } else {
        console.error("Error fetching revenue data:", err);
        setError("Không thể tải dữ liệu doanh thu. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy dữ liệu doanh thu theo ngày/tháng
  const fetchDailyRevenueData = async (startDate, endDate, filter) => {
    try {
      const dailyData = [];

      if (filter === 'thisYear') {
        // Lấy dữ liệu theo tháng cho cả năm
        for (let month = 0; month < 12; month++) {
          const monthStart = new Date(startDate.getFullYear(), month, 1);
          const monthEnd = new Date(startDate.getFullYear(), month + 1, 0);

          // Bỏ qua các tháng tương lai
          if (monthStart > new Date()) break;

          const formattedMonthStart = formatDateForAPI(monthStart);
          const formattedMonthEnd = formatDateForAPI(monthEnd);

          try {
            const response = await axios.get(
              `https://localhost:7048/api/Payments/revenue?startDate=${formattedMonthStart}&endDate=${formattedMonthEnd}`,
              getAuthHeaders()
            );
            dailyData.push({
              month: `T${month + 1}`,
              revenue: response.data
            });
          } catch (err) {
            if (err.response && err.response.status === 401) {
              handle401();
              return;
            } else {
              throw err;
            }
          }
        }
      } else {
        // Lấy dữ liệu theo ngày cho tháng này hoặc tháng trước
        const days = (filter === 'thisMonth')
          ? Math.min(new Date().getDate(), endDate.getDate())
          : endDate.getDate();

        for (let day = 1; day <= days; day++) {
          const currentDate = new Date(
            filter === 'thisMonth' ? startDate.getFullYear() : endDate.getFullYear(),
            filter === 'thisMonth' ? startDate.getMonth() : endDate.getMonth(),
            day
          );

          const nextDate = new Date(currentDate);
          nextDate.setDate(nextDate.getDate() + 1);

          const formattedCurrentDate = formatDateForAPI(currentDate);
          const formattedNextDate = formatDateForAPI(nextDate);

          try {
            const response = await axios.get(
              `https://localhost:7048/api/Payments/revenue?startDate=${formattedCurrentDate}&endDate=${formattedNextDate}`,
              getAuthHeaders()
            );
            dailyData.push({
              month: `${day}/${currentDate.getMonth() + 1}`,
              revenue: response.data
            });
          } catch (err) {
            if (err.response && err.response.status === 401) {
              handle401();
              return;
            } else {
              throw err;
            }
          }
        }
      }

      setMonthlySales(dailyData);
    } catch (error) {
      console.error("Error fetching daily revenue data:", error);
      setError("Không thể tải dữ liệu doanh thu theo ngày. Vui lòng thử lại sau.");
    }
  };

  // Helper function to format date for API
  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0] + 'T00:00:00';
  };

  // Helper function to calculate date ranges based on filter
  const getDateRange = (filter) => {
    const now = new Date();
    let startDate, endDate;

    switch (filter) {
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
    }

    return { startDate, endDate };
  };

  // Calculate maximum revenue for chart scaling
  const maxRevenue = monthlySales.length > 0
    ? Math.max(...monthlySales.map(item => item.revenue), 1)
    : 1;

  return (
    <div className={styles.container}>
      <h1>Doanh Thu</h1>

      <div className={styles.filterSection}>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className={styles.filterSelect}
          disabled={loading}
        >
          <option value="thisMonth">Tháng này</option>
          <option value="lastMonth">Tháng trước</option>
          <option value="thisYear">Năm nay</option>
        </select>

        <button
          className={styles.refreshButton}
          onClick={fetchRevenueData}
          disabled={loading}
        >
          {loading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {loading ? (
        <div className={styles.loadingIndicator}>Đang tải dữ liệu doanh thu...</div>
      ) : (
        <>
          <div className={styles.statsCards}>
            <div className={styles.card}>
              <h3>Tổng doanh thu</h3>
              <p className={styles.stat}>{totalRevenue.toLocaleString()}đ</p>
            </div>
          </div>

          <div className={styles.chartSection}>
            <h2>Doanh thu theo {timeFilter === 'thisYear' ? 'tháng' : 'ngày'}</h2>
            <div className={styles.chart}>
              {monthlySales.map((item, index) => (
                <div className={styles.chartItem} key={index}>
                  <div
                    className={styles.chartBar}
                    style={{ height: `${(item.revenue / maxRevenue) * 200}px` }}
                  ></div>
                  <div className={styles.chartLabel}>{item.month}</div>
                  <div className={styles.chartValue}>
                    {item.revenue > 1000000
                      ? `${(item.revenue / 1000000).toFixed(1)}M`
                      : item.revenue.toLocaleString()}
                  </div>
                </div>
              ))}
              {monthlySales.length === 0 && (
                <div className={styles.noData}>Không có dữ liệu doanh thu</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}