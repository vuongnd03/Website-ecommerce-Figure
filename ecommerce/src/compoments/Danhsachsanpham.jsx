import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from "../Css/sanpham.module.css";
import icons1 from '../assets/icons/icons8-add-50.png';
import { useCart } from "../CartContext";
import { useParams } from "react-router-dom";
export default function Allsanpham() {
    const { id } = useParams();

    const [products, setProducts] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); // Lưu sản phẩm đã chọn
    const { addToCart } = useCart();
    const location = useLocation(); 
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let apiUrl = "https://localhost:7048/api/Products/GetAll";
                let method = "post";
                const queryParams = new URLSearchParams(location.search);
                const sortType = queryParams.get("sort");
                const minprice = queryParams.get("minprice");
                const maxprice = queryParams.get("maxprice");
                const type = queryParams.get("type");
                if(type){
                    apiUrl = `https://localhost:7048/api/Products/gettype/${encodeURIComponent(type)}`;
                    method = "get";
                }else if (sortType === "asc") {
                    apiUrl = "https://localhost:7048/api/Products/sapxeptangdan";
                    method = "get";
                }else if (sortType === "desc") {
                    apiUrl = "https://localhost:7048/api/Products/sapxepgiamdan";
                    method = "get";
                }else if (sortType === "newest") {
                    apiUrl = "https://localhost:7048/api/Products/moinhat";
                    method = "get";
                }else if(minprice && maxprice){
                    apiUrl =  `https://localhost:7048/api/Products/sapxeptheogia?minprice=${minprice}&maxprice=${maxprice}`;
                    method = "get";
                }
                const response = method === "get"
                    ? await axios.get(apiUrl)
                    : await axios.post(apiUrl);
                setProducts(response.data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            }
        };
        fetchProducts();
    }, [location.search],[id]);

    const handleAddClick = (product) => {
        setSelectedProduct(product);
        setShowPopup(true); // Hiển thị popup
    };
    const handleClosePopup = () => {
        setShowPopup(false); // Đóng popup
        setSelectedProduct(null); // Reset sản phẩm đã chọn
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
        addToCart(); // tăng hiển thị đếm giỏ hàng ở UI
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
