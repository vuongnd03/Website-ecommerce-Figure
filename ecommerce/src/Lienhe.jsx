import styles from '../src/Css/Gioithieu.module.css';
//import icons
import iconstelephone from "../src/assets/images_logo/icons8-telephone-64.png";

export default function Lienhe() {
    return (
        <div style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f6f8fa"
        }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
                <h1 style={{ fontSize: 36, fontWeight: 700, color: "#222", letterSpacing: 1 }}>
                    Liên hệ Shop Firgue
                </h1>
                <h2 style={{ fontSize: 20, fontWeight: 400, color: "#444", marginTop: 12 }}>
                    Mọi vấn đề thắc mắc xin liên hệ qua số điện thoại phía dưới:
                </h2>
            </div>
            <div style={{
                display: "flex",
                alignItems: "center",
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                padding: "24px 40px",
                marginTop: 24,
                gap: 18
            }}>
                <img src={iconstelephone} alt="Telephone" style={{ width: 48, height: 48 }} />
                <span style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#1877f2",
                    letterSpacing: 2
                }}>
                    0342.088.618
                </span>
            </div>
            <div style={{ marginTop: 32, color: "#888", fontSize: 16 }}>
                (Thời gian hỗ trợ: 8h00 - 22h00, tất cả các ngày trong tuần)
            </div>
        </div>
    );
}