import React, { useState } from 'react';
import './AddCenter.css'; 
import url from '../../ipconfig';
import { toast } from "react-toastify";

function AddCenter({ closeForm, onCenterAdded }) {
  const [center, setCenter] = useState({
    tentrungtam: '',
    mota: '',
    diachi: '',
    sodienthoai: '',
    email: '',
    x_location: '',
    y_location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCenter({ ...center, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Dữ liệu gửi đi:", center); // Kiểm tra dữ liệu
  
    try {
      const response = await fetch(`${url}/API_Events/themtrungtam.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(center),
      });
  
      const result = await response.json();
      console.log(result); // Kiểm tra kết quả từ API
  
      if (response.ok) {
        toast.success(result.message); // Hiển thị thông báo thành công
        onCenterAdded(); // Gọi callback để tải lại danh sách dịch vụ
        closeForm();
        setCenter({
            tentrungtam: '',
            mota: '',
            diachi: '',
            sodienthoai: '',
            email: '',
            x_location: '',
            y_location: '',
            hinhanh: ''
        });
      } else {
        alert("Có lỗi xảy ra: " + result.message); // Hiển thị thông báo lỗi nếu có
      }
    } catch (error) {
      console.error('Lỗi khi thêm trung tâm:', error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };
  
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>&times;</span>
        <h3>Thêm Trung Tâm</h3>
        <form onSubmit={handleSubmit}>
          <label>Tên Trung Tâm:</label>
          <input type="text" name="tentrungtam" value={center.tentrungtam} onChange={handleChange} required />

          <label>Email:</label>
          <input type="text" name="email" value={center.email} onChange={handleChange} required />

          <label>Số Điện Thoại:</label>
          <input type="text" name="sodienthoai" value={center.sodienthoai} onChange={handleChange} required />
          
          <label>Địa Chỉ:</label>
          <input type="text" name="diachi" value={center.diachi} onChange={handleChange} required />

          <label>Mô Tả:</label>
          <input type="text" name="mota" value={center.mota} onChange={handleChange} required />
          
          <label>X_location:</label>
          <input type="text" name="x_location" value={center.x_location} onChange={handleChange} required />
          
          <label>Y_location:</label>
          <input type="text" name="y_location" value={center.y_location} onChange={handleChange} required />

          <label>Hình Ảnh:</label>
          <input type="text" name="hinhanh" value={center.hinhanh} onChange={handleChange} required />

          <button type="submit">Thêm Trung Tâm</button>
        </form>
      </div>
    </div>
  );
}

export default AddCenter;
