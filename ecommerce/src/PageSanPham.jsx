import styles from '../src/Css/Pagesanpham.module.css';
import icon_menu from '../src/assets/icons/icons8-menu-50.png';
import icons_cart from '../src/assets/icons/icons8-cart-100.png';
import { useCart } from "../src/CartContext";
import { Link, useNavigate } from 'react-router-dom'; 
import { useState, useRef, useEffect } from 'react';

export default function PageSanPham() {
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [showSelect, setShowSelect] = useState(false); 
    const [selectedType, setSelectedType] = useState("");
    const [products, setProducts] = useState([]);
    const menuRef = useRef(null);
    
    const toggleMenu = () => {
        setShowSelect(prev => !prev);
    };
    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowSelect(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    // Existing functions
    const handleSort = (type) => {
        if (type === "asc") {
            navigate("/products?sort=asc");
        } else if (type === "desc") {
            navigate("/products?sort=desc");
        } else if (type === "newest") {
            navigate("/products?sort=newest");
        }
    };
    
    const handlePriceFillter = async (e) => {
        const value = e.target.value;
        let minprice = 0;
        let maxprice = 0;
        switch (value){
            case "under100":
                minprice = 0; maxprice = 100000; break;
            case "100to200":
                minprice = 100000; maxprice = 200000; break;
            case "200to300":
                minprice = 200000; maxprice = 300000; break;
            case "above300":
                minprice = 300000; maxprice = 999999999; break;
            default:
                return; 
        }
        navigate(`/products?minprice=${minprice}&maxprice=${maxprice}`);
    }
    const handleCategorySelect = (type) => {
    setSelectedType(type);
    if (type === "") {
        navigate("/products"); // không lọc gì, về tất cả sản phẩm
    } else {
        navigate(`/products?type=${encodeURIComponent(type)}`);
    }
    setShowSelect(false); // Đóng menu sau khi chọn
};

    return (
        <div className={styles.tuychon}>
            <div className={styles.iconsmenu} ref={menuRef}>
                <button onClick={toggleMenu} className={styles.menuButton}>
                    <img src={icon_menu} alt="menu" />
                    <span>Danh mục sản phẩm</span>
                </button>
                
                {showSelect && (
                    <div className={styles.categorySidebar}>
                        <div className={styles.categoryHeader}>
                            <img src={icon_menu} alt="menu" className={styles.menuIcon} />
                            <h2>Danh mục sản phẩm</h2>
                        </div>
                        
                        <ul className={styles.categoryList}>
                            <li onClick={() => handleCategorySelect("")}>
                                <div>
                                    <span className={`${styles.categoryIcon} ${styles.fireIcon}`}>🔥</span>
                                    <span>Tất Cả Sản Phẩm</span>
                                </div>
                            </li>
                            <li onClick={() => handleCategorySelect("Sản Phẩm được yêu thích")}>
                                <div>
                                    <span className={`${styles.categoryIcon} ${styles.boxIcon}`}>📦</span>
                                    <span>Sản phẩm được yêu thích</span>
                                </div>
                            </li>

                            <li onClick={() => handleCategorySelect("Mô hình xe thể thao")}>
                                <div>
                                    <span className={`${styles.categoryIcon} ${styles.boxIcon}`}>📦</span>
                                    <span>Mô hình xe thể thao</span>
                                </div>
                            </li>

                            <li onClick={() => handleCategorySelect("One Piece")}>
                                <div>
                                    <span className={`${styles.categoryIcon} ${styles.skullIcon}`}>☠️</span>
                                    <span>One Piece</span>
                                </div>
                            </li>
                            <li onClick={() => handleCategorySelect("Naruto")}>
                                <div>
                                    <span className={`${styles.categoryIcon} ${styles.ninjaIcon}`}>🥷</span>
                                    <span>Naruto</span>
                                </div>
                            </li>
                            <li onClick={() => handleCategorySelect("Dragon Ball")}>
                                <div>
                                    <span className={`${styles.categoryIcon} ${styles.fireIcon}`}>🔮</span>
                                    <span>Dragon Ball</span>
                                </div>
                            </li>
                            <li onClick={() => handleCategorySelect("kitmestu No Yaiba")}>
                                <div>
                                    <span className={`${styles.categoryIcon} ${styles.swordIcon}`}>⚔️</span>
                                    <span>Kimetsu No Yaiba</span>
                                </div>
                            </li>
                            <li onClick={() => handleCategorySelect("Black Wukong")}>
                                <div>
                                    <span className={`${styles.categoryIcon} ${styles.monkeyIcon}`}>🐒</span>
                                    <span>black wukong</span>
                                </div>
                            </li>

                        </ul>
                    </div>
                )}
            </div>
            
            <div className={styles.tuychongia}>
                <div className={styles.luachon}>
                    <select onChange={handlePriceFillter}>
                        <option value="">Mức giá</option>
                        <option value="under100">dưới 100k</option>
                        <option value="100to200">từ 100k đến 200k</option>
                        <option value="200to300">từ 200k đến 300k</option>
                        <option value="above300">Trên 300k</option>
                    </select>
                </div>
                <button onClick={() => handleSort("desc")}><h1>Giá giảm dần</h1></button>
                <button onClick={() => handleSort("asc")}><h1>Giá tăng dần</h1></button>
                <button onClick={() => handleSort("newest")}><h1>Mới nhất</h1></button>
                <div className={styles.giohang}>
                    <button onClick={() => navigate("/cart")}>
                        <img src={icons_cart} alt='giỏ hàng' />
                        <h1>Giỏ hàng ({cartCount})</h1>
                    </button>
                </div>
            </div>
        </div>
    );
}
