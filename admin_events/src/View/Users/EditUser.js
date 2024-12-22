import React, { useState, useEffect } from 'react';
// import './EditService.css';
import url from '../../ipconfig';
import { toast} from "react-toastify";

function EditUser({ userToEdit, closeForm, onUserUpdated }) {
  const [user, setUser] = useState(userToEdit); // Khởi tạo state user từ userToEdit

  useEffect(() => {
    setUser(userToEdit); // Cập nhật user mỗi khi userToEdit thay đổi
  }, [userToEdit]);

  //cập nhật giá trị của nguoi dung
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value }); // Cập nhật state user khi giá trị input thay đổi
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gọi API PHP để cập nhật nguoi dung
      const response = await fetch(`${url}/API_Events/suanguoidung.php`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          idnguoidung: user.idnguoidung,
          tennguoidung: user.tennguoidung,
          email: user.email,
          matkhau: user.matkhau,
          sodienthoai: user.sodienthoai,
          diachi: user.diachi,
          vaitro: user.vaitro
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success(result.message);
        onUserUpdated(); // Gọi callback để cập nhật danh sách 
        closeForm(); // Đóng modal sau khi cập nhật thành công
      } else {
        toast.error(`Lỗi khi cập nhật: ${result.message}`);
      }
    } catch (error) {
      console.error('Lỗi khi kết nối tới server:', error);
      alert('Đã xảy ra lỗi khi kết nối tới server.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>&times;</span>
        <h3>Sửa Người Dùng</h3>
        <form onSubmit={handleSubmit}>
          <label>ID Người Dùng:</label>
          <input type="text" name="idnguoidung" value={user.idnguoidung} readOnly />

          <label>Tên Người Dùng:</label>
          <input type="text" name="tennguoidung" value={user.tennguoidung} onChange={handleChange} required />

          <label>Email:</label>
          <input type="text" name="email" value={user.email} onChange={handleChange} required />

          {/* <label>Mật Khẩu:</label>
          <input type="text" name="matkhau" value={user.matkhau} onChange={handleChange} required /> */}

          <label>Số Điện Thoại:</label>
          <input type="text" name="sodienthoai" value={user.sodienthoai} onChange={handleChange} required />

          <label>Địa Chỉ:</label>
          <input type="text" name="diachi" value={user.diachi} onChange={handleChange} required />

          <label>Vai trò:</label>
          <select name="vaitro" value={user.vaitro} onChange={handleChange} required>
            <option value="0">0</option>
            <option value="1">1</option>
          </select>

          <button type="submit">Cập Nhật Người Dùng</button>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
