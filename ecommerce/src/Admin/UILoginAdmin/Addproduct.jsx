import { useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import styles from "./Addproduct.module.css";
export default function Addproduct({ onProductAdded }) {
  const { fetchProducts } = useOutletContext();
  const [product, setProduct] = useState({
    id:"",
    type:"",
    name: "",
    price: 0,
    stock:0,
    imageFile: "",
    description: "",
    imagePreview: null,
    subImages: [null, null, null, null, null, null], 
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("Id",product.id);
      formData.append("Type",product.type);
      formData.append("Name", product.name);
      formData.append("Price", product.price);
      formData.append("Stock", product.stock);
      formData.append("ImagePath",product.imageFile);
      formData.append("Description", product.description);
      var token = localStorage.getItem("token");
      const response = await axios.post("https://localhost:7048/api/Products/add", formData, {
        headers: { "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`  // Thêm token vào header
         },
        
      });

      setSuccessMessage("Thêm sản phẩm thành công!");
      setProduct({
        id:"",
        type:"",
        name: "",
        price: 0,
        stock:0,
        imageFile: "",
        description: "",
        imagePreview: null,
        subImages: [null, null, null, null, null, null],
        
      });

      fetchProducts();
      if (onProductAdded) onProductAdded(response.data.product);
      // Gửi ảnh phụ sau khi thêm sản phẩm thành công
if (product.subImages.length === 6) {
  const subFormData = new FormData();
  subFormData.append("Id", product.id);
  product.subImages.forEach((file) => {
    subFormData.append("ImagePath", file);
  });

  try {
    await axios.post("https://localhost:7048/api/Products/AddSubImage", subFormData, {
      headers: { "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`  // Thêm token vào header
       }
    });
    console.log("Đã thêm ảnh phụ thành công");
  } catch (err) {
    if (error.response && error.response.status === 401) {
                // Token hết hạn hoặc không hợp lệ
                localStorage.removeItem('token');
                // Hiển thị thông báo hoặc chuyển hướng về trang đăng nhập
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                window.location.href = '/admin'; // hoặc route login của bạn
            } 
    console.error("Lỗi khi thêm ảnh phụ:", err);
  }
}
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      setErrorMessage(
        error.response?.data?.message || "Không thể thêm sản phẩm. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleSubImageChange = (e, index) => {
  const file = e.target.files[0];
  if (file) {
    const updatedSubImages = [...product.subImages];
    updatedSubImages[index] = file;
    setProduct({ ...product, subImages: updatedSubImages });
  }
};
  return (
    <div className={styles.addProductContainer}>
      <h2>Thêm sản phẩm mới</h2>

      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

      <form onSubmit={handleSubmit} className={styles.productForm}>
      <div className={styles.formGroup}>
          <label htmlFor="id">Id sản phẩm:</label>
          <input
            type="text"
            id="id"
            name="id"
            value={product.id}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
        <div>
          <label htmlFor="type">Loại sản phẩm:</label>
          <select
            id="type"
            name="type"
            value={product.type}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn loại sản phẩm --</option>
            <option value="Sản Phẩm được yêu thích">Sản phẩm được yêu thích</option>
            <option value="One Piece">One Piece</option>
            <option value="Naruto">Naruto</option>
            <option value="Dragon Ball">Dragon Ball</option>
            <option value="kitmestu No Yaiba">Kitmestu No Yaiba</option>
            <option value="Black Wukong">Black WuKong</option>
            <option value="Mô hình motor">Mô hình motor</option>
            <option value="Mô hình xe thể thao">Mô hình 4 bánh thể thao</option>
            <option value="Mô hình xe tăng">Mô hình xe tăng</option>
            <option value="Mô hình Gundam">Mô hình Gundam</option>
            <option value="Mô hình xe tải">Mô hình xe tải</option>
          </select>
        </div>
      </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">Tên sản phẩm:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price">Giá:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="stock">Tồn kho:</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Mô tả:</label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="4"
          />
        </div>
        <div className={styles.imageUploadBox}>
          {product.imagePreview ? (
            <img src={product.imagePreview} alt="Preview" className={styles.previewImage} />
          ) : (
            <div
              className={styles.plusIcon}
              onClick={() => document.getElementById("imageInput").click()}
            >
              +
            </div>
          )}
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const imagePreview = URL.createObjectURL(file);
                setProduct((prev) => ({
                  ...prev,
                  imagePreview,
                  imageFile: file
                }));
              }
            }}
          />
        </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
  {product.subImages.map((img, index) => (
    <div
      key={index}
      style={{
        width: "100px",
        height: "100px",
        border: "2px dashed #ccc",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
      }}
      onClick={() => document.getElementById(`subImageInput${index}`).click()}
    >
      <input
        type="file"
        accept="image/*"
        id={`subImageInput${index}`}
        style={{ display: "none" }}
        onChange={(e) => handleSubImageChange(e, index)}
      />
      {img ? (
        <img
          src={URL.createObjectURL(img)}
          alt={`sub-${index}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span style={{ fontSize: "32px", color: "#aaa" }}>+</span>
      )}
    </div>
  ))}
</div>


        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Đang xử lý..." : "Thêm sản phẩm"}
        </button>
      </form>
    </div>
  );
}
