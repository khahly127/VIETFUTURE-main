import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff, AlertCircle, X, User, Plus, Loader2 } from "lucide-react";
import axiosClient from "../../api/axiosClient";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Google Login states
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState("");
  const [googleCustomName, setGoogleCustomName] = useState("");
  const [googleShowCustomForm, setGoogleShowCustomForm] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // 🛠️ STATE QUẢN LÝ HIỆU ỨNG CHUYỂN TRANG
  const [isAnimate, setIsAnimate] = useState(false);

  const handleGoogleLogin = async (emailVal, nameVal) => {
    setGoogleLoading(true);
    setError("");
    try {
      const response = await axiosClient.post("/auth/google", {
        email: emailVal,
        name: nameVal
      });

      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        window.dispatchEvent(new Event("devpath_auth_change"));
        
        if (response.user.role === "admin") {
          navigate("/admin");
        } else if (response.user.role === "enterprise" || response.user.role === "employer") {
          navigate("/employer");
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
        "Đăng nhập qua Google thất bại. Vui lòng thử lại."
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

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-[#040810] p-6 text-white font-sans antialiased overflow-hidden">

      {/* ═══ ANIMATED BACKGROUND LAYER ═══ */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Base dark gradient */}
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

      {/* CSS Keyframes injected inline */}
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

      {/* 🛠️ WRAPPER ÁP DỤNG HIỆU ỨNG ANIMATION CHO TOÀN BỘ NỘI DUNG */}
      <div 
        className={`relative z-10 flex flex-col justify-between flex-1 w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Top Header Logo */}
        <div className="flex items-center gap-2 text-xl font-bold tracking-wide mb-8">
          <span className="text-white">DevPath</span>
          <span className="bg-[#00e5ff] bg-clip-text text-transparent">AI</span>
        </div>

        {/* Main Card Container */}
        <div className="mx-auto flex w-full max-w-4xl overflow-hidden rounded-2xl border border-[#00e5ff]/10 bg-[#060c1a]/70 shadow-2xl shadow-[#00e5ff]/5 backdrop-blur-xl my-auto">
          
          {/* Left Side: Info */}
          <div className="hidden w-1/2 flex-col justify-center bg-[#030810]/60 p-10 md:flex border-r border-[#00e5ff]/10" style={{backgroundImage: "radial-gradient(ellipse at bottom left, rgba(0,102,255,0.12) 0%, transparent 60%)"}}>
            <div className="mb-6 flex items-center gap-2 text-2xl font-bold">
              <span>DevPath</span>
              <span className="bg-[#00e5ff] bg-clip-text text-transparent">AI</span>
            </div>
            <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight">
              Lộ trình IT <span className="text-[#00e5ff]">cá nhân hoá</span> <br /> bắt đầu từ đây
            </h2>
            <p className="mb-8 text-sm text-gray-400">
              Đăng nhập để xem lộ trình học tập AI tạo riêng cho bạn.
            </p>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]"></span> AI phân tích CV trong vài giây
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]"></span> Sơ đồ kỹ năng trực quan
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]"></span> Theo dõi tiến độ realtime
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff]"></span> Hoàn toàn miễn phí
              </li>
            </ul>
          </div>

          {/* Right Side: Form Đăng Nhập */}
          <div className="w-full p-8 md:w-1/2 md:p-12">
            <h3 className="mb-1 text-2xl font-bold tracking-wide">Đăng nhập tài khoản</h3>
            <p className="mb-6 text-xs text-gray-400">Chào mừng bạn quay lại 👋</p>

            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              setError("");

              if (!email || !password) {
                setError("Vui lòng nhập đầy đủ email và mật khẩu.");
                return;
              }

              setLoading(true);
              try {
                const response = await axiosClient.post("/auth/login", {
                  email,
                  password,
                });

                // Save token & user to localStorage
                if (response.token) {
                  localStorage.setItem("token", response.token);
                }
                if (response.user) {
                  localStorage.setItem("user", JSON.stringify(response.user));
                  window.dispatchEvent(new Event("devpath_auth_change"));
                  
                  // Chuyển hướng theo vai trò (Role-based redirect)
                  if (response.user.role === "admin") {
                  navigate("/admin");
                } else if (response.user.role === "enterprise" || response.user.role === "employer") {
                  navigate("/employer");
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
                  "Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu."
                );
              } finally {
                setLoading(false);
              }
            }}>
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    required
                    className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2.5 pl-3 pr-10 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                  />
                  <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    required
                    className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2.5 pl-3 pr-10 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
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

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-gray-400 select-none">
                  <input type="checkbox" className="accent-[#00e5ff] rounded" />
                  Ghi nhớ đăng nhập
                </label>
                <a href="#" className="text-[#00e5ff] hover:underline">Quên mật khẩu?</a>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#00e5ff] py-2.5 text-sm font-bold text-black transition-all hover:bg-[#00b2cc] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center text-xs">
              <span className="absolute inset-x-0 top-1/2 h-px bg-gray-800"></span>
              <span className="relative bg-[#060c1a] px-3 text-gray-500 font-medium">hoặc</span>
            </div>

            {/* Google Login Button */}
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
              Đăng nhập với Google
            </button>

            {/* Redirect to Register */}
            <p className="mt-6 text-center text-xs text-gray-400">
              Bạn chưa có tài khoản?{" "}
              <button onClick={() => navigate("/register")} className="text-[#00e5ff] font-semibold hover:underline">
                Đăng ký
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Footer Logo */}
        <div className="flex items-center justify-between text-[10px] text-gray-600 mt-8">
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
                <h3 className="text-lg font-bold text-white">Đăng nhập bằng Google</h3>
                <p className="text-xs text-gray-400 mt-1 font-medium">để tiếp tục tới DevPath AI</p>
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
                      onClick={() => handleGoogleLogin(acc.email, acc.name)}
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
                      handleGoogleLogin(googleCustomEmail, googleCustomName);
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