import React, { useState } from 'react';
import './AddServices.css'; 
import url from '../../ipconfig';
import { toast } from "react-toastify";

function AddService({ closeForm, onServiceAdded }) {
  const [service, setService] = useState({
    tendichvu: '',
    mota: '',
    gia: '',
    thoigianthuchien: '',
    hinhanh: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Dữ liệu gửi đi:", service); // Kiểm tra dữ liệu
  
    try {
      const response = await fetch(`${url}/API_Events/themdichvu.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      });
  
      const result = await response.json();
      console.log(result); // Kiểm tra kết quả từ API
  
      if (response.ok) {
        toast.success(result.message); // Hiển thị thông báo thành công
        onServiceAdded(); // Gọi callback để tải lại danh sách dịch vụ
        closeForm();
        setService({
          tendichvu: '',
          mota: '',
          gia: '',
          thoigianthuchien: '',
          hinhanh: ''
        });
      } else {
        alert("Có lỗi xảy ra: " + result.message); // Hiển thị thông báo lỗi nếu có
      }
    } catch (error) {
      console.error('Lỗi khi thêm dịch vụ:', error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };
  
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>&times;</span>
        <h3>Thêm Dịch Vụ</h3>
        <form onSubmit={handleSubmit}>
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

          <button type="submit">Thêm Dịch Vụ</button>
        </form>
      </div>
    </div>
  );
}

export default AddService;
