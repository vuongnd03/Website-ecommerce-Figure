import styles from '../Css/Onepice.module.css';
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
//import icons
import icons1 from '../assets/icons/icons8-add-50.png';
import icons2 from '../assets/icons/icons8-next-50 (1).png';
import { useNavigate } from 'react-router-dom';
export default function KitmestuNoYaiba(){
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    useEffect(()=>{
        const fetchProduct = async ()=>{
            try{
                const response = await axios.get("https://localhost:7048/api/Products/Hottrend/Kitmestu%20No%20yaiba");
                setProducts(response.data);
            }catch{
                console.error("lỗi khi tải sản phẩm: ",error)
            }
        };
        fetchProduct();
    },[]);
    const title = "Kitmestu No Yaiba";
    const handleClick = (title) => {
        const encodedTitle = encodeURIComponent(title);
        navigate(`/products/${encodedTitle}`);
    };
    return(<div className={styles.sanpham}>
    <div className={styles.Onepice}><button><h1>Kitmestu No Yaiba</h1></button></div>
    <div className={styles.sanphamOnePice}>
           {products.map((product) => (
                            <div className={styles.Onepices} key={product.id}>
                            <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {product.imagePath && (
                                        <img  src={`https://localhost:7048${product.imagePath}`} alt={product.name} />   
                                )}
                                      <h1>{product.name}</h1>
                                      </Link>
                                        <div className={styles["price-add"]}>
                                            <h2>{product.price}.đ</h2>
                                            <button><img src={icons1} alt="add icon" /></button>
                                          </div>
                                      </div>
                                  ))}
    </div>
    <div className={styles.xemthem}><button onClick={() => handleClick(title)}>Xem Thêm <img src={icons2} alt="icons xem thêm" /></button></div>
    </div>)
}