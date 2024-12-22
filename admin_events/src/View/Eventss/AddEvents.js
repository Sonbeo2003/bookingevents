import React, { useState, useEffect } from 'react';
import './AddEvents.css';
import url from '../../ipconfig';
import { toast } from "react-toastify";

function AddEvents({ closeForm, onServiceAdded }) {
  const [service, setService] = useState({
    tensukien: '',
    idnguoidung: '',
    loaisukien: '',
    trungtam: '',
    starttime: '',
    endtime: '',
    trangthai: ''
  });

  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [centers, setCenters] = useState([]); // Danh sách trung tâm

  // Lấy dữ liệu người dùng và trung tâm khi component được render
  useEffect(() => {
    fetchUsers();
    fetchCenters();
  }, []);

  // Hàm lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${url}/API_Events/getuser.php`);
      const result = await response.json();
      setUsers(result); // Lưu danh sách người dùng vào state
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    }
  };

  // Hàm lấy danh sách trung tâm
  const fetchCenters = async () => {
    try {
      const response = await fetch(`${url}/API_Events/gettrungtam.php`);
      const result = await response.json();
      setCenters(result); // Lưu danh sách trung tâm vào state
    } catch (error) {
      console.error("Lỗi khi tải danh sách trung tâm:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Xử lý định dạng thời gian để đảm bảo có giây (HH:MM:SS)
    const formattedValue =
      (name === "starttime" || name === "endtime") && value.length === 5
        ? `${value}:00`
        : value;

    setService({ ...service, [name]: formattedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Dữ liệu gửi đi:", service); // Kiểm tra dữ liệu

    try {
      const response = await fetch(`${url}/API_Events/themthucung.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      });

      const result = await response.json();
      console.log("ok",response.text); // Kiểm tra kết quả từ API

      if (response.ok) {
        toast.success(result.message); // Hiển thị thông báo thành công
        onServiceAdded(); // Gọi callback để tải lại danh sách dịch vụ
        closeForm();
        setService({
          tensukien: '',
          idnguoidung: '',
          loaisukien: '',
          trungtam: '',
          starttime: '',
          endtime: '',
          trangthai: ''
        });
      } else {
        toast.error("Có lỗi xảy ra: " + result.message); // Hiển thị thông báo lỗi nếu có
      }
    } catch (error) {
      console.error('Lỗi khi thêm sự kiện:', error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>&times;</span>
        <h3>Thêm Sự Kiện</h3>
        <form onSubmit={handleSubmit}>
          <label>Tên Sự Kiện:</label>
          <input
            type="text"
            name="tensukien"
            value={service.tensukien}
            onChange={handleChange}
            required
          />

          <label>Người dùng:</label>
          <select
            name="idnguoidung"
            value={service.idnguoidung}
            onChange={handleChange}
            required
          >
            <option value="">Chọn người dùng...</option>
            {users.map((user) => (
              <option key={user.idnguoidung} value={user.idnguoidung}>
                {user.tennguoidung}
              </option>
            ))}
          </select>

          <label>Loại sự kiện:</label>
          <input
            type="text"
            name="loaisukien"
            value={service.loaisukien}
            onChange={handleChange}
            required
          />

          <label>Trung tâm:</label>
          <select
            name="trungtam"
            value={service.trungtam}
            onChange={handleChange}
            required
          >
            <option value="">Chọn trung tâm...</option>
            {centers.map((center) => (
              <option key={center.idtrungtam} value={center.idtrungtam}>
                {center.tentrungtam}
              </option>
            ))}
          </select>

          <label>Thời gian bắt đầu:</label>
          <input
            class="time-input"
            type="time"
            name="starttime"
            value={service.starttime}
            onChange={handleChange}
            required
          />

          <label>Thời gian kết thúc:</label>
          <input
            class="time-input"
            type="time"
            name="endtime"
            value={service.endtime}
            onChange={handleChange}
            required
          />

          <label>Trạng thái:</label>
          <input
            type="text"
            name="trangthai"
            value={service.trangthai}
            onChange={handleChange}
            required
          />

          <button type="submit">Thêm Sự Kiện</button>
        </form>
      </div>
    </div>
  );
}

export default AddEvents;
