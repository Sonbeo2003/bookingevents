import React, { useEffect, useState } from "react";
import "./Events.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import url from "../../ipconfig";
import { toast, ToastContainer } from "react-toastify";
import useDebounce from "../../common/useDebounce";
import axios from "axios";

import AddEvents from "./AddEvents";
import EditEvents from "./EditEvents";

function Events() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [showEditService, setShowEditService] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);

  const debounceKeyword = useDebounce(searchTerm, 500);

  const loadServices = async () => {
    try {
      const response = await fetch(`${url}/API_Events/getallsukien.php`);
      if (!response.ok) {
        throw new Error("Lỗi khi tải dữ liệu");
      }
      const data = await response.json();
      setServices(data);
      setFilteredServices(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      alert(
        "Không thể tải danh sách dịch vụ. Vui lòng kiểm tra kết nối hoặc dữ liệu."
      );
    }
  };

  // Hàm tìm kiếm dịch vụ
  const searchServices = async (searchTerm) => {
    try {
      const response = await fetch(
        `${url}/API_Events/timkiemsukien.php?searchTerm=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Lỗi khi tìm kiếm người dùng");
      }
      const data = await response.json();
      setFilteredServices(data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      alert("Không thể tìm kiếm người dùng. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (debounceKeyword.trim() === "") {
      setFilteredServices(services); // Nếu ô tìm kiếm rỗng, hiển thị tất cả dịch vụ
    } else {
      searchServices(debounceKeyword); // Gọi hàm tìm kiếm người dùng
    }
  }, [debounceKeyword, services]);

  const editService = (service) => {
    setServiceToEdit(service);
    setShowEditService(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa trung tâm này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${url}/API_Events/xoathucung.php`, {
        data: { idthucung: id },
      });
      setServices(services.filter((service) => service.idthucung !== id));
    } catch (error) {
      console.error("Error deleting center:", error);
    }
  };


  // Hàm format giá tiền
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Hàm format giờ
  const formatTimeWithText = (time) => {
    if (!time) return "";
  
    const [hours, minutes] = time.split(":").map(Number);
  
    let period = "Sáng";
    if (hours >= 12) period = "Chiều";
    if (hours >= 18) period = "Tối";
  
    const formattedHours = hours > 12 ? hours - 12 : hours;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} - ${period}`;
  };
  

  return (
    <div id="services" className="services-content-section">
      <ToastContainer style={{top:70}}/>
      {/* Thanh tìm kiếm với icon */}
      <div className="services-search-container">
        <i className="fas fa-search services-search-icon"></i>
        <input
          type="text"
          placeholder="Tìm kiếm sự kiện..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="services-search-input"
        />
      </div>
      <div id="servicesTable">
        {filteredServices.length > 0 ? (
          <table className="services-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên sự kiện</th>
                {/* <th>Tên khách hàng</th> */}
                <th>loại sự kiện</th>
                <th>Địa điểm</th>
                <th>Thời gian thực hiện</th>
                <th>Thời gian kết thúc</th>
                <th>Trạng thái</th>
                <th>Chức năng</th>
              </tr>
            </thead>
            <tbody> 
              {filteredServices.map((service) => (
                <tr key={service.idthucung}>
                  <td>{service.idthucung}</td>
                  <td>{service.tensukien}</td>
                  {/* <td>{service.tennguoidung}</td> */}
                  <td>{service.loaisukien}</td>
                  <td>{service.tentrungtam}</td>
                  <td>{formatTimeWithText(service.starttime)}</td>
                  <td>{formatTimeWithText(service.endtime)}</td>
                  <td>{service.trangthai}</td>
                  <td>
                    <button
                      className="services-edit"
                      onClick={() => editService(service)}
                    >
                      Sửa
                    </button>
                    <button
                      className="services-delete"
                      onClick={() => handleDelete(service.idthucung)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có dịch vụ nào</p>
        )}
      </div>

      <button
        className="services-floating-btn"
        onClick={() => setShowAddService(true)}
      >
        +
      </button>

      {showAddService && (
        <AddEvents
          closeForm={() => setShowAddService(false)}
          onServiceAdded={loadServices}
        />
      )}

      {showEditService && (
        <EditEvents
          serviceToEdit={serviceToEdit}
          closeForm={() => setShowEditService(false)}
          onServiceUpdated={loadServices}
        />
      )}
    </div>
  );
}

export default Events;
