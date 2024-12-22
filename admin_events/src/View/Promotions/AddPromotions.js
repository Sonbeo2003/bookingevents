import React, { useState } from 'react';
import './AddPromotions.css';
import url from '../../ipconfig';

function AddPromotion({ closeForm, onPromotionAdded }) {
  const [promotion, setPromotion] = useState({
    tenkhuyenmai: '',
    mota: '',
    giatri: '',
    dieukien: '',
    ngaybatdau: '',
    ngayketthuc: '',
    trangthai: '0' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion({ ...promotion, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Dữ liệu gửi đi:", promotion); // Kiểm tra dữ liệu
    
    try {
      const response = await fetch(`${url}/API_Events/themkhuyenmai.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promotion),
      });
  
      const result = await response.json();
      console.log(result); // Kiểm tra kết quả từ API
  
      if (response.ok) {
        alert(result.message); // Hiển thị thông báo thành công
        onPromotionAdded(); // Gọi callback để tải lại danh sách khuyến mãi
        closeForm();
        setPromotion({
          tenkhuyenmai: '',
          mota: '',
          giatri: '',
          dieukien: '',
          ngaybatdau: '',
          ngayketthuc: '',
          trangthai: '1' // Đặt lại giá trị mặc định cho trạng thái
        });
      } else {
        alert("Có lỗi xảy ra: " + result.message); // Hiển thị thông báo lỗi nếu có
      }
    } catch (error) {
      console.error('Lỗi khi thêm khuyến mãi:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };
  
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>&times;</span>
        <h3>Thêm Khuyến Mãi</h3>
        <form onSubmit={handleSubmit}>
          <label>Tên Khuyến Mãi:</label>
          <input type="text" name="tenkhuyenmai" value={promotion.tenkhuyenmai} onChange={handleChange} required />

          <label>Mô Tả:</label>
          <textarea name="mota" value={promotion.mota} onChange={handleChange} required />

          <label>Giá Trị (%):</label>
          <input type="number" name="giatri" value={promotion.giatri} onChange={handleChange} required />

          <label>Điều Kiện:</label>
          <textarea name="dieukien" value={promotion.dieukien} onChange={handleChange} required />

          <label>Ngày Bắt Đầu:</label>
          <input type="date" name="ngaybatdau" value={promotion.ngaybatdau} onChange={handleChange} required />

          <label>Ngày Kết Thúc:</label>
          <input type="date" name="ngayketthuc" value={promotion.ngayketthuc} onChange={handleChange} required />

          <label>Trạng Thái:</label>
          <select className='promotion-select' name="trangthai" value={promotion.trangthai} onChange={handleChange} required>
            <option value="1">Hoạt Động</option>
            <option value="0">Không Hoạt Động</option>
          </select>

          <button type="submit">Thêm Khuyến Mãi</button>
        </form>
      </div>
    </div>
  );
}

export default AddPromotion;
