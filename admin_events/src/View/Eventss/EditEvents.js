import React, { useState, useEffect } from 'react';
import './EditEvents.css';
import url from '../../ipconfig';
import { toast } from "react-toastify";

function EditEvents({ serviceToEdit, closeForm, onServiceUpdated }) {
  const [service, setService] = useState(serviceToEdit);
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [centers, setCenters] = useState([]); // Danh sách trung tâm

  useEffect(() => {
    setService(serviceToEdit); // Cập nhật service mỗi khi serviceToEdit thay đổi
    fetchUsers();
    fetchCenters();
  }, [serviceToEdit]);

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${url}/API_Events/getuser.php`);
      const result = await response.json();
      setUsers(result);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    }
  };

  // Lấy danh sách trung tâm
  const fetchCenters = async () => {
    try {
      const response = await fetch(`${url}/API_Events/gettrungtam.php`);
      const result = await response.json();
      setCenters(result);
    } catch (error) {
      console.error("Lỗi khi tải danh sách trung tâm:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const formattedValue =
      (name === "starttime" || name === "endtime") && value.length === 5
        ? `${value}:00`
        : value;

    setService({ ...service, [name]: formattedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/API_Events/suathucung.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        onServiceUpdated();
        closeForm();
      } else {
        toast.error("Có lỗi xảy ra: " + result.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật sự kiện:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const formatTime = (time) => time ? time.slice(0, 5) : '';

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeForm}>&times;</span>
        <h3>Sửa Sự Kiện</h3>
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
            className="time-input"
            type="time"
            name="starttime"
            value={formatTime(service.starttime)}
            onChange={handleChange}
            required
          />

          <label>Thời gian kết thúc:</label>
          <input
            className="time-input"
            type="time"
            name="endtime"
            value={formatTime(service.endtime)}
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

          <button type="submit">Cập nhật sự kiện</button>
        </form>
      </div>
    </div>
  );
}

export default EditEvents;
