import React, { useState, useEffect } from 'react';
import './EditCenter.css';
import url from '../../ipconfig';
import { toast } from "react-toastify";

function EditCenter({ CenterToEdit, closeForm, onCenterUpdated }) {
  const [center, setCenter] = useState(CenterToEdit); // Khởi tạo state center từ CenterToEdit

  useEffect(() => {
    setCenter(CenterToEdit); // Cập nhật center mỗi khi CenterToEdit thay đổi
  }, [CenterToEdit]);

  //cập nhật giá trị của trung tam
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCenter({ ...center, [name]: value }); // Cập nhật state center khi giá trị input thay đổi
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gọi API PHP để cập nhật trung tâm
      const response = await fetch(`${url}/API_Events/suatrungtam.php`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          idtrungtam: center.idtrungtam,
          tentrungtam: center.tentrungtam,
          mota: center.mota,
          diachi: center.diachi,
          sodienthoai: center.sodienthoai,
          email: center.email,
          X_location: center.X_location,
          Y_location: center.Y_location,
          hinhanh: center.hinhanh
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success(result.message);
        onCenterUpdated(); // Gọi callback để cập nhật danh sách trung tam
        closeForm(); // Đóng modal sau khi cập nhật thành công
      } else {
        alert(`Lỗi khi cập nhật trung tam: ${result.message}`);
      }
    } catch (error) {
      console.error('Lỗi khi kết nối tới server:', error);
      toast.error('Đã xảy ra lỗi khi kết nối tới server.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>&times;</span>
        <h3>Sửa Trung Tâm</h3>
        <form onSubmit={handleSubmit}>
          <label>ID Trung Tâm:</label>
          <input type="text" name="idtrungtam" value={center.idtrungtam} readOnly />

          <label>Tên Trung Tâm:</label>
          <input type="text" name="tentrungtam" value={center.tentrungtam} onChange={handleChange} required />

          <label>Địa Chỉ:</label>
          <input type="text" name="diachi" value={center.diachi} onChange={handleChange} required />

          <label>Số Điện Thoại:</label>
          <input type="text" name="sodienthoai" value={center.sodienthoai} onChange={handleChange} required />

          <label>X-loaction:</label>
          <input type="text" name="x_location" value={center.X_location} onChange={handleChange} required />

          <label>Y-location:</label>
          <input type="text" name="y_location" value={center.Y_location} onChange={handleChange} required />

          <label>Mô Tả:</label>
          <input type="text" name="mota" value={center.mota} onChange={handleChange} required />

          <label>Hình Ảnh:</label>
          <input type="text" name="hinhanh" value={center.hinhanh} onChange={handleChange} required />

          <button type="submit">Cập Nhật Trung Tâm</button>
        </form>
      </div>
    </div>
  );
}

export default EditCenter;
