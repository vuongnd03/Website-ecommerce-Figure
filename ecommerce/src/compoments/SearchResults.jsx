import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from "../Css/searchResults.module.css";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`https://localhost:7048/api/Products/search?keyword=${encodeURIComponent(keyword)}`);
        setResults(response.data);
        setError(null);
      } catch (error) {
        console.error("Search failed:", error);
        setError("Không thể tải kết quả tìm kiếm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword]);

  return (
    <div className={styles.searchResultsPage}>
      
      <div className={styles.container}>
        <h1 className={styles.title}>Kết quả tìm kiếm cho: "{keyword}"</h1>
        
        {loading ? (
          <div className={styles.loading}>Đang tải kết quả...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : results.length === 0 ? (
          <div className={styles.noResults}>
            <p>Không tìm thấy sản phẩm nào phù hợp với từ khóa "{keyword}"</p>
            <p>Vui lòng thử lại với từ khóa khác hoặc xem các sản phẩm của chúng tôi</p>
            <Link to="/san-pham" className={styles.browseProducts}>Xem tất cả sản phẩm</Link>
          </div>
        ) : (
          <div className={styles.resultsGrid}>
            {results.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className={styles.productCard}>
                <div className={styles.productImageContainer}>
                  {product.imagePath && (
                    <img
                      src={`https://localhost:7048${product.imagePath}`}
                      alt={product.name}
                      className={styles.productImage}
                    />
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productPrice}>{product.price.toLocaleString()}₫</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}