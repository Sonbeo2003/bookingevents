import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import ServiceImage from "../../assets/images/9099152.png"; 
import url from "../../ipconfig";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Kiểm tra ngoại lệ
    if (!email.includes("@") || !email.includes(".")) {
      setError("Email không hợp lệ. Vui lòng nhập email đúng định dạng.");
      return;
    }
    
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    
    try {
      const response = await fetch(`${url}/API_Events/admin_dangnhap.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: email,
          matkhau: password,
        }),
      });
  
      const data = await response.json();
  
      if (data && data.success) {
        // Đăng nhập thành công - lưu thông tin người dùng vào localStorage
        localStorage.setItem("user", JSON.stringify({
          idnguoidung: data.user.idnguoidung,
          tennguoidung: data.user.tennguoidung,
          email: data.user.email,
          sodienthoai: data.user.sodienthoai,
          diachi: data.user.diachi,
        }));
        toast.success("Đăng nhập thành công!");
        navigate("/dashboard", { state: { toastMessage: "Đăng nhập thành công!" } });
      } else {
        // Nếu API trả về lỗi
        setError(data.message || "Sai thông tin email hoặc mật khẩu. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Đã xảy ra lỗi trong quá trình đăng nhập, vui lòng thử lại sau.");
    }
  };
  

  return (
    <div className="login-page">
      <div className="image-container">
        <img src={ServiceImage} alt="Petcare System" className="petcare-image" />
      </div>
      
      <div className="login-container">
        <h2>Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="login-container-div">
            <label className="label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-container-div">
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="button-login" type="submit">Đăng Nhập</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
