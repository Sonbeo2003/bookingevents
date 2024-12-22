import React, { useEffect, useState } from "react";
import "./Profile.css";
import imgprofile from "../../assets/images/image.png";
import { FaKey, FaUserEdit } from "react-icons/fa";
import { PiUserList, PiEnvelope, PiPhone, PiMapPin } from "react-icons/pi";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  console.log(JSON.parse(localStorage.getItem("user")));

  return (
    <div className="profile-page">
      <div>
        <p
          style={{
            fontSize: 30,
            color: "black",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Thông tin tài khoản
        </p>
        <p>Chào mừng {user.tennguoidung} đến với hệ thống</p>
      </div>
      <div className="user-info-container">
        <img src={imgprofile} alt="Avatar" className="user-avatar" />
        <div>
          <h2 style={{ margin: 0 }}>{user.tennguoidung}</h2>
          <p style={{ marginTop: 10,fontSize:19, color:'gray', fontWeight:"bold" }}>Quản lý</p>
          <div style={{ display: "flex" }}>
            <button className="button-changepass">
              {" "}
              <FaKey style={{ marginRight: "5px" }} />
              Đổi mật khẩu
            </button>
            <button className="button-updateprofile">
              <FaUserEdit style={{ marginRight: "5px" }} />
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      </div>

      <div className="user-info">
        <p
          style={{
            fontSize: 25,
            color: "black",
            fontWeight: "bold",
            marginBottom:20,
          }}
        >
          Thông tin cơ bản
        </p>
        <p>
          <PiUserList style={{ marginRight: 10, verticalAlign: "middle",fontSize:30  }} />
          <strong>Họ và tên:</strong> {user.tennguoidung}
        </p>
        <p>
          <PiEnvelope style={{ marginRight: 10, verticalAlign: "middle", fontSize:30 }} />
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <PiPhone style={{ marginRight: 10, verticalAlign: "middle",fontSize:30 }} />
          <strong>Số điện thoại:</strong> {user.sodienthoai}
        </p>
        <p>
          <PiMapPin style={{ marginRight: 10, verticalAlign: "middle",fontSize:30 }} />
          <strong>Địa chỉ:</strong> {user.diachi}
        </p>
      </div>
    </div>
  );
};

export default Profile;
