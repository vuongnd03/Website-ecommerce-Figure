import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import icons1 from '../Icons/icons8-add-50.png';
import icons from '../Icons/icons8-search-50.png';
import styles from "../CssAdmin/Deleteproduct.module.css";
import { useOutletContext } from "react-router-dom";
import icons_delete from "../Icons/icons8-delete-100.png";

export default function Deleteproduct(){
    const { fetchProducts } = useOutletContext();
    const [products, setProducts] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [keyword, setKeyword] = useState('');
    useEffect(() => {
    if (keyword.trim().length < 2) {
        fetchAllProducts(); 
        return;
    }

    const delayDebounce = setTimeout(() => {
        axios
            .get(`https://localhost:7048/api/Products/search?keyword=${encodeURIComponent(keyword)}`)
            .then(res => setProducts(res.data))
            .catch(err => {
                console.error("Lỗi tìm kiếm sản phẩm:", err);
                setProducts([]);
            });
    }, 300);

    return () => clearTimeout(delayDebounce);
}, [keyword]);


    // Hàm để xoá sản phẩm
    
    const handleDelete = async (productId) => {
        try {
            await axios.delete(`https://localhost:7048/api/Products/delete/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}` // Thêm token vào header
                    }
                }
            );
            setProducts((prev) => prev.filter((p) => p.id !== productId));
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Token hết hạn hoặc không hợp lệ
                localStorage.removeItem('token');
                // Hiển thị thông báo hoặc chuyển hướng về trang đăng nhập
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                window.location.href = '/admin'; // hoặc route login của bạn
            } 
            console.error("Lỗi khi xoá sản phẩm:", error);
        }
    };

    const handleTypeChange = async (e) => {
        const type = e.target.value;
        setSelectedType(type);
        if (type === "") {
            fetchAllProducts(); // nếu không chọn gì thì load lại tất cả
            return;
        }try {
            const response = await axios.get(`https://localhost:7048/api/Products/gettype/${encodeURIComponent(type)}`);
            setProducts(response.data);
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Lỗi khi tải sản phẩm theo loại:", error);
            setProducts([]); // không có kết quả thì để trống
        }
    };

    const fetchAllProducts = async () => {
        try {
            const response = await axios.post("https://localhost:7048/api/Products/GetAll");
            setProducts(response.data);
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        }
    };
    useEffect(() => {
        fetchAllProducts();
    }, []);

    return (
        <div>
            <div className={styles.searchContainer}>
                <div className={styles.Combobox}>
                    <select value={selectedType} onChange={handleTypeChange}>
                        <option value="">-- Chọn loại sản phẩm --</option>
                        <option value="Sản Phẩm được yêu thích">Sản phẩm được yêu thích</option>
                        <option value="One Piece">One Piece</option>
                        <option value="Naruto">Naruto</option>
                        <option value="Dragon Ball">Dragon Ball</option>
                        <option value="kitmestu No Yaiba">Kitmestu No Yaiba</option>
                        <option value="Black Wukong">Black WuKong</option>
                    </select>
                </div>
                <div className={styles.searchBox}>
                    <input
                    type="text"
                    placeholder="Tìm kiếm"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />

                </div>
            </div>

            <div className={styles.sanpham}>
                <div className={styles.sanphamyeuthich}>
                    {products.map((product) => (
                        <div className={styles.yeuthich} key={product.id}>
                            <img
                                src={icons_delete}
                                alt="delete icon"
                                className={styles.deleteIcon}
                                onClick={() => handleDelete(product.id)}
                            />
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
                                <button><img src={icons1} alt="add icon" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
