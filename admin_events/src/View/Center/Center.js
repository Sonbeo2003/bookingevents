import React, { useEffect, useState } from "react";
import "./Center.css";
import AddCenter from "./AddCenter";
import EditCenter from "./EditCenter";
import "@fortawesome/fontawesome-free/css/all.min.css";
import url from "../../ipconfig";
import { toast, ToastContainer } from "react-toastify";
import useDebounce from "../../common/useDebounce";

const Center = () => {
  const [centers, setCenters] = useState([]); 
  const [error, setError] = useState(null); 
  const [showAddCenter, setShowAddCenter] = useState(false);
  const [showEditCenter, setShowEditCenter] = useState(false);
  const [CenterToEdit, setCenterToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filteredCenters, setFilteredCenters] = useState([]);

  const debounceKeyword = useDebounce(searchTerm, 500);

  // Hàm load danh sách trung tâm từ API
  const loadCenters = async () => {
    try {
      const response = await fetch(`${url}/API_Events/gettrungtam.php`); // Đường dẫn đến file PHP API
      if (!response.ok) {
        throw new Error("Lỗi khi tải danh sách trung tâm");
      }
      const data = await response.json();
      setCenters(data); // Lưu danh sách trung tâm vào state
      setFilteredCenters(data); // Cập nhật danh sách trung tâm đã lọc
    } catch (error) {
      setError(error.message);
    }
  };

  // Hàm tìm kiếm dịch vụ
  const searchCenter = async (searchTerm) => {
    try {
      const response = await fetch(
        `${url}/API_Events/timkiemtrungtam.php?searchTerm=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Lỗi khi tìm kiếm người dùng");
      }
      const data = await response.json();
      setFilteredCenters(data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      alert("Không thể tìm kiếm người dùng. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    loadCenters(); // Gọi API khi component được load
  }, []);

  useEffect(() => {
    if (debounceKeyword.trim() === "") {
      setFilteredCenters(centers);
    } else {
      searchCenter(debounceKeyword); 
    }
  }, [debounceKeyword, centers]);

  const editCenter = (Center) => {
    setCenterToEdit(Center);
    setShowEditCenter(true);
  };

  const deleteCenter = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có muốn xóa trung tâm này không?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`${url}/API_Events/xoatrungtam.php?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const result = await response.json();
          toast.success(result.message);
          loadCenters();
        } else {
          const errorResult = await response.json();
          alert("Có lỗi xảy ra khi xóa trung tâm: " + errorResult.message);
        }
      } catch (error) {
        console.error("Lỗi khi xóa trung tâm:", error);
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div id="center" className="center-content-section">
      <ToastContainer style={{top:70}}/>
      {/* Hiển thị lỗi nếu có */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Thanh tìm kiếm */}
      <div className="center-search-container">
        <i className="fas fa-search center-search-icon"></i>
        <input
          type="text"
          placeholder="Tìm kiếm trung tâm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="center-search-input"
        />
      </div>

      {/* Hiển thị danh sách trung tâm */}
      {filteredCenters.length > 0 ? (
        <table className="center-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Địa điểm</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>X-Location</th>
              <th>Y-Location</th>
              <th>Hình ảnh</th>
              <th>Mô tả</th>
              <th>Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {filteredCenters.map((center) => (
              <tr key={center.idtrungtam}>
                <td>{center.idtrungtam}</td>
                <td>{center.tentrungtam}</td>
                <td>{center.diachi}</td>
                <td>{center.sodienthoai}</td>
                <td>{center.email}</td>
                <td>{center.X_location}</td>
                <td>{center.Y_location}</td>
                <td>
                  <img
                    src={center.hinhanh}
                    alt="Hình ảnh trung tâm"
                    style={{ width: "100px", height: "100px" }}
                  />
                </td>
                <td>{center.mota}</td>
                <td>
                  <button
                    onClick={() => editCenter(center)}
                    className="center-button center-button-edit"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => deleteCenter(center.idtrungtam)}
                    className="center-button center-button-delete"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có trung tâm nào.</p>
      )}
      <button
        className="center-floating-btn"
        onClick={() => setShowAddCenter(true)}
      >
        +
      </button>

      {showAddCenter && (
        <AddCenter
          closeForm={() => setShowAddCenter(false)}
          onCenterAdded={loadCenters}
        />
      )}

      {showEditCenter && (
        <EditCenter
          CenterToEdit={CenterToEdit}
          closeForm={() => setShowEditCenter(false)}
          onCenterUpdated={loadCenters}
        />
      )}
    </div>
  );
};

export default Center;
