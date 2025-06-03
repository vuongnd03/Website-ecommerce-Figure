import { Link, useNavigate } from 'react-router-dom';
import styles from "../Css/trangchu.module.css";
import logo from '../assets/images/tải xuống.png';
import icons from '../assets/icons/icons8-search-50.png';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MenuTrangchu() {
  const [fullname, setFullname] = useState('');
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedFullname = localStorage.getItem('fullname');
    if (savedFullname) {
      setFullname(savedFullname);
    }
  }, []);

  const renderUsername = () => {
    return fullname.length > 16 ? fullname.substring(0, 16) + '...' : fullname;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullname');
    localStorage.removeItem('id');
    setFullname('');
    navigate('/login');
  };

  const SearchBar = async (value) => {
    setKeyword(value);
    if (value.trim() === '') {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    try {
      const response = await axios.get(`https://localhost:7048/api/Products/search?keyword=${encodeURIComponent(value)}`);
      setResults(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleSearchButtonClick = () => {
    if (keyword.trim() !== '') {
      navigate(`/search-results?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && keyword.trim() !== '') {
      navigate(`/search-results?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <div className={styles.trangchu}>
      <nav>
        <ul>
          <img src={logo} alt="logo" className={styles.logo} />
          <li><Link to="/">Trang Chủ</Link></li>
          <li><Link to="/san-pham">Sản Phẩm</Link></li>
          <li><Link to="/gioi-thieu">Giới Thiệu</Link></li>
          <li><Link to="/lien-he">Liên hệ</Link></li>
          <li><Link to="/hotro">Hỗ trợ</Link></li>

          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={keyword}
              onChange={(e) => SearchBar(e.target.value)}
              onFocus={() => keyword && setShowDropdown(true)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={styles.searchInput}/>
            <button 
              className={styles.searchBtn} 
              onClick={handleSearchButtonClick}>
              <img src={icons} alt="search" />
            </button>
            {showDropdown && results.length > 0 && (
              <div className={styles.dropdown}>
                {results.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className={styles.dropdownItem}
                  onMouseDown={(e) => e.preventDefault()}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {item.imagePath && (
                    <img
                      src={`https://localhost:7048${item.imagePath}`}
                      alt={item.name}
                      className={styles.productImage}
                    />
                  )}
                  <div className={styles.productInfo}>
                    <div className={styles.productName}>{item.name}</div>
                    <div className={styles.price}>{item.price.toLocaleString()}₫</div>
                  </div>
                </Link>
              ))}

              </div>
            )}
          </div>

          {!fullname ? (
            <>
              <li><Link to="/login">Đăng Nhập</Link></li>
              <li><Link to="/register">Đăng Ký</Link></li>
            </>
          ) : (
            <>
              <li className={styles.fullname}>Hi, {renderUsername()}</li>
              <li><button onClick={handleLogout} className={styles.logoutBtn}>Thoát</button></li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
