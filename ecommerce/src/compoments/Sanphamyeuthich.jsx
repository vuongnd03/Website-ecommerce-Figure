
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from "../Css/sanphamyeuthich.module.css";

import icons1 from '../assets/icons/icons8-add-50.png';
import { useCart } from "../CartContext";

import axios from "axios";

export default function Sanphamyeuthich(){
    const [products, setProducts] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); 
    useEffect(()=>{
        const fetchProduct = async ()=>{
            try{
                const response = await axios.get("https://localhost:7048/api/Products/Type/S%E1%BA%A3n%20ph%E1%BA%A9m%20%C4%91%C6%B0%E1%BB%A3c%20y%C3%AAu%20th%C3%ADch");
                setProducts(response.data);
            }catch{
                console.error("lỗi khi tải sản phẩm: ",error)
            }
        };
        fetchProduct();
    },[]);
     const handleClosePopup = () => {
        setShowPopup(false); // Đóng popup
        setSelectedProduct(null); // Reset sản phẩm đã chọn
    };

   const handleAddClick = (product) => {
        setSelectedProduct(product);
        setShowPopup(true); // Hiển thị popup
    };
    const handleAddToCart = async () => {
        const userId = localStorage.getItem('id');  //id người dùng
        if (!userId) {
        alert("Bạn cần đăng nhập trước khi thêm vào giỏ hàng.");
        return;
    }
        try {
        await axios.post("https://localhost:7048/api/Products/addproductCart", {
        userId: userId,
        productId: selectedProduct.id,  // hoặc product.Id nếu backend dùng chữ hoa
        quantity: 1
    });
        alert("Đã thêm vào giỏ hàng!");
        handleClosePopup();
     } catch (error) {
    console.error("Lỗi khi thêm vào giỏ:", error);
    alert("Thêm vào giỏ hàng thất bại.");
  }
};
const handleCheckout = () => {
        // Logic thanh toán (Chưa triển khai)
        alert("Vui lòng vào giỏ hàng để thanh toán!");
    };
    return (
        <div className={styles.sanpham}>
            <div className={styles.tieude}><h1>Sản phẩm được yêu thích</h1></div>
            <div className={styles.sanphamyeuthich}>
                {products.map((product) => (
                    <div className={styles.yeuthich} key={product.id}>
                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {product.imagePath && (
                            <img  src={`https://localhost:7048${product.imagePath}`} alt={product.name} />   
                    )}
                    <h1>{product.name}</h1>
                    </Link>
                        <div className={styles["price-add"]}>
                            <h2>{product.price}.đ</h2>
                            <button onClick={() => handleAddClick(product)}><img src={icons1} alt="add icon" /></button>
                        </div>
                    </div>
                ))}
            </div>
             {/* Popup Modal */}
                        {showPopup && selectedProduct && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.modalContent}>
                                    <button className={styles.closeBtn} onClick={handleClosePopup}>✖</button>
                                    <div className={styles.modalBody}>
                                        <div className={styles.productImage}>
                                            <img
                                                src={`https://localhost:7048${selectedProduct.imagePath}`}
                                                alt={selectedProduct.name}
                                                width="100"
                                                height="100"
                                            />
                                        </div>
                                        <div className={styles.productInfo}>
                                            <h3>{selectedProduct.name}</h3>
                                            <h2>{selectedProduct.price} đ</h2>
                                            <div className={styles.modalButtons}>
                                                <button onClick={handleAddToCart}>Thêm vào giỏ</button>
                                                <button onClick={handleCheckout}>Thanh toán</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
        </div>
    );
}

