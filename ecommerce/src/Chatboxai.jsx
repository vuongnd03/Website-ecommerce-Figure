import { useState, useEffect, useRef } from "react";
import styles from "../src/Chatboxai.module.css";
import imgchatbox from "../src/assets/images/chatai.png";

export default function Chatboxai() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true); // Bắt đầu loading
    
    try {
      const payload = {
        message: input,
      };
      const response = await fetch("https://localhost:7048/api/ChatBot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Lỗi server:", errorText);
        throw new Error(`Lỗi: ${response.status}`);
      }
      const data = await response.json();
      setMessages((prev) => [...prev, { from: "ai", text: data.answer }]);
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err.message);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Không thể kết nối API hoặc lỗi từ server." },
      ]);
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  // Xử lý phím Enter để gửi tin nhắn
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Tự động scroll xuống cuối khi messages thay đổi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <div className={styles.iconAI}>
        <button onClick={() => setOpen(!open)}>
          <img src={imgchatbox} alt="chatbox" />
        </button>
      </div>

      {open && (
        <div className={styles["chat-popup"]}>
          <div className={styles.header}>
            <h3>Trợ lý AI</h3>
            <button className={styles.closeButton} onClick={() => setOpen(false)}>×</button>
          </div>
          
          <div className={styles.messages}>
            {/* Lời chào khi không có tin nhắn */}
            {messages.length === 0 && (
              <div className={styles.welcomeMessage}>
                <h4>👋 Xin chào!</h4>
                <p>Tôi là trợ lý AI của FIRGUE SHOP. Tôi có thể giúp bạn:</p>
                <ul>
                  <li>Tìm kiếm sản phẩm</li>
                  <li>Giải đáp thắc mắc về đơn hàng</li>
                  <li>Hướng dẫn cách thanh toán</li>
                  <li>Tư vấn chọn mua sản phẩm phù hợp</li>
                </ul>
                <p>Hãy đặt câu hỏi cho tôi!</p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.messageItem} ${
                  msg.from === "user" ? styles.userMessage : styles.aiMessage
                }`}
              >
                <div className={styles.messageContent}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Hiển thị loading khi đang chờ phản hồi */}
            {isLoading && (
              <div className={`${styles.messageItem} ${styles.aiMessage}`}>
                <div className={`${styles.messageContent} ${styles.loadingMessage}`}>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className={styles.inputArea}>
            <textarea
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? 'Đang gửi...' : 'Gửi'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
