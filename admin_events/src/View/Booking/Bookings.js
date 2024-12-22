import React, { useEffect, useState } from "react";
import "./Booking.css";
import url from "../../ipconfig";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { Tabs, Tab } from "@mui/material";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [value, setValue] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [bookingIdToCancel, setBookingIdToCancel] = useState(null);

  const [startDate, setStartDate] = useState(""); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(""); // Ngày kết thúc

  // Lọc lịch hẹn theo tab
  const filteredbookings = bookings.filter((bookings) => {
    if (value === 0 && bookings.trangthai === "0") return true; // Chưa xác nhận
    if (value === 1 && bookings.trangthai === "1") return true; // Đang thực hiện
    if (value === 2 && bookings.trangthai === "2") return true; // Hoàn thành
    if (value === 3 && bookings.trangthai === "3") return true; // Đã thanh toán
    if (value === 4 && bookings.trangthai === "4") return true; // Đã hủy
    return false;
  });

  // Load danh sách đặt lịch
  const loadBookings = async () => {
    try {
      const response = await fetch(`${url}/API_Events/Lichhen_Admin/getlichhen.php`);
      if (!response.ok) {
        throw new Error("Lỗi khi tải danh sách đặt lịch");
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast.error("Không thể tải danh sách đặt lịch. Vui lòng thử lại.");
    }
  };

  const filterByDate = async (startDate, endDate) => {
    console.log("Ngày bắt đầu:", startDate, "Ngày kết thúc:", endDate);

    // Kiểm tra và định dạng lại ngày
    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);

    if (
      isNaN(formattedStartDate.getTime()) ||
      isNaN(formattedEndDate.getTime())
    ) {
      toast.error("Ngày không hợp lệ!");
      return; // Dừng nếu ngày không hợp lệ
    }

    const isoStartDate = formattedStartDate.toISOString().split("T")[0];
    const isoEndDate = formattedEndDate.toISOString().split("T")[0];
    console.log("Ngày định dạng:", isoStartDate, isoEndDate);

    try {
      const response = await fetch(
        `${url}/API_Events/Lichhen_Admin/timkiemlichhen.php?startDate=${isoStartDate}&endDate=${isoEndDate}`
      );
      const data = await response.json();
      console.log("Kết quả API:", data);

      if (data.success) {
        setBookings(data.lichhen);
        toast.success("Tìm kiếm thành công");
      } else {
        setBookings([]); // Không có kết quả
        toast.error(
          data.message || "Không có lịch hẹn trong khoảng thời gian này."
        );
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      toast.error("Không thể tải danh sách đặt lịch. Vui lòng thử lại.");
    }
  };

  // Xác nhận đặt lịch
  const confirmBooking = async (idlichhen) => {
    try {
      const response = await fetch(
        `${url}/API_Events/Lichhen_Admin/xacnhanlichhen.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idlichhen }),
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi xác nhận lịch hẹn");
      }

      loadBookings();
      toast.success("Lịch hẹn đã được xác nhận!");
    } catch (error) {
      console.error("Lỗi khi xác nhận:", error);
      toast.error("Không thể xác nhận lịch hẹn. Vui lòng thử lại.");
    }
  };

  // Hoàn thành lịch hẹn
  const completeBooking = async (idlichhen) => {
    try {
      const response = await fetch(
        `${url}/API_Events/Lichhen_Admin/hoanthanhlichhen.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idlichhen }),
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi hoàn thành lịch hẹn");
      }
      loadBookings();
      toast.success("Lịch hẹn đã được hoàn thành");
    } catch (error) {
      console.error("Lỗi khi hoàn thành:", error);
      toast.error("Không thể hoàn thành lịch hẹn. Vui lòng thử lại.");
    }
  };

  // Thanh toán lịch hẹn
  const payBooking = async (idlichhen) => {
    try {
      const response = await fetch(
        `${url}/API_Events/Lichhen_Admin/Xacnhanthanhtoan.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idlichhen }),
        }
      );

      if (!response.ok) {
        throw new Error("Lỗi khi xác nhận thanh toán");
      }
      loadBookings();
      toast.success("Lịch hẹn đã được thanh toán");
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      toast.error("Không thể xác nhận thanh toán. Vui lòng thử lại.");
    }
  };

  // Hủy lịch hẹn
  const cancelBooking = async () => {
    try {
      const response = await fetch(`${url}/API_Events/Lichhen_Admin/huylichhen.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idlichhen: bookingIdToCancel,
          reason: cancelReason,
        }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi hủy lịch hẹn");
      }
      loadBookings();
      closeCancelModal();
      toast.success("Lịch hẹn đã được hủy");
    } catch (error) {
      console.error("Lỗi khi hủy lịch hẹn:", error);
      toast.error("Không thể hủy lịch hẹn. Vui lòng thử lại.");
    }
  };

  const openCancelModal = (idlichhen) => {
    setBookingIdToCancel(idlichhen);
    setIsModalOpen(true);
  };

  const closeCancelModal = () => {
    setIsModalOpen(false);
    setCancelReason("");
  };

  // Sắp xếp thứ tự useEffect
  useEffect(() => {
    loadBookings();
  }, []);

  // useEffect(() => {
  //   console.log("Start date:", startDate);
  //   console.log("End date:", endDate);
  //   console.log("Bookings:", bookings);
  //   console.log("Filtered bookings:", filteredbookings);
  // }, [startDate, endDate, bookings, filteredbookings]);

  // useEffect(() => {
  //   if (startDate && endDate) {
  //     filterByDate(startDate, endDate);
  //   } else {
  //     loadBookings();
  //   }
  // }, [startDate, endDate]);

  // const { confirm, cancel } = btnStatus(value);
  const convertTrangThai = (trangThai) => {
    const trangThaiMap = {
      0: "Chờ xác nhận",
      1: "Đang thực hiên",
      2: "Hoàn thành",
      3: "Đã thanh toán",
      4: "Đã hủy",
    };
    return trangThaiMap[trangThai] || "Không xác định";
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div id="bookings" className="booking-content-section">
      <ToastContainer style={{ top: 70 }} />

      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="date-filter-container">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
          />
          <label>Đến ngày:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
          />
          <button
            onClick={() => filterByDate(startDate, endDate)}
            className="search-button"
          >
            Tìm kiếm
          </button>
          <button onClick={() => loadBookings()} className="reload-button">
            Tải lại
          </button>
        </div>
      </div>

      {/* Tab chọn trạng thái */}
      <Tabs
        className="status-tabs"
        value={value}
        onChange={handleChange}
        aria-label="Appointment Status Tabs"
      >
        <Tab className="status-tab" label="Chưa xác nhận" />
        <Tab className="status-tab" label="Đang thực hiện" />
        <Tab className="status-tab" label="Hoàn thành" />
        <Tab className="status-tab" label="Đã thanh toán" />
        <Tab className="status-tab" label="Đã hủy" />
      </Tabs>

      <div id="bookingsTable">
        {filteredbookings.length > 0 ? (
          <table className="booking-table">
            <thead>
              <tr>
                <th>ID Lịch Hẹn</th>
                <th>Người Dùng</th>
                <th>Sự kiện</th>
                <th>Địa điểm</th>
                <th>Tên Dịch Vụ</th>
                <th>Ngày Hẹn</th>
                <th>Thời Gian Hẹn</th>
                <th>Trạng Thái</th>
                <th>Ngày Tạo</th>
                <th>Chức Năng</th>
              </tr>
            </thead>
            <tbody>
              {filteredbookings.map((booking) => (
                <tr key={booking.idlichhen}>
                  <td>{booking.idlichhen}</td>
                  <td>{booking.tennguoidung}</td>
                  <td>{booking.tenthucung}</td>
                  <td>{booking.tentrungtam}</td>
                  <td>{booking.tendichvu}</td>
                  <td>{booking.ngayhen}</td>
                  <td>{booking.thoigianhen}</td>
                  <td>{convertTrangThai(booking.trangthai)}</td>
                  <td>{booking.ngaytao}</td>
                  <td>
                    {booking.trangthai === "0" ? ( // Nếu trạng thái là "Chờ xác nhận"
                      <div className="booking-actions">
                        <button
                          onClick={() => confirmBooking(booking.idlichhen)}
                          className="confirm-button"
                        >
                          Xác Nhận
                        </button>
                        <button
                          onClick={() => openCancelModal(booking.idlichhen)}
                          className="cancel-button"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : booking.trangthai === "1" ? ( // Nếu trạng thái là "Đang thực hiện"
                      <button
                        onClick={() => completeBooking(booking.idlichhen)}
                        className="complete-button"
                      >
                        Hoàn thành
                      </button>
                    ) : booking.trangthai === "2" ? ( // Nếu trạng thái là "Hoàn thành"
                      <button
                        onClick={() => payBooking(booking.idlichhen)}
                        className="pay-button"
                      >
                        Xác nhận thanh toán
                      </button>
                    ) : (
                      <button
                        className="disabled-button"
                        disabled
                        style={{ backgroundColor: "gray", color: "white" }}
                      >
                        Không khả dụng
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có đặt lịch nào</p>
        )}
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Vui lòng nhập lý do hủy</h3>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Nhập lý do hủy..."
            ></textarea>
            <div className="modal-actions">
              <button
                className="button-modal-actions"
                onClick={cancelBooking}
                disabled={!cancelReason}
              >
                Xác nhận hủy
              </button>
              <button className="close-button" onClick={closeCancelModal}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
