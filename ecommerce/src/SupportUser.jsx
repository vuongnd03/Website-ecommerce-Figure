import styles from '../src/Css/Gioithieu.module.css';
//import icons
import iconsfb from "../src/assets/images/logoFacebook.png";

export default function SupportUser() {
    return (
        <div style={{ minHeight: "100vh", background: "#fafbfc" }}>
            <div style={{ textAlign: "center", marginTop: 40 }}>
                <h1 style={{ fontSize: 36, fontWeight: 600, color: "#222" }}>Liên hệ Shop Firgue</h1>
                <h2 style={{ fontSize: 20, fontWeight: 400, color: "#444", marginTop: 16 }}>
                    Liên hệ với chúng tôi để được hỗ trợ nhanh nhất
                </h2>
                <h2 style={{ fontSize: 20, fontWeight: 400, color: "#444", marginTop: 8 }}>
                    Chúng tôi luôn sẵn sàng lắng nghe và phục vụ bạn
                </h2>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
                <div style={{
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                    padding: 24,
                    maxWidth: 540,
                    width: "100%"
                }}>
                    <iframe
                        src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3D122105500046598285%26id%3D61567948576093&show_text=true&width=500"
                        width="500"
                        height="250"
                        style={{ border: "none", overflow: "hidden", borderRadius: 12 }}
                        scrolling="no"
                        frameBorder="0"
                        allowFullScreen={true}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        title="Facebook Post"
                    ></iframe>
                    <div style={{ marginTop: 24, textAlign: "center" }}>
                        <span style={{ fontWeight: 500, fontSize: 18, color: "#222" }}>Hotline: </span>
                        <a href="tel:0123456789" style={{ color: "#1877f2", fontWeight: 600, fontSize: 18, textDecoration: "none" }}>
                            0123 456 789
                        </a>
                    </div>
                    <div style={{ marginTop: 16, textAlign: "center" }}>
                        <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
                            <img src={iconsfb} alt="Facebook" style={{ width: 36, verticalAlign: "middle" }} />
                            <span style={{ marginLeft: 8, color: "#1877f2", fontWeight: 500 }}>Fanpage Facebook</span>
                        </a>
                    </div>
                </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 40 }}>
                <h2 style={{ fontSize: 20, fontWeight: 400, color: "#444", marginTop: 16 }}>
                    Trong trường hợp cần thiết, bạn có thể đến trực tiếp cửa hàng của chúng tôi tại địa chỉ dưới đây!!
                </h2>
            </div>
            {/* Google Maps iframe, cách ra phía dưới */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 48, marginBottom: 32 }}>
                <div style={{
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                    padding: 16,
                    maxWidth: 650,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7450.4314819219135!2d105.78550313092401!3d20.983987362524044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1748333969508!5m2!1svi!2s"
                        width="600"
                        height="350"
                        style={{ border: 0, borderRadius: 12 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Map"
                    ></iframe>
                </div>
            </div>
        </div>
    )
}