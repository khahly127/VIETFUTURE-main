import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  FileText,
  Map,
  Edit3,
  Camera,
  LogOut,
  ChevronRight,
  Download,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  BookOpen,
  Target,
  TrendingUp,
  ArrowLeft,
  Shield,
  Star,
} from "lucide-react";
import axiosClient from "../../api/axiosClient";
import {
  readAnalysisResult,
  readCvFile,
  readCvMeta,
  readSkillGapResult,
  getSkillLists,
  clearCvData,
  formatUploadDate,
  formatFileSize,
  buildRoadmapPhases,
} from "../../utils/profileStorage";

export default function UserProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [avatarHover, setAvatarHover] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [cvMeta, setCvMeta] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);

  const refreshProfileData = () => {
    setAnalysisResult(readAnalysisResult());
    setCvMeta(readCvMeta());
    setCvFile(readCvFile());
    setSkillGap(readSkillGapResult());
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => setIsAnimate(true), 50);

    const stored =
      localStorage.getItem("user") || localStorage.getItem("devpath_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setEditForm({
        ...parsed,
        name: parsed.full_name || parsed.name || "",
      });

      if (parsed.user_id) {
        axiosClient
          .get(`/users/${parsed.user_id}`)
          .then((freshUser) => {
            if (!freshUser) return;

            const { password_hash, ...safeUser } = freshUser;
            const merged = {
              ...parsed,
              ...safeUser,
              name: safeUser.full_name || parsed.full_name || parsed.name || "",
              joinedDate: safeUser.created_at
                ? new Date(safeUser.created_at).toLocaleDateString("vi-VN")
                : parsed.joinedDate,
            };

            setUser(merged);
            setEditForm((prev) => ({
              ...prev,
              ...merged,
              name: merged.full_name || merged.name || "",
            }));
            localStorage.setItem("user", JSON.stringify(merged));
          })
          .catch((error) => {
            console.error("Không tải được thông tin user:", error);
          });
      }
    } else {
      navigate("/login");
    }

    refreshProfileData();
    return () => clearTimeout(timeout);
  }, [navigate]);

  const handleDeleteCV = () => {
    if (
      !window.confirm(
        "Bạn có chắc muốn xóa CV và toàn bộ kết quả phân tích liên quan?"
      )
    ) {
      return;
    }

    clearCvData();
    refreshProfileData();
    setPreviewOpen(false);
  };

  const handleSaveProfile = async () => {
    try {
      // If the name was edited, save it back as full_name for backend consistency
      const updated = {
        ...user,
        ...editForm,
        full_name:
          editForm.name || editForm.full_name || user.full_name || user.name,
      };

      if (updated.user_id) {
        const payload = {
          full_name: updated.full_name,
          phone: updated.phone || null,
        };
        await axiosClient.put(`/users/${updated.user_id}`, payload);
      }

      localStorage.setItem("user", JSON.stringify(updated));
      localStorage.setItem("devpath_user", JSON.stringify(updated));
      setUser(updated);
      setIsEditing(false);
      window.dispatchEvent(new Event("devpath_auth_change"));
    } catch (err) {
      console.error("Lỗi cập nhật profile:", err);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const updated = { ...user, avatar: ev.target.result };
      localStorage.setItem("user", JSON.stringify(updated));
      localStorage.setItem("devpath_user", JSON.stringify(updated));
      setUser(updated);
      setEditForm((f) => ({ ...f, avatar: ev.target.result }));
      window.dispatchEvent(new Event("devpath_auth_change"));
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("devpath_user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("devpath_auth_change"));
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return null;

  const userName = user.full_name || user.name || "Người dùng";

  const tabs = [
    { id: "profile", label: "Hồ sơ", icon: User },
    { id: "cv", label: "CV đã upload", icon: FileText },
    { id: "roadmap", label: "Lộ trình của tôi", icon: Map },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-white font-sans antialiased">
      {/* Animated BG Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.06)_0%,transparent_70%)] -top-40 -right-40" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.07)_0%,transparent_70%)] bottom-0 -left-40" />
      </div>

      <div
        className={`relative z-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Top Bar */}
        <div className="border-b border-white/5 bg-[#080c10]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-[#6b7a95] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Trang chủ
          </button>
          <div className="flex items-center gap-1.5 text-xl font-extrabold">
            <span className="text-white">Dev</span>
            <span className="text-[#00E5FF]">Path</span>
            <span className="font-medium text-white/70 text-base ml-0.5">
              AI
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={15} />
            Đăng xuất
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10">
          {/* Profile Header Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0d1527]/80 backdrop-blur-md mb-8 p-8">
            {/* Cover gradient */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-[#00e5ff]/10 via-[#7c3aed]/8 to-transparent" />

            <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar */}
              <div
                className="relative group cursor-pointer shrink-0"
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#00e5ff]/40 shadow-[0_0_20px_rgba(0,229,255,0.15)]">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#00e5ff]/20 to-[#7c3aed]/30 flex items-center justify-center text-3xl font-bold text-[#00e5ff]">
                      {getInitials(userName)}
                    </div>
                  )}
                </div>
                {avatarHover && (
                  <div className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center transition-all">
                    <Camera size={20} className="text-white" />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                  <h1 className="text-2xl font-extrabold tracking-tight">
                    {userName}
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-[#00e5ff]/10 text-[#00e5ff] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#00e5ff]/20">
                    <Shield size={10} /> FREE
                  </span>
                </div>
                <p className="text-sm text-[#6b7a95] mb-1">{user.email}</p>
                {user.bio && (
                  <p className="text-sm text-gray-300 max-w-md">{user.bio}</p>
                )}
                {analysisResult?.role && (
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#a78bfa] text-xs px-3 py-1 rounded-full font-medium">
                    <Target size={11} />
                    {analysisResult.role}
                  </div>
                )}
              </div>

              {/* Edit button */}
              <button
                onClick={() => setIsEditing(true)}
                className="shrink-0 flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              >
                <Edit3 size={14} />
                Chỉnh sửa
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-[#0d1527]/60 border border-white/8 rounded-xl p-1 mb-8 w-fit">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-[#00e5ff] text-[#070b14] shadow-[0_2px_12px_rgba(0,229,255,0.25)]"
                    : "text-[#6b7a95] hover:text-white"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "profile" && (
            <ProfileTab
              user={user}
              analysisResult={analysisResult}
              skillGap={skillGap}
              isEditing={isEditing}
              editForm={editForm}
              setEditForm={setEditForm}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditing(false)}
            />
          )}
          {activeTab === "cv" && (
            <CVTab
              analysisResult={analysisResult}
              cvMeta={cvMeta}
              cvFile={cvFile}
              previewOpen={previewOpen}
              setPreviewOpen={setPreviewOpen}
              onDelete={handleDeleteCV}
              navigate={navigate}
            />
          )}
          {activeTab === "roadmap" && (
            <RoadmapTab
              analysisResult={analysisResult}
              skillGap={skillGap}
              navigate={navigate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── PROFILE TAB ─── */
function ProfileTab({
  user,
  analysisResult,
  skillGap,
  isEditing,
  editForm,
  setEditForm,
  onSave,
  onCancel,
}) {
  const fields = [
    {
      key: "name",
      label: "Họ và tên",
      placeholder: "Nguyễn Văn A",
      icon: User,
    },
    {
      key: "email",
      label: "Email",
      placeholder: "email@example.com",
      icon: Mail,
      disabled: true,
    },
    {
      key: "phone",
      label: "Số điện thoại",
      placeholder: "0901 234 567",
      icon: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left: Info Card */}
      <div className="md:col-span-2 space-y-4">
        <div className="rounded-2xl border border-white/8 bg-[#0d1527]/80 p-6">
          <h2 className="text-base font-bold mb-5 flex items-center gap-2">
            <User size={16} className="text-[#00e5ff]" />
            Thông tin cá nhân
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ key, label, placeholder, disabled }) => (
              <div key={key} className={key === "email" ? "sm:col-span-2" : ""}>
                <label className="text-xs font-semibold text-[#6b7a95] mb-1.5 block">
                  {label}
                </label>
                {isEditing && !disabled ? (
                  <input
                    type="text"
                    value={editForm[key] || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2.5 px-3 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff]"
                  />
                ) : (
                  <div className="py-2.5 px-3 rounded-lg bg-[#0a101f]/60 border border-white/5 text-sm text-white min-h-[40px]">
                    {(key === "name"
                      ? user.full_name || user.name
                      : user[key]) || (
                      <span className="text-[#6b7a95]">{placeholder}</span>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Bio */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#6b7a95] mb-1.5 block">
                Giới thiệu bản thân
              </label>
              {isEditing ? (
                <textarea
                  value={editForm.bio || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, bio: e.target.value }))
                  }
                  placeholder="Viết vài dòng về bản thân..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-700 bg-[#0a101f] py-2.5 px-3 text-sm text-white placeholder-gray-600 focus:border-[#00e5ff] focus:outline-none focus:ring-1 focus:ring-[#00e5ff] resize-none"
                />
              ) : (
                <div className="py-2.5 px-3 rounded-lg bg-[#0a101f]/60 border border-white/5 text-sm min-h-[80px] text-white">
                  {user.bio || (
                    <span className="text-[#6b7a95]">Chưa có giới thiệu</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-5">
              <button
                onClick={onSave}
                className="flex-1 bg-[#00e5ff] text-[#070b14] py-2.5 rounded-xl font-bold text-sm hover:bg-[#00b2cc] transition-all"
              >
                Lưu thay đổi
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-white/5 border border-white/10 py-2.5 rounded-xl font-medium text-sm hover:bg-white/10 transition-all"
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Stats */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/8 bg-[#0d1527]/80 p-5">
          <h3 className="text-sm font-bold mb-4 text-[#6b7a95] uppercase tracking-wider">
            Hoạt động
          </h3>
          <div className="space-y-3">
            {[
              {
                label: "Ngày tham gia",
                value:
                  user.joinedDate ||
                  (user.created_at
                    ? new Date(user.created_at).toLocaleDateString("vi-VN")
                    : "Chưa rõ"),
                icon: Clock,
              },
              {
                label: "Lộ trình đang theo",
                value:
                  analysisResult?.role ||
                  analysisResult?.originalRoleName ||
                  "Chưa xác định",
                icon: Target,
              },
              {
                label: "Tiến độ học",
                value: `${analysisResult?.assessmentPercent ?? skillGap?.matchPercentage ?? 0}%`,
                icon: TrendingUp,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-2 text-xs text-[#6b7a95]">
                  <Icon size={13} />
                  {label}
                </div>
                <span className="text-xs font-semibold text-white">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#00e5ff]/15 bg-[#00e5ff]/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Star size={14} className="text-[#00e5ff]" />
            <span className="text-sm font-bold text-[#00e5ff]">
              Nâng cấp Pro
            </span>
          </div>
          <p className="text-xs text-[#6b7a95] mb-3">
            Mở khoá AI mentor cá nhân và theo dõi tiến độ nâng cao.
          </p>
          <button
            onClick={() =>
              alert("Tính năng DevPath Pro đang được phát triển.")
            }
            className="w-full py-2 rounded-lg bg-[#00e5ff]/15 border border-[#00e5ff]/30 text-[#00e5ff] text-xs font-bold hover:bg-[#00e5ff]/20 transition-all"
          >
            Khám phá Pro →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── CV TAB ─── */
function CVTab({
  analysisResult,
  cvMeta,
  cvFile,
  previewOpen,
  setPreviewOpen,
  onDelete,
  navigate,
}) {
  const hasCV = !!analysisResult?.hasCV || !!cvMeta || !!cvFile;
  const { skills, missing } = getSkillLists(analysisResult);
  const displayName = cvMeta?.fileName || cvFile?.fileName || "resume_cv.pdf";
  const displaySize = formatFileSize(cvMeta?.fileSize || cvFile?.fileSize) || "~1.2 MB";
  const displayType = (cvMeta?.fileType || cvFile?.fileType || "application/pdf")
    .includes("pdf")
    ? "PDF"
    : "DOCX";
  const uploadedAt = formatUploadDate(cvMeta?.uploadedAt || cvFile?.uploadedAt);

  const handleDownload = () => {
    if (!cvFile?.dataUrl) {
      alert("Không tìm thấy file CV đã lưu. Vui lòng upload lại CV.");
      return;
    }

    const link = document.createElement("a");
    link.href = cvFile.dataUrl;
    link.download = cvFile.fileName || displayName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    if (!cvFile?.dataUrl) {
      alert("Không tìm thấy file CV đã lưu. Vui lòng upload lại CV.");
      return;
    }
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-5">
      {hasCV ? (
        <>
          <div className="rounded-2xl border border-white/8 bg-[#0d1527]/80 p-6">
            <div className="flex items-start justify-between mb-5">
              <h2 className="text-base font-bold flex items-center gap-2">
                <FileText size={16} className="text-[#00e5ff]" />
                CV đã tải lên
              </h2>
              <span className="text-[10px] bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <CheckCircle size={10} /> Đã phân tích
              </span>
            </div>

            <div className="flex items-center gap-4 bg-[#0f192e] border border-[#00e5ff]/20 rounded-xl p-4 mb-5">
              <div className="w-12 h-14 bg-[#00e5ff]/10 rounded-lg border border-[#00e5ff]/20 flex items-center justify-center shrink-0">
                <FileText size={22} className="text-[#00e5ff]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-white truncate">
                  {displayName}
                </div>
                <div className="text-xs text-[#6b7a95] mt-0.5">
                  {displayType} • {displaySize} • Upload lúc {uploadedAt}
                </div>
                <div className="text-xs text-[#00e5ff] mt-1 font-medium">
                  Vị trí: {analysisResult?.role || cvMeta?.role || "Chưa xác định"}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleView}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#6b7a95] hover:text-white transition-all"
                  title="Xem"
                >
                  <Eye size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#6b7a95] hover:text-white transition-all"
                  title="Tải về"
                >
                  <Download size={15} />
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                  title="Xoá"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0f192e] rounded-xl p-4 border border-white/5">
                <h4 className="text-xs font-bold text-[#00e5ff] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle size={11} /> Kỹ năng đã có
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-medium px-2.5 py-1 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#6b7a95]">
                      Hoàn thành bài đánh giá để xem kỹ năng đã có.
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-[#0f192e] rounded-xl p-4 border border-white/5">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Target size={11} /> Kỹ năng cần học
                </h4>
                <div className="flex flex-wrap gap-2">
                  {missing.length > 0 ? (
                    missing.map((skill) => (
                      <span
                        key={skill}
                        className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-medium px-2.5 py-1 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[#6b7a95]">
                      Chưa có dữ liệu kỹ năng cần học.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 text-sm text-[#6b7a95] hover:text-[#00e5ff] transition-colors"
          >
            <ChevronRight size={14} />
            Upload CV mới
          </button>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#0d1527]/60 p-12 text-center">
          <div className="w-16 h-16 bg-[#00e5ff]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-[#00e5ff]" />
          </div>
          <h3 className="text-lg font-bold mb-2">Chưa có CV nào</h3>
          <p className="text-sm text-[#6b7a95] mb-6 max-w-xs mx-auto">
            Upload CV của bạn để AI phân tích kỹ năng và tạo lộ trình học tập cá
            nhân hoá.
          </p>
          <button
            type="button"
            onClick={() => navigate("/upload")}
            className="inline-flex items-center gap-2 bg-[#00e5ff] text-[#070b14] px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#00b2cc] transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)]"
          >
            Upload CV ngay
          </button>
        </div>
      )}

      {previewOpen && cvFile?.dataUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-4xl h-[85vh] rounded-2xl border border-white/10 bg-[#0d1527] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="text-sm font-semibold truncate">{displayName}</div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="text-sm text-[#6b7a95] hover:text-white"
              >
                Đóng
              </button>
            </div>
            <div className="flex-1 bg-[#050a14]">
              {cvFile.fileType?.includes("pdf") ? (
                <iframe
                  title="CV Preview"
                  src={cvFile.dataUrl}
                  className="w-full h-full"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-6">
                  <FileText size={40} className="text-[#00e5ff]" />
                  <p className="text-sm text-[#6b7a95]">
                    Không thể xem trước file DOC/DOCX trực tiếp trên trình duyệt.
                  </p>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="px-4 py-2 rounded-lg bg-[#00e5ff] text-[#070b14] text-sm font-bold"
                  >
                    Tải file về
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ROADMAP TAB ─── */
function RoadmapTab({ analysisResult, skillGap, navigate }) {
  const hasRoadmap = !!analysisResult?.hasCV || !!analysisResult?.role;
  const { progress, phases } = buildRoadmapPhases(analysisResult, skillGap);

  if (!hasRoadmap) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-[#0d1527]/60 p-12 text-center">
        <div className="w-16 h-16 bg-[#7c3aed]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Map size={28} className="text-[#7c3aed]" />
        </div>
        <h3 className="text-lg font-bold mb-2">Chưa có lộ trình</h3>
        <p className="text-sm text-[#6b7a95] mb-6 max-w-xs mx-auto">
          Upload CV và hoàn thành bài đánh giá để nhận lộ trình học tập cá nhân
          hoá từ AI.
        </p>
        <button
          onClick={() => navigate("/upload")}
          className="inline-flex items-center gap-2 bg-[#7c3aed] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#6d28d9] transition-all"
        >
          Bắt đầu ngay
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Overview */}
      <div className="rounded-2xl border border-white/8 bg-[#0d1527]/80 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2 mb-1">
              <Map size={16} className="text-[#7c3aed]" />
              Lộ trình: {analysisResult.role}
            </h2>
            <p className="text-xs text-[#6b7a95]">
              Được tạo bởi AI dựa trên phân tích CV của bạn
            </p>
          </div>
          <button
            onClick={() => navigate("/roadmap")}
            className="flex items-center gap-1.5 text-xs text-[#00e5ff] hover:underline font-medium"
          >
            Xem chi tiết <ChevronRight size={13} />
          </button>
        </div>

        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-[#6b7a95]">Tiến độ tổng thể</span>
            <span className="font-bold text-[#00e5ff]">{progress}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00e5ff] to-[#7c3aed] rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {phases.length > 0 ? (
            phases.map((p, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 transition-all ${
                p.status === "completed"
                  ? "border-green-500/20 bg-green-500/5"
                  : p.status === "in-progress"
                    ? "border-[#00e5ff]/20 bg-[#00e5ff]/5"
                    : "border-white/5 bg-white/2 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {p.status === "completed" ? (
                    <CheckCircle
                      size={14}
                      className="text-green-400 shrink-0"
                    />
                  ) : p.status === "in-progress" ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00e5ff] border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full bg-white/10 shrink-0" />
                  )}
                  <span className="text-[10px] font-bold text-[#6b7a95] uppercase tracking-wider">
                    {p.phase}
                  </span>
                  <span className="font-bold text-sm">{p.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#6b7a95] flex items-center gap-1">
                    <Clock size={10} /> {p.duration}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === "completed"
                        ? "bg-green-500/15 text-green-400"
                        : p.status === "in-progress"
                          ? "bg-[#00e5ff]/15 text-[#00e5ff]"
                          : "bg-white/5 text-[#6b7a95]"
                    }`}
                  >
                    {p.status === "completed"
                      ? "Hoàn thành"
                      : p.status === "in-progress"
                        ? "Đang học"
                        : "Chưa mở"}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              {p.progress > 0 && (
                <div className="mb-2">
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        p.status === "completed"
                          ? "bg-green-400"
                          : "bg-gradient-to-r from-[#00e5ff] to-[#7c3aed]"
                      }`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {p.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] bg-white/5 border border-white/8 text-[#8ea1bf] px-2 py-0.5 rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            ))
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-[#6b7a95]">
              Chưa có dữ liệu giai đoạn học. Hãy hoàn thành bài đánh giá để AI tạo lộ trình chi tiết hơn.
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/roadmap")}
          className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#0d1527]/80 p-5 hover:border-[#00e5ff]/30 transition-all group text-left"
        >
          <div className="w-10 h-10 bg-[#00e5ff]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#00e5ff]/20 transition-all">
            <BookOpen size={18} className="text-[#00e5ff]" />
          </div>
          <div>
            <div className="font-bold text-sm">Xem lộ trình đầy đủ</div>
            <div className="text-xs text-[#6b7a95]">
              Sơ đồ chi tiết & tài nguyên học
            </div>
          </div>
          <ChevronRight
            size={16}
            className="ml-auto text-[#6b7a95] group-hover:text-white transition-colors"
          />
        </button>

        <button
          onClick={() => navigate("/courses")}
          className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#0d1527]/80 p-5 hover:border-[#7c3aed]/30 transition-all group text-left"
        >
          <div className="w-10 h-10 bg-[#7c3aed]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#7c3aed]/20 transition-all">
            <TrendingUp size={18} className="text-[#a78bfa]" />
          </div>
          <div>
            <div className="font-bold text-sm">Khoá học đề xuất</div>
            <div className="text-xs text-[#6b7a95]">
              Dựa trên kỹ năng còn thiếu của bạn
            </div>
          </div>
          <ChevronRight
            size={16}
            className="ml-auto text-[#6b7a95] group-hover:text-white transition-colors"
          />
        </button>
      </div>
    </div>
  );
}
