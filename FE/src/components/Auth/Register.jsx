import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import GoogleSignInButton from "./GoogleSignInButton";
import { redirectAfterAuth, saveAuthSession } from "../../utils/authSession";

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

  // 🛠️ STATE QUẢN LÝ HIỆU ỨNG CHUYỂN TRANG
  const [isAnimate, setIsAnimate] = useState(false);

  const handleGoogleSuccess = (response) => {
    setError("");
    saveAuthSession(response);
    redirectAfterAuth(navigate, response.user);
  };

  const handleGoogleError = (err) => {
    console.error(err);
    setError(
      err.response?.data?.message ||
        "Đăng ký qua Google thất bại. Vui lòng thử lại."
    );
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

            <GoogleSignInButton
              mode="register"
              role={formData.role}
              disabled={loading}
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

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
      </div>
    </div>
  );
}