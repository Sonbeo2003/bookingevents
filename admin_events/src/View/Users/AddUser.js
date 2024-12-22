import React, { useState } from 'react';
import './AddUser.css';
import url from '../../ipconfig';
import { toast} from "react-toastify";

function AddUser({ closeForm, onUserAdded }) {
  const [user, setUser] = useState({
    tennguoidung: '',
    email: '',
    matkhau: '',
    sodienthoai: '',
    diachi: '',
    vaitro: '0' // Đặt giá trị mặc định cho vai trò là 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Dữ liệu gửi đi:", user); // Kiểm tra dữ liệu
  
    try {
      const response = await fetch(`${url}/API_Events/themnguoidung.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      const result = await response.json();
      console.log(result); // Kiểm tra kết quả từ API
  
      if (response.ok) {
        toast.success(result.message); // Hiển thị thông báo thành công
        onUserAdded(); // Gọi callback để tải lại danh sách dịch vụ
        closeForm();
        setUser({
          tennguoidung: '',
          email: '',
          matkhau: '',
          sodienthoai: '',
          diachi: '',
          vaitro: '0' // Đặt lại giá trị mặc định cho vai trò
        });
      } else {
        toast.error("Có lỗi xảy ra: " + result.message); // Hiển thị thông báo lỗi nếu có
      }
    } catch (error) {
      console.error('Lỗi khi thêm người dùng:', error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };
  
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>&times;</span>
        <h3>Thêm Người Dùng</h3>
        <form onSubmit={handleSubmit}>
          <label>Tên Người Dùng:</label>
          <input type="text" name="tennguoidung" value={user.tennguoidung} onChange={handleChange} required />

          <label>Email:</label>
          <input type="text" name="email" value={user.email} onChange={handleChange} required />

          <label>Mật Khẩu:</label>
          <input type="text" name="matkhau" value={user.matkhau} onChange={handleChange} required />

          <label>Số Điện Thoại:</label>
          <input type="text" name="sodienthoai" value={user.sodienthoai} onChange={handleChange} required />

          <label>Địa Chỉ:</label>
          <input type="text" name="diachi" value={user.diachi} onChange={handleChange} required />

          <label>Vai trò:</label>
          <select name="vaitro" value={user.vaitro} onChange={handleChange} required>
            <option value="0">0</option>
            <option value="1">1</option>
          </select>

          <button type="submit">Thêm Người Dùng</button>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
