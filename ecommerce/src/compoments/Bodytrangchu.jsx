import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade'; 
import styles from "../Css/Bodytrangchu.module.css";
import img1 from "../assets/images/Gold_Suozi_Armor_Set.webp";
import img2 from "../assets/images/xetang.png";
import img3 from "../assets/images/Gundam.png";
export default function Bodytrangchu() {
    return (
        <div className={styles.bodytrangchu}>
            <Swiper
                modules={[Pagination, Autoplay, EffectFade]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
                effect="fade" // <- hiệu ứng fade mượt
                fadeEffect={{ crossFade: true }} // <- mượt hơn khi chuyển
                className={styles.mySwiper}
            >
                <SwiperSlide>
                    <div className={styles.contentContainer}>
                        <div className={styles.textContent}>
                            <h1>Black Wukong</h1>
                            <h2>
                        Mô hình Black Myth Wukong Figure – Monkey King của Joy Man Toys (dự kiến phát hành quý 4-2024)
                        mang đến cho người hâm mộ một trải nghiệm gần gũi và chân thực hơn với thế giới của Black Myth: Wukong
                            </h2>
                            <h3>Giá gốc: 299.000đ</h3>
                            <h1>Giá khuyến mãi: 199.000đ</h1>
                        </div>
                        <div className={styles.imageContainer}>
                            <img src={img1} alt="Black Wukong" />
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className={styles.contentContainer}>
                        <div className={styles.textContent}>
                            <h1>Mô hình xe tăng</h1>
                            <h2>Đồ Chơi Lắp Ráp Điều Khiển Xe Tăng Chiến Đấu Chủ Lực Panther - CADA C61073W</h2>
                            <h3>Giá gốc: 1.299.000đ</h3>
                            <h1>Giá khuyến mãi: 599.000đ</h1>
                        </div>
                        <div className={styles.imageContainer}>
                            <img src={img2} alt="Slide 2" />
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className={styles.contentContainer}>
                        <div className={styles.textContent}>
                            <h1>Mô hình Gundam cao cấp</h1>
                            <h2>Hàng Cao Cấp - Mô hình Gundam HG 1/144 Cao 17cm - nặng 150gram - Figure Gundam - Có hộp màu đẹp - N1-K15-T3-S3</h2>
                            <h3>Giá gốc: 1.099.000đ</h3>
                            <h1>Giá khuyến mãi: 899.000đ</h1>
                        </div>
                        <div className={styles.imageContainer}>
                            <img src={img3} alt="Slide 3" />
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
}
