
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import img1 from "../assets/images/coll_1.webp";
import img2 from "../assets/images/coll_2.webp";
import img3 from "../assets/images/coll_3.webp";
import img4 from "../assets/images/motor.png";
import img5 from "../assets/images/carthethao.png";
import img6 from "../assets/images/xetang.png";
import img7 from "../assets/images/Gundam.png";
import img8 from "../assets/images/xetai.png";
import img9 from "../assets/images/mohinhlegotoanha.jpg";

import styles from "../Css/DesignAllsanpham.module.css";
import { useNavigate } from 'react-router-dom';

export default function Allsanpham() {
    const navigate = useNavigate();
    const products = [
        { img: img1, title: "One Piece" },
        { img: img2, title: "Dragon Ball" },
        { img: img3, title: "Naruto" },
        { img: img4, title: "Mô hình Motor" },
        { img: img5, title: "Mô hình xe thể thao" },
        { img: img6, title: "Mô hình xe tăng" },
        { img: img7, title: "Mô hình Gundam" },
        { img: img8, title: "Mô hình xe tải" },
        { img: img9, title: "Mô hình lego toà nhà" },
    ];
    const handleClick = (title) => {
        const encodedTitle = encodeURIComponent(title);
        navigate(`/products/${encodedTitle}`);
    };
    return (
        <div className={styles.designAllsanpham}>
            <Swiper
                modules={[Navigation, Autoplay]}
                navigation={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
                slidesPerView={6}  // 6 sản phẩm trên 1 hàng
                spaceBetween={20}  // khoảng cách giữa các sản phẩm
                className={styles.mySwiper}
            >
                {products.map((product, index) => (
                    <SwiperSlide key={index}>
                        <div className={styles.designsanpham}>
                            <button className={styles.buttonNoBorder} onClick={() => handleClick(product.title)}
                            >
                            <img src={product.img} alt={product.title} />
                            <h1>{product.title}</h1>
                            </button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
