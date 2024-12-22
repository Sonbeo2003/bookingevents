import React, { useState, useEffect, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Users.css";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import url from "../../ipconfig";
import { toast, ToastContainer } from "react-toastify";
import useDebounce from "../../common/useDebounce";

const Users = () => {
  const [user, setUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUser, setFilteredUser] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const debounceKeyword = useDebounce(searchTerm, 500);

  const loggedInUserId = JSON.parse(localStorage.getItem("user"))?.idnguoidung;

  // Load danh sách người dùng
  const loadUser = useCallback(async () => {
    console.log("Logged-in User ID:", loggedInUserId);

    try {
      const response = await fetch(
        `${url}/API_Events/getnguoidung.php?idnguoidung=${loggedInUserId}`
      );
      if (!response.ok) {
        throw new Error("Lỗi khi tải dữ liệu");
      }
      const data = await response.json();
      setUser(data);
      setFilteredUser(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      alert(
        "Không thể tải danh sách người dùng. Vui lòng kiểm tra kết nối hoặc dữ liệu."
      );
    }
  }, [loggedInUserId]);

  const roleMapping = {
    0: "Người dùng",
    1: "Quản lý",
  };

  // Hàm tìm kiếm người dùng
  const searchUsers = useCallback(
    async (searchTerm) => {
      try {
        const response = await fetch(
          `${url}/API_Events/timkiemnguoidung.php?searchTerm=${searchTerm}&idnguoidung=${loggedInUserId}`
        );
        if (!response.ok) {
          throw new Error("Lỗi khi tìm kiếm người dùng");
        }
        const data = await response.json();
        setFilteredUser(data);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm:", error);
        alert("Không thể tìm kiếm người dùng. Vui lòng thử lại.");
      }
    },
    [loggedInUserId]
  );

  // Tìm kiếm người dùng khi nhập vào ô tìm kiếm
  useEffect(() => {
    if (debounceKeyword.trim() === "") {
      setFilteredUser(user); // Nếu ô tìm kiếm rỗng, hiển thị tất cả người dùng
    } else {
      searchUsers(debounceKeyword); // Gọi hàm tìm kiếm người dùng
    }
  }, [debounceKeyword, user, searchUsers]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Chỉnh sửa người dùng
  const editUser = (user) => {
    setUserToEdit(user);
    setShowEditUser(true);
  };

  // Xóa người dùng
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có muốn xóa người dùng này không?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`${url}/API_Events/xoanguoidung.php?id=${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const result = await response.json();
          toast.success(result.message);
          loadUser();
        } else {
          const errorResult = await response.json();
          alert("Có lỗi xảy ra khi xóa người dùng: " + errorResult.message);
        }
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        alert("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div id="user" className="user-content-section">
      <ToastContainer style={{ top: 70 }} />
      <div className="user-search-container">
        <i className="fas fa-search user-search-icon"></i>
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="user-search-input"
        />
      </div>
      <div id="userTable" className="user-table">
        {filteredUser.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên người dùng</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Vai trò</th>
                <th>Chức năng</th>
              </tr>
            </thead>
            <tbody>
              {filteredUser.map((user) => (
                <tr key={user.idnguoidung}>
                  <td>{user.idnguoidung}</td>
                  <td>{user.tennguoidung}</td>
                  <td>{user.email}</td>
                  <td>{user.sodienthoai}</td>
                  <td>{user.diachi}</td>
                  <td>{roleMapping[user.vaitro]}</td>
                  <td>
                    <button
                      className="user-edit"
                      onClick={() => editUser(user)}
                    >
                      Sửa
                    </button>
                    <button
                      className="user-delete"
                      onClick={() => deleteUser(user.idnguoidung)}
                    >
                      Khóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có người dùng nào</p>
        )}
      </div>

      <button
        className="user-floating-btn"
        onClick={() => setShowAddUser(true)}
      >
        +
      </button>

      {/* Hiển thị form thêm người dùng nếu cần */}
      {showAddUser && (
        <AddUser
          closeForm={() => setShowAddUser(false)}
          onUserAdded={loadUser}
        />
      )}

      {/* Hiển thị form chỉnh sửa người dùng nếu cần */}
      {showEditUser && (
        <EditUser
          userToEdit={userToEdit}
          closeForm={() => setShowEditUser(false)}
          onUserUpdated={loadUser}
        />
      )}
    </div>
  );
};

export default Users;
