import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff, AlertCircle, CheckCircle2, X, User, Plus, Loader2 } from "lucide-react";
import axiosClient from "../../api/axiosClient";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    terms: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Google Register states
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState("");
  const [googleCustomName, setGoogleCustomName] = useState("");
  const [googleShowCustomForm, setGoogleShowCustomForm] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // 🛠️ STATE QUẢN LÝ HIỆU ỨNG CHUYỂN TRANG
  const [isAnimate, setIsAnimate] = useState(false);

  const handleGoogleRegister = async (emailVal, nameVal) => {
    setGoogleLoading(true);
    setError("");
    try {
      const response = await axiosClient.post("/auth/google", {
        email: emailVal,
        name: nameVal,
        role: formData.role // Pass selected role (Sinh viên / Doanh nghiệp)
      });

      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        window.dispatchEvent(new Event("devpath_auth_change"));
        
        if (response.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        window.dispatchEvent(new Event("devpath_auth_change"));
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Đăng ký qua Google thất bại. Vui lòng thử lại."
      );
      setShowGoogleModal(false);
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Lên đầu trang
    const animationTimeout = setTimeout(() => {
      setIsAnimate(true); // Kích hoạt animation sau 50ms
    }, 50);
    return () => clearTimeout(animationTimeout);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { firstName, lastName, email, password, confirmPassword, role, terms } = formData;

    if (!firstName || !lastName || !email || !password) {
      setError("Vui lòng điền đầy đủ các thông tin bắt buộc.");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!terms) {
      setError("Bạn phải đồng ý với Điều khoản & Bảo mật.");
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post("/auth/register", {
        full_name: `${lastName} ${firstName}`.trim(),
        email,
        password,
        role
      });

      // Hiển thị thông báo thành công
      setSuccess(true);

      // Chờ 2 giây rồi chuyển sang trang đăng nhập
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin hoặc thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-[#040810] p-6 text-white font-sans antialiased overflow-hidden">

      {/* ═══ ANIMATED BACKGROUND LAYER ═══ */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#040810]" />

        {/* Aurora top-right */}
        <div
          className="absolute -top-40 -right-40 h-[700px] w-[700px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #00e5ff 0%, #0066ff 40%, transparent 70%)",
            filter: "blur(80px)",
            animation: "auroraFloat 12s ease-in-out infinite alternate",
          }}
        />

        {/* Aurora bottom-left */}
        <div
          className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #6c2bd9 0%, #0044cc 50%, transparent 70%)",
            filter: "blur(90px)",
            animation: "auroraFloat 16s ease-in-out infinite alternate-reverse",
          }}
        />

        {/* Mid accent glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[900px] opacity-10"
          style={{
            background: "radial-gradient(ellipse, #00e5ff 0%, transparent 60%)",
            filter: "blur(60px)",
            animation: "pulseSlow 8s ease-in-out infinite",
          }}
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #00e5ff 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Horizontal scan line */}
        <div
          className="absolute left-0 right-0 h-px opacity-30"
          style={{
            background: "linear-gradient(to right, transparent, #00e5ff 30%, #00e5ff 70%, transparent)",
            animation: "scanLine 10s linear infinite",
            top: 0,
          }}
        />

        {/* Floating orbs */}
        {[
          { size: 6, top: "18%", left: "8%", delay: "0s", dur: "7s" },
          { size: 4, top: "65%", left: "15%", delay: "1.5s", dur: "9s" },
          { size: 5, top: "30%", left: "88%", delay: "3s", dur: "8s" },
          { size: 3, top: "78%", left: "75%", delay: "0.8s", dur: "11s" },
          { size: 4, top: "10%", left: "50%", delay: "2s", dur: "6s" },
          { size: 3, top: "50%", left: "94%", delay: "4s", dur: "9s" },
        ].map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#00e5ff]"
            style={{
              width: orb.size * 4,
              height: orb.size * 4,
              top: orb.top,
              left: orb.left,
              opacity: 0.25,
              filter: `blur(${orb.size}px)`,
              animation: `orbFloat ${orb.dur} ease-in-out ${orb.delay} infinite alternate`,
            }}
          />
        ))}

        {/* Corner geometric accent */}
        <div
          className="absolute top-0 left-0 w-64 h-64 opacity-5"
          style={{
            background: "conic-gradient(from 135deg, #00e5ff, transparent 40%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64 opacity-5"
          style={{
            background: "conic-gradient(from -45deg, #0066ff, transparent 40%)",
          }}
        />
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes auroraFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 40px) scale(1.08); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.08; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.14; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 0.3; }
          95% { opacity: 0.3; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes orbFloat {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-20px); }
        }
      `}</style>

      {/* ═══ END BACKGROUND LAYER ═══ */}

      {/* WRAPPER ÁP DỤNG HIỆU ỨNG ANIMATION CHO TOÀN BỘ NỘI DUNG */}
      <div 
        className={`relative z-10 flex flex-col justify-between flex-1 w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Top Header Logo */}
        <div className="flex items-center gap-2 text-xl font-bold tracking-wide mb-6">
          <span className="text-white">DevPath</span>
          <span className="bg-[#00e5ff] bg-clip-text text-transparent">AI</span>
        </div>

        {/* 🛠️ Main Card Container: Cố định md:h-[600px] để bằng khít kích thước trang login */}
        <div className="mx-auto flex w-full max-w-4xl md:h-[600px] overflow-hidden rounded-2xl border border-[#00e5ff]/10 bg-[#060c1a]/70 shadow-2xl shadow-[#00e5ff]/5 backdrop-blur-xl my-auto">
          
          {/* Left Side: Info */}
          <div className="hidden w-1/2 flex-col justify-center bg-[#030810]/60 p-10 md:flex border-r border-[#00e5ff]/10" style={{backgroundImage: "radial-gradient(ellipse at bottom left, rgba(0,102,255,0.12) 0%, transparent 60%)"}}>
            <div className="mb-6 flex items-center gap-2 text-2xl font-bold">
              <span>DevPath</span>
              <span className="bg-[#00e5ff] bg-clip-text text-transparent">AI</span>
            </div>
            <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight">
              Bắt đầu hành trình <span className="text-[#00e5ff]">IT của bạn</span>
            </h2>
            <p className="mb-8 text-sm text-gray-400">
              Tạo tài khoản miễn phí và nhận ngay lộ trình học tập được AI cá nhân hoá cho riêng bạn.
            </p>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]"></span> Đăng ký trong 30 giây
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]"></span> Không cần thẻ tín dụng
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]"></span> Upload CV và phân tích ngay
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]"></span> Hoàn toàn miễn phí mãi mãi
              </li>
            </ul>
          </div>

          {/* 🛠️ Right Side: Form Đăng Ký (p-8 md:p-10 flex flex-col justify-center để tối ưu không gian) */}
          <div className="w-full p-8 md:w-1/2 md:p-10 flex flex-col justify-center">
            <h3 className="mb-0.5 text-2xl font-bold tracking-wide">Tạo tài khoản mới</h3>
            <p className="mb-4 text-xs text-gray-400">Điền thông tin bên dưới để bắt đầu</p>

            {/* ✅ Thông báo đăng ký thành công */}
            {success && (
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400 animate-fade-in">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                <div>
                  <div className="font-bold">Tạo tài khoản thành công! 🎉</div>
                  <div className="text-xs text-green-400/80 mt-0.5">Đang chuyển bạn tới trang đăng nhập...</div>
                </div>
              </div>
            )}

            {/* Error Message Box */}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* space-y-3 để các trường nhập thắt chặt, không bị tràn chiều cao */}
            <form className="space-y-3" onSubmit={handleSubmit}>
              
              {/* Họ và Tên (Flex row) */}
              <div className="flex gap-4">
                <div className="w-1/2 space-y-1">
                  <label className="text-xs font-semibold text-gray-400">Họ</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Họ của bạn"
                    required
                    className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2 px-3 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                  />
                </div>
                <div className="w-1/2 space-y-1">
                  <label className="text-xs font-semibold text-gray-400">Tên</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Tên của bạn"
                    required
                    className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2 px-3 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    required
                    className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2 pl-3 pr-10 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                  />
                  <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Ít nhất 8 ký tự"
                    required
                    className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2 pl-3 pr-10 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Nhập lại mật khẩu"
                    required
                    className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2 pl-3 pr-10 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Role Selection Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Tôi muốn đăng ký làm</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2 px-3 text-sm text-white focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff] cursor-pointer"
                >
                  <option value="student">Sinh viên</option>
                  <option value="enterprise">Doanh nghiệp</option>
                </select>
              </div>

              {/* Terms Agreement */}
              <div className="text-xs pt-0.5">
                <label className="flex items-start gap-2.5 cursor-pointer text-gray-400 select-none leading-relaxed">
                  <input 
                    type="checkbox" 
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    className="accent-[#00e5ff] rounded mt-0.5" 
                  />
                  <span>
                    Tôi đồng ý với{" "}
                    <a href="#" className="text-[#00e5ff] hover:underline">Điều khoản</a> &{" "}
                    <a href="#" className="text-[#00e5ff] hover:underline">Bảo mật</a>
                  </span>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#00e5ff] py-2.5 text-sm font-bold text-black transition-all hover:bg-[#00b2cc] active:scale-[0.99] mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4 text-center text-xs">
              <span className="absolute inset-x-0 top-1/2 h-px bg-gray-800"></span>
              <span className="relative bg-[#060c1a] px-3 text-gray-500 font-medium">hoặc</span>
            </div>

            {/* Google Register Button */}
            <button 
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-700 bg-[#0a101f] py-2.5 text-sm font-medium transition-all hover:bg-[#121b30]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.66 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.9-2.7 3.42-4.51 6.76-4.51z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.69 2.87c2.16-1.99 3.42-4.92 3.42-8.6z"/>
                <path fill="#FBBC05" d="M5.24 14.51c-.24-.72-.38-1.5-.38-2.31s.14-1.59.38-2.31L1.39 6.9C.5 8.71 0 10.74 0 12s.5 3.29 1.39 5.1l3.85-2.59z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.87c-1.02.68-2.33 1.09-3.92 1.09-3.34 0-5.86-1.81-6.76-4.51L.7 16.39C2.69 20.29 6.67 23 12 23z"/>
              </svg>
              Đăng ký với Google
            </button>

            {/* Redirect to Login */}
            <p className="mt-4 text-center text-xs text-gray-400">
              Đã có tài khoản?{" "}
              <button onClick={() => navigate("/login")} className="text-[#00e5ff] font-semibold hover:underline">
                Đăng nhập
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Footer Logo */}
        <div className="flex items-center justify-between text-[10px] text-gray-600 mt-6">
          <span>DevPath AI</span>
          <span>Dự án sinh viên — EAUT · Đội DevPath AI - 2026</span>
        </div>

        {/* Google Account Selector Popup Modal */}
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-md bg-[#060c1a]/90 border border-[#00e5ff]/15 rounded-2xl shadow-2xl shadow-[#00e5ff]/10 p-6 relative overflow-hidden backdrop-blur-xl">
              <button 
                onClick={() => { setShowGoogleModal(false); setGoogleShowCustomForm(false); }}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:bg-gray-800 hover:text-white transition-all"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="flex flex-col items-center text-center mt-2 mb-6">
                {/* Google Logo */}
                <svg className="h-8 w-8 mb-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <h3 className="text-lg font-bold text-white">Đăng ký bằng Google</h3>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                  với vai trò <span className="text-[#00e5ff] font-bold">{formData.role === 'enterprise' ? 'Doanh nghiệp' : 'Sinh viên'}</span>
                </p>
              </div>

              {googleLoading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-[#00e5ff]" />
                  <span className="text-sm text-gray-400">Đang xác thực tài khoản Google...</span>
                </div>
              ) : !googleShowCustomForm ? (
                <div className="space-y-3">
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 font-sans">Chọn tài khoản của bạn</div>
                  
                  {/* Account items */}
                  {[
                    { name: "Nguyễn Thanh Huyền", email: "trannguyen06010205@gmail.com", avatar: "H" },
                    { name: "Đức Thiên", email: "ducthien005@gmail.com", avatar: "T" },
                    { name: "Đào Tâm", email: "tam@gmail.com", avatar: "D" }
                  ].map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleGoogleRegister(acc.email, acc.name)}
                      className="w-full flex items-center gap-3.5 p-3 rounded-xl border border-gray-800/80 bg-[#0f192e]/40 hover:bg-[#11203b]/60 hover:border-[#00e5ff]/50 transition-all text-left"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#7c3aed] flex items-center justify-center text-black font-bold text-sm shrink-0">
                        {acc.avatar}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-sm font-bold text-gray-200 truncate">{acc.name}</div>
                        <div className="text-xs text-gray-500 truncate font-mono mt-0.5">{acc.email}</div>
                      </div>
                    </button>
                  ))}

                  {/* Add other account button */}
                  <button
                    type="button"
                    onClick={() => setGoogleShowCustomForm(true)}
                    className="w-full flex items-center gap-3.5 p-3 rounded-xl border border-dashed border-gray-800 hover:border-gray-600 hover:bg-[#0f192e]/40 transition-all text-left mt-2"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#14223c] flex items-center justify-center text-gray-400 shrink-0">
                      <Plus size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#00e5ff]">Sử dụng tài khoản khác</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">Đăng nhập/Đăng ký tài khoản Google mới</div>
                    </div>
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (googleCustomEmail && googleCustomName) {
                      handleGoogleRegister(googleCustomEmail, googleCustomName);
                    }
                  }}
                  className="space-y-4 animate-fade-in"
                >
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nhập thông tin tài khoản Google</div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400">Họ và Tên</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={googleCustomName}
                        onChange={(e) => setGoogleCustomName(e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2 px-3 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400">Email Google</label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="username@gmail.com"
                        value={googleCustomEmail}
                        onChange={(e) => setGoogleCustomEmail(e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2 px-3 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setGoogleShowCustomForm(false)}
                      className="w-1/2 rounded-lg border border-gray-700 bg-transparent py-2 text-sm font-semibold text-gray-300 transition-all hover:bg-gray-800"
                    >
                      Quay lại
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 rounded-lg bg-[#00e5ff] py-2 text-sm font-bold text-black transition-all hover:bg-[#00b2cc]"
                    >
                      Tiếp tục
                    </button>
                  </div>
                </form>
              )}

              <div className="text-[10px] text-center text-gray-500 mt-6 leading-relaxed">
                Để tiếp tục, Google sẽ chia sẻ tên, địa chỉ email, tùy chọn ngôn ngữ và ảnh hồ sơ của bạn với DevPath AI.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}