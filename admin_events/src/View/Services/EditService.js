import React, { useState, useEffect } from 'react';
import './EditService.css';
import url from '../../ipconfig';
import { toast} from "react-toastify";
function EditService({ serviceToEdit, closeForm, onServiceUpdated }) {
  const [service, setService] = useState(serviceToEdit); // Khởi tạo state service từ serviceToEdit

  useEffect(() => {
    setService(serviceToEdit); // Cập nhật service mỗi khi serviceToEdit thay đổi
  }, [serviceToEdit]);

  //cập nhật giá trị của dịch vụ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value }); // Cập nhật state service khi giá trị input thay đổi
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gọi API PHP để cập nhật dịch vụ
      const response = await fetch(`${url}/API_Events/suadichvu.php`, {
        method: 'POST', // Hoặc 'PUT' tùy thuộc vào API của bạn
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          iddichvu: service.iddichvu,
          tendichvu: service.tendichvu,
          mota: service.mota,
          gia: service.gia,
          thoigianthuchien: service.thoigianthuchien,
          hinhanh: service.hinhanh
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success(result.message);
        onServiceUpdated(); // Gọi callback để cập nhật danh sách dịch vụ
        closeForm(); // Đóng modal sau khi cập nhật thành công
      } else {
        alert(`Lỗi khi cập nhật dịch vụ: ${result.message}`);
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
        <h3>Sửa Dịch Vụ</h3>
        <form onSubmit={handleSubmit}>
          <label>ID Dịch Vụ:</label>
          <input type="text" name="iddichvu" value={service.iddichvu} readOnly />

          <label>Tên Dịch Vụ:</label>
          <input type="text" name="tendichvu" value={service.tendichvu} onChange={handleChange} required />

          <label>Mô Tả:</label>
          <input type="text" name="mota" value={service.mota} onChange={handleChange} required />

          <label>Giá:</label>
          <input type="text" name="gia" value={service.gia} onChange={handleChange} required />

          <label>Thời Gian Thực Hiện:</label>
          <input type="text" name="thoigianthuchien" value={service.thoigianthuchien} onChange={handleChange} required />

          <label>Hình Ảnh:</label>
          <input type="text" name="hinhanh" value={service.hinhanh} onChange={handleChange} required />

          <button type="submit">Cập Nhật Dịch Vụ</button>
        </form>
      </div>
    </div>
  );
}

export default EditService;
