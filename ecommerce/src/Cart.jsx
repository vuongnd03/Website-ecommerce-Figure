import React, { useEffect, useState } from 'react';
import styles from '../src/Css/Cart.module.css';
import { useNavigate } from 'react-router-dom';
const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const userId = localStorage.getItem("id"); // hoặc dùng 1 nếu test cứng
  const productIds = cartItems.map(item => item.productId);

useEffect(() => {
  fetch(`https://localhost:7048/api/Products/getcart/${userId}`)
    .then(res => res.json())
    .then(data => {
       console.log("Dữ liệu giỏ hàng:", data);
      if (Array.isArray(data)) {
        setCartItems(data);
        const totalPrice = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(totalPrice);
      } else {
        setCartItems([]);
      }
    });
}, []);
  const handleQuantityChange = (index, delta) => {
    const newItems = [...cartItems];
    const newQuantity = newItems[index].quantity + delta;
    if (newQuantity >= 1) {
      newItems[index].quantity = newQuantity;
      setCartItems(newItems);
      const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotal(newTotal);
    }
  };
const handleRemove = (index) => {
  const itemToRemove = cartItems[index];
  const userId = localStorage.getItem("id");
  const productId = itemToRemove.productId; // 👈 Giờ sẽ có giá trị
  console.log("Xoá sản phẩm:", productId);
  fetch(`https://localhost:7048/api/Products/deletefromcart?userId=${userId}&productId=${encodeURIComponent(productId)}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to delete");
      const newItems = [...cartItems];
      newItems.splice(index, 1);
      setCartItems(newItems);
      const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotal(newTotal);
    })
    .catch(err => {
      console.error("Lỗi khi xóa sản phẩm:", err);
    });
};

  return (
    <div className={styles.container}>
      <h2>Giỏ hàng</h2>
     {cartItems.map((item, index) => (
  <div key={index} className={styles.cartItem}>
    <button className={styles.removeBtn} onClick={() => handleRemove(index)}>×</button>
    <img src={`https://localhost:7048${item.imagePath}`} alt="Product" className={styles.productImage} />
    <div className={styles.details}>
      <p className={styles.name}>{item.productName}</p>
      <p className={styles.code}>Mã sản phẩm</p> {/* Nếu có thể lấy mã riêng thì thay thế */}
    </div>
    <div className={styles.priceSection}>
      <span className={styles.price}>{item.price.toLocaleString()}₫</span>
      <div className={styles.quantity}>
        <button onClick={() => handleQuantityChange(index, -1)}>-</button>
        <span>{item.quantity}</span>
        <button onClick={() => handleQuantityChange(index, 1)}>+</button>
      </div>
    </div>
  </div>
))}

      <div className={styles.noteSection}>
        <label>Ghi chú đơn hàng</label>
        <textarea rows="3" />
      </div>
      <div className={styles.totalSection}>
        <div className={styles.totalLine}>
          <span>TỔNG CỘNG</span>
          <strong>{total.toLocaleString()}₫</strong>
        </div>
        <button onClick={() => navigate("/checkout")} className={styles.checkoutBtn}>Thanh Toán</button>
      </div>
    </div>
  );
};

export default Cart;
