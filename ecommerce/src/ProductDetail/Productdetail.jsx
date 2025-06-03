import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../Css/productdetail.module.css";
import iconsnext from "../assets/icons/icons8-next-50.png";
import iconsback from "../assets/icons/icons8-back-50.png";
import tranfer from "../assets/icons/icons8-truck-94.png";
import gift from "../assets/icons/icons8-gift-50.png";
import voucher from "../assets/icons/icons8-voucher-50.png";
import badge from "../assets/icons/icons8-badge-50.png";
import momo from "../assets/images/momo.png";
import zalopay from "../assets/images/zalopay.png";
import icons_cart from "../assets/icons/icons8-cart-100.png";
import Paymentmomo from "../compoments/Paymentmomo";
export default function Productdetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [count,setcount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { cartCount } = useCart();
  const { addToCart } = useCart();
  const [showMomo, setShowMomo] = useState(false);

  const handleNextImage = () => {
    if (product.subImages && product.subImages.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === product.subImages.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  const handlePrevImage = () => {
    if (product.subImages && product.subImages.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? product.subImages.length - 1 : prevIndex - 1
      );
    }
  };
  const HandleIncrease = () =>{
    setcount(prev => prev+1);
  }
  const handleDecrease = () => {  
    setcount(prev => prev-1);
  };
 const handleAddToCart = async () => {
  const userId = localStorage.getItem('id');  //id người dùng
   if (!userId) {
    alert("Bạn cần đăng nhập trước khi thêm vào giỏ hàng.");
    return;
  }
  if (count <= 0) {
    alert("Vui lòng chọn số lượng lớn hơn 0!");
    return;
  }
  try {
    await axios.post("https://localhost:7048/api/Products/addproductCart", {
      userId: userId,
      productId: product.id,  // hoặc product.Id nếu backend dùng chữ hoa
      quantity: count
    });

    addToCart(); // tăng hiển thị đếm giỏ hàng ở UI
    alert("Đã thêm vào giỏ hàng!");
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ:", error);
    alert("Thêm vào giỏ hàng thất bại.");
  }
};
  useEffect(() => {
    axios.get(`https://localhost:7048/api/Products/GetProductDetail/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error("Lỗi khi tải chi tiết:", err));
  }, [id]);

  if (!product) return <p>Đang tải...</p>;
  const allImages = [product.imagePath, ...(product.subImages || [])];
  return (
    <div>
      <div className={styles.headerBar}>
        <div className={styles.giohang}>
            <button onClick={() => navigate("/cart")}>
            <img src={icons_cart} alt='giỏ hàng' />
            <h1>Giỏ hàng ({cartCount})</h1>
          </button>
        </div>

      </div>
    <div className={styles["product-detail-container"]}>
      {/* Vùng ảnh */}
      <div className={styles["image-section"]}>
        <div className={styles["main-image-wrapper"]}>
          <img
          src={`https://localhost:7048${allImages[currentImageIndex]}`}alt={product.name}/>
          <button className={styles.arrow + " " + styles.left} onClick={handlePrevImage}><img src={iconsback}></img></button>
          <button className={styles.arrow + " " + styles.right} onClick={handleNextImage}><img src={iconsnext}></img></button>
        </div>
        <div className={styles["thumbnail-images"]}>
          {product.subImages?.map((img, index) => (
            <img
              key={index}
              src={`https://localhost:7048${img}`}
              alt={`Ảnh phụ ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <div className={styles["info-section"]}>
        <h1 className={styles["product-name"]}>{product.name}</h1>
        <div className={styles["product-meta"]}>
          Tình trạng: Còn hàng | Mã Sản Phẩm : {product.id}
        </div>
        <div className={styles["product-price"]}>
          {product.price.toLocaleString()}₫
        </div>
        <div className={styles["quantity-section"]}>
          <span>Số lượng:</span>
          <button onClick={handleDecrease} disabled={count === 0}>-</button>
          <span><h1>{count}</h1></span>
          <button onClick={HandleIncrease}>+</button>
        </div>

        <div className={styles["action-buttons"]}>
          <button>MUA NGAY</button>
          <button onClick={handleAddToCart}>THÊM VÀO GIỎ</button>
        </div>
         <div className={styles.tieudethanhtoan}>
          <h1>Phương thức thanh toán</h1>
          <div className={styles.thanhtoan}>
          <div className={styles.momo}>
          <button onClick={() => setShowMomo(false)}>
            <img src={momo} alt="Thanh toán MoMo" />
          </button>
        </div>
             {showMomo && (
              <Paymentmomo
                onClose={() => setShowMomo(false)}
                onSuccess={() => {
                  alert("Bạn đã thanh toán thành công qua MoMo!");
                  setShowMomo(false);
                }}
              />
            )}

          <div className={styles.zalopay}>
            <button><img src={zalopay}></img></button>
          </div>
        </div>
        </div>
        <div className={styles.quangba}>
          <div>
            <img src={tranfer}></img>
            <h1>Giao hàng toàn quốc</h1>
          </div>
          <div>
            <img src={gift}></img>
            <h1>Ship cod Kiểm tra hàng mới thanh toán</h1>
          </div>
          <div>
            <img src={voucher}></img>
            <h1>Nhiều ưu đãi cao cho khách hàng</h1>
          </div>
          <div>
            <img src={badge}></img>
            <h1>Sản phẩm không thương hiệu</h1>
          </div>
        </div>
      </div>
      
    </div>
     <div className={styles.mota}>
          <h1>Mô tả sản phẩm</h1>
          <div>
             <h1 className={styles.nameproduct}>{product.name}</h1>
          </div>
          <div>
            <h2 className={styles["product-Descriptions"]}>{product.description}</h2>
          </div>
        </div>
    </div>

    
    
  )
};