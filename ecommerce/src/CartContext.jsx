import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
const CartContext = createContext();
export const CartProvider = ({ children }) => {
    const userId = localStorage.getItem("id"); 
    const [cartCount, setCartCount] = useState(0);
    useEffect(() => {
        if (userId) {
            axios.get(`https://localhost:7048/api/Products/getcart/${userId}`)
                .then((res) => {
                    const cartItems = res.data; 
                    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
                    setCartCount(totalQuantity);
                })
                .catch((err) => {
                    console.error("Lỗi khi lấy giỏ hàng:", err);
                });
        }
    }, []);
    const addToCart = () => {
        setCartCount((prev) => prev + 1);
    };
    return (
        <CartContext.Provider value={{ cartCount, setCartCount, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};
export const useCart = () => useContext(CartContext);
