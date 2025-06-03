import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import "./CheckoutPayment.css";
import { useLocation } from "react-router-dom";

//import logo banking
import momo from "../src/assets/images/momo.png";
import zalopay from "../src/assets/images/zalopay.png";
import Paymentmomo from "../src/compoments/Paymentmomo";
import Paymentzalopay from "../src/compoments/paymentzalopay";

const CheckoutPayment = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [showMomo, setShowMomo] = useState(false);
  const [showZalopay, setShowZaloPay] = useState(false);
  
  // Add voucher states
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherError, setVoucherError] = useState("");
  const location = useLocation();
  const { productIds } = location.state || {};
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
    sum : 0
  });

  // Fetch cart data from API
  useEffect(() => {
    const userId = localStorage.getItem("id") || "1"; // Get userId from localStorage or use default
    fetch(`https://localhost:7048/api/Products/getcart/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCartItems(data);
          const calculatedSubtotal = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
          setSubtotal(calculatedSubtotal);
          // You can calculate shipping fee based on your business rules
          setShippingFee(0); // For now set to 0
          setTotal(calculatedSubtotal + shippingFee);
        }
      })
      .catch(err => {
        console.error("Error fetching cart:", err);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle voucher code input change
  const handleVoucherChange = (e) => {
    setVoucherCode(e.target.value);
    // Clear any previous error when typing
    if (voucherError) {
      setVoucherError("");
    }
  };
  
  // Function to apply voucher
  const applyVoucher = () => {
    if (!voucherCode.trim()) {
      setVoucherError("Vui lòng nhập mã giảm giá");
      return;
    }
    
    setVoucherLoading(true);
    setVoucherError("");
    
    // Call API to validate and apply voucher
    fetch(`https://localhost:7048/api/Voucher/getprice?voucher=${voucherCode}&price=${subtotal + shippingFee}`)
      .then(response => {
        console.log(voucherCode + " " + (subtotal + shippingFee));
        console.log(response); 
        if (!response.ok) {
          throw new Error('Mã giảm giá không hợp lệ');
        }
        return response.json(); 
      })
      .then(discountedPrice => {
        setTotal(discountedPrice);
        setAppliedVoucher(voucherCode);
        setVoucherCode(""); // Clear input after successful application
      })
      .catch(error => {
        console.error("Error applying voucher:", error);
        setVoucherError("Mã giảm giá không hợp lệ hoặc đã hết hạn");
      })
      .finally(() => {
        setVoucherLoading(false);
      });
  };
  
  // Function to remove applied voucher
  const removeVoucher = () => {
    setAppliedVoucher(null);
    setTotal(subtotal + shippingFee);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check required fields
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }
    // Format cart items for API - exact format needed
    const cartItemsFormatted = cartItems.map(item => ({
      productId: item.productId.toString(),
      stock: item.quantity
    }));
    
    // Prepare data for API - exact format needed
    const paymentData = {
      userId: parseInt(localStorage.getItem("id") || "1"),
      paymentstatus: 0, // 0 for COD, 1 for bank transfer
      phonerecei: formData.phone,
      note: formData.notes,
      address: formData.address,
      customerName: formData.fullName,
      sto: cartItemsFormatted,
      sum: total, // This will use the discounted total if a voucher was applied
      voucherCode: appliedVoucher // Include the applied voucher code if any
    };
    console.log("Sending payment data:", paymentData);
    // Call API to save payment
    fetch('https://localhost:7048/api/payments', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(paymentData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Payment submission failed');
      }
      return response.json();
    })
    .then(data => {
      console.log("Payment successful:", data);
      alert("Đặt hàng thành công!");
      navigate("/");
    })
    .catch(error => {
      console.error("Error submitting payment:", error);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
    });
  };

  return (
    <div className="checkout-container">
      <div className="checkout-form">
        {/* Delivery info section - unchanged */}
        <div className="checkout-section">
          <h2>Thông tin nhận hàng</h2>
          <form>
            <div className="form-group">
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="address"
                placeholder="Địa chỉ"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="notes"
                placeholder="Ghi chú (tùy chọn)"
                value={formData.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </form>
        </div>
        
        {/* Payment method section - unchanged */}
        <div className="checkout-section">
          <h2>Thanh toán</h2>
          <div className="payment-options">
            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <span>Thanh toán khi giao hàng (COD)</span>
            </label>
            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="bank"
                checked={paymentMethod === "bank"}
                onChange={() => setPaymentMethod("bank")}
              />
              <span>Chuyển khoản qua ngân hàng</span>
            </label>
          </div>
          
          {paymentMethod === "bank" && (
            <div className="bank-transfer-options">
              <h4>Chọn phương thức chuyển khoản:</h4>
              <button onClick={() => setShowMomo(true)}>
                <img src={momo} alt="MoMo" style={{ width: "100px", height: "auto" }} />
              </button>
              <button onClick={() => setShowZaloPay(true)}>
                <img src={zalopay} alt="ZaloPay" style={{ width: "100px", height: "auto" }} />
              </button>
            </div>
          )}

          {showMomo && (
            <Paymentmomo  
              onClose={() => setShowMomo(false)}
              onSuccess={() => {
                alert("Bạn đã thanh toán thành công qua MoMo!");
                setShowMomo(false);
              }}
              productIds={productIds}
            />
          )}


          {showZalopay && (
            <Paymentzalopay
              onClose={() => setShowZaloPay(false)}
              onSuccess={() => {
                alert("Bạn đã thanh toán thành công qua MoMo!");
                setShowZaloPay(false);
              }}
            />
          )}
        </div>
      </div>
      

      <div className="order-summary">
        <h2>Đơn hàng ({cartItems.length} sản phẩm)</h2>
        <div className="order-items">
          {cartItems.map((item, index) => (
            <div className="order-item" key={index}>
              <div className="item-image">
                <img 
                  src={`https://localhost:7048${item.imagePath}`} 
                  alt={item.productName} 
                />
              </div>
              <div className="item-info">
                <p>{item.productName}</p>
                <p>SL: {item.quantity}</p>
                <p>{item.price.toLocaleString()}₫</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Voucher section - NEW */}
        <div className="voucher-section">
          <h3>Mã giảm giá</h3>
          {appliedVoucher ? (
            <div className="applied-voucher">
              <div className="voucher-info">
                <span className="voucher-code">{appliedVoucher}</span>
                <span className="voucher-status">Đã áp dụng</span>
              </div>
              <button 
                className="remove-voucher-btn"
                onClick={removeVoucher}
              >
                Xóa
              </button>
            </div>
          ) : (
            <div className="voucher-input-group">
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                value={voucherCode}
                onChange={handleVoucherChange}
                disabled={voucherLoading}
              />
              <button 
                className="apply-voucher-btn"
                onClick={applyVoucher}
                disabled={voucherLoading}
              >
                {voucherLoading ? 'Đang áp dụng...' : 'Áp dụng'}
              </button>
            </div>
          )}
          {voucherError && <div className="voucher-error">{voucherError}</div>}
        </div>
        
        <div className="order-totals">
          <div className="subtotal">
            <span>Tạm tính</span>
            <span>{subtotal.toLocaleString()}₫</span>
          </div>
          <div className="shipping">
            <span>Phí vận chuyển</span>
            <span>{shippingFee > 0 ? `${shippingFee.toLocaleString()}₫` : "-"}</span>
          </div>
          {appliedVoucher && (
            <div className="discount">
              <span>Giảm giá</span>
              <span>-{((subtotal + shippingFee) - total).toLocaleString()}₫</span>
            </div>
          )}
          <div className="total">
            <span>Tổng cộng</span>
            <span>{total.toLocaleString()}₫</span>
          </div>
        </div>
        <div className="checkout-actions">
          <button className="checkout-button" onClick={handleSubmit}>
            ĐẶT HÀNG
          </button>
          <a href="/Cart" className="back-to-cart">
            ← Quay về giỏ hàng
          </a>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPayment;