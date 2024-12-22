import React, { useState, useEffect } from 'react';
// import './EditPromotion.css';
import url from '../../ipconfig';

function EditPromotion({ promotionToEdit, closeForm, onPromotionUpdated }) {
  const [promotion, setPromotion] = useState(promotionToEdit); // Khởi tạo với khuyến mãi được chỉnh sửa

  useEffect(() => {
    if (promotionToEdit) {
      setPromotion(promotionToEdit); 
    }
  }, [promotionToEdit]);

  // Cập nhật giá trị khuyến mãi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion((prev) => ({ ...prev, [name]: value })); // Sử dụng trạng thái trước đó để cập nhật
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting promotion data:', promotion);

    try {
      // Gọi API PHP để cập nhật khuyến mãi
      const response = await fetch(`${url}/API_Events/suakhuyenmai.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          idkhuyenmai: promotion.idkhuyenmai,
          tenkhuyenmai: promotion.tenkhuyenmai,
          mota: promotion.mota,
          giatri: promotion.giatri,
          ngaybatdau: promotion.ngaybatdau,
          ngayketthuc: promotion.ngayketthuc,
          dieukien: promotion.dieukien,
          trangthai: promotion.trangthai,
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(result.message); // Hiển thị thông báo từ API PHP
        onPromotionUpdated(); // Callback để làm mới danh sách khuyến mãi
        closeForm(); // Đóng modal sau khi thành công
      } else {
        alert(`Lỗi khi cập nhật khuyến mãi: ${result.message}`); // Hiển thị lỗi từ API
      }
    } catch (error) {
      console.error('Lỗi kết nối đến server:', error);
      alert('Đã xảy ra lỗi khi kết nối đến server.');
    }
  };

  // Rendering điều kiện cho các trường input khuyến mãi
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>&times;</span>
        <h3>Chỉnh Sửa Khuyến Mãi</h3>
        <form onSubmit={handleSubmit}>
          <label>ID Khuyến Mãi:</label>
          <input type="text" name="idkhuyenmai" value={promotion.idkhuyenmai} readOnly />

          <label>Tên Khuyến Mãi:</label>
          <input type="text" name="tenkhuyenmai" value={promotion.tenkhuyenmai} onChange={handleChange} required />

          <label>Mô Tả:</label>
          <input type="text" name="mota" value={promotion.mota} onChange={handleChange} required />

          <label>Giá Trị (%):</label>
          <input type="number" name="giatri" value={promotion.giatri} onChange={handleChange} required />

          <label>Ngày Bắt Đầu:</label>
          <input type="date" name="ngaybatdau" value={promotion.ngaybatdau} onChange={handleChange} required />

          <label>Ngày Kết Thúc:</label>
          <input type="date" name="ngayketthuc" value={promotion.ngayketthuc} onChange={handleChange} required />

          <label>Điều Kiện Áp Dụng:</label>
          <input type="text" name="dieukien" value={promotion.dieukien} onChange={handleChange} required />

          <label>Trạng Thái:</label>
          <select name="trangthai" value={promotion.trangthai} onChange={handleChange} required>
            <option value="1">Hoạt Động</option>
            <option value="0">Không Hoạt Động</option>
          </select>

          <button type="submit">Cập Nhật Khuyến Mãi</button>
        </form>
      </div>
    </div>
  );
}

export default EditPromotion;
