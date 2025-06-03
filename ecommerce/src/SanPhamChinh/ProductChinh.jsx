import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from "../Css/sanpham.module.css";
import icons1 from '../assets/icons/icons8-add-50.png';
import { useCart } from "../CartContext";
import { useParams } from 'react-router-dom';
export default function ProductChinh() {
    const { type } = useParams();
    const [products, setProducts] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); // Lưu sản phẩm đã chọn
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`https://localhost:7048/api/Products/gettype/${encodeURIComponent(type)}`);
                setProducts(response.data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            }
        };

        fetchProducts();
    }, [type]);

    const handleAddClick = (product) => {
        setSelectedProduct(product);
        setShowPopup(true); // Hiển thị popup
    };
    const handleClosePopup = () => {
        setShowPopup(false); // Đóng popup
        setSelectedProduct(null); // Reset sản phẩm đã chọn
    };
    const handleAddToCart = () => {
        addToCart(); // tăng số lượng
        alert("Đã thêm vào giỏ hàng!");
    };
    const handleCheckout = () => {
        // Logic thanh toán (Chưa triển khai)
        alert("Tiến hành thanh toán!");
    };
    return (
        <div className={styles.sanpham}>
            <div className={styles.sanphamyeuthich}>
                {products.map((product) => (
                    <div className={styles.yeuthich} key={product.id}>
                        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {product.imagePath && (
                                <img
                                    src={`https://localhost:7048${product.imagePath}`}
                                    alt={product.name}
                                />
                            )}
                            <h1>{product.name}</h1>
                        </Link>
                        <div className={styles["price-add"]}>
                            <h2>{product.price}</h2>
                            <button onClick={() => handleAddClick(product)}>
                                <img src={icons1} alt="add icon" />
                            </button>
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
