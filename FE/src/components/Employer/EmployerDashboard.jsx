import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Search,
  Briefcase,
  Users,
  Star,
  CreditCard,
  LogOut,
  MapPin,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import axiosClient from "../../api/axiosClient";

const navItems = [
  { id: "overview", label: "Tổng quan", icon: <BarChart3 size={18} /> },
  { id: "candidates", label: "Tìm ứng viên", icon: <Search size={18} /> },
  { id: "jobs", label: "Quản lý tuyển dụng", icon: <Briefcase size={18} /> },
  { id: "branding", label: "Thương hiệu", icon: <Star size={18} /> },
  { id: "billing", label: "Gói & Hóa đơn", icon: <CreditCard size={18} /> },
];

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [candidatesSubTab, setCandidatesSubTab] = useState("applied");
  const [aiReport, setAiReport] = useState("");
  const [aiReportLoading, setAiReportLoading] = useState(false);
  const [showAIReportModal, setShowAIReportModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: "TXN1234", date: "01/06/2026", amount: "1,200,000đ", status: "Nâng cấp" },
    { id: "TXN1235", date: "28/05/2026", amount: "0đ", status: "Free" },
  ]);
  const [profile, setProfile] = useState(null);
  const [filterSkill, setFilterSkill] = useState("");
  const [filterScore, setFilterScore] = useState(70);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSalary, setEditSalary] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [profileForm, setProfileForm] = useState({
    company_name: "",
    website: "",
    description: "",
    phone: "",
    location: "",
    industry: "",
    logo: "",
    banner: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("devpath_auth_change"));
    navigate("/");
  };

  const loadOverview = async () => {
    try {
      const data = await axiosClient.get("/employer/overview");
      setOverview(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCandidates = async () => {
    try {
      const data = await axiosClient.get("/employer/candidates", {
        params: {
          skill: filterSkill,
          minScore: filterScore,
        },
      });
      setCandidates(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadJobs = async () => {
    try {
      const data = await axiosClient.get("/employer/jobs");
      setJobs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadApplications = async () => {
    try {
      const data = await axiosClient.get("/employer/applications");
      setApplications(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadProfile = async () => {
    try {
      const data = await axiosClient.get("/employer/company-profile");
      setProfile(data);
      if (data) {
        setProfileForm({
          company_name: data.company_name || "",
          website: data.website || "",
          description: data.description || "",
          phone: data.phone || "",
          location: data.location || "",
          industry: data.industry || "",
          logo: data.logo || "",
          banner: data.banner || "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadOverview(), loadCandidates(), loadJobs(), loadApplications(), loadProfile()])
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [filterSkill, filterScore]);

  const handleSelectEditJob = (job) => {
    setEditingJob(job);
    setEditTitle(job.title || "");
    setEditDescription(job.description || "");
    setEditLocation(job.location || "");
    setEditSalary(job.salary_range || "");
    setEditSkills(job.required_skills || "");
    setMessage("");
  };

  const handleCancelEdit = () => {
    setEditingJob(null);
    setEditTitle("");
    setEditDescription("");
    setEditLocation("");
    setEditSalary("");
    setEditSkills("");
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin tuyển dụng này không?")) {
      return;
    }

    try {
      setLoading(true);
      await axiosClient.delete(`/employer/jobs/${jobId}`);
      setMessage("Xóa tin tuyển dụng thành công.");
      await loadJobs();
      await loadApplications();
      if (editingJob && editingJob.job_id === jobId) {
        handleCancelEdit();
      }
      if (selectedJobId === jobId) {
        setSelectedJobId(null);
      }
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi xóa tin tuyển dụng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJob = async () => {
    if (!editTitle) {
      setMessage("Vui lòng điền tiêu đề tuyển dụng.");
      return;
    }

    try {
      setLoading(true);
      await axiosClient.put(`/employer/jobs/${editingJob.job_id}`, {
        title: editTitle,
        description: editDescription,
        location: editLocation,
        salary_range: editSalary,
        required_skills: editSkills,
      });
      setMessage("Tin tuyển dụng đã được cập nhật thành công.");
      setEditingJob(null);
      await loadJobs();
      await loadApplications();
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi cập nhật tin tuyển dụng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    if (!jobTitle) {
      setMessage("Vui lòng điền tiêu đề tuyển dụng.");
      return;
    }

    try {
      setLoading(true);
      await axiosClient.post("/employer/jobs", {
        title: jobTitle,
        description: jobDescription,
        location: jobLocation,
        salary_range: jobSalary,
        required_skills: jobSkills,
      });
      setJobTitle("");
      setJobDescription("");
      setJobLocation("");
      setJobSalary("");
      setJobSkills("");
      setMessage("Tin tuyển dụng đã được tạo thành công.");
      await loadJobs();
      await loadApplications();
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi tạo tin tuyển dụng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      setLoading(true);
      await axiosClient.put(`/employer/applications/${appId}/status`, { status: newStatus });
      setMessage("Cập nhật trạng thái hồ sơ thành công.");
      await loadApplications();
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi cập nhật trạng thái hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIReport = async () => {
    setAiReportLoading(true);
    setShowAIReportModal(true);
    setAiReport("");
    try {
      const data = await axiosClient.get("/employer/ai-report");
      setAiReport(data.report || "Không có nội dung báo cáo.");
    } catch (error) {
      console.error(error);
      setAiReport("Không thể tạo báo cáo AI vào lúc này. Vui lòng thử lại sau.");
    } finally {
      setAiReportLoading(false);
    }
  };

  const handleUpgradeSubscription = async () => {
    try {
      setLoading(true);
      await axiosClient.post("/employer/upgrade");
      
      setTransactions((prev) => [
        {
          id: `TXN${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toLocaleDateString("vi-VN"),
          amount: "1,200,000đ",
          status: "Nâng cấp B2B"
        },
        ...prev
      ]);
      
      setMessage("Nâng cấp lên gói PREMIUM thành công!");
      setShowPaymentModal(false);
      await loadOverview();
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi nâng cấp gói dịch vụ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await axiosClient.put("/employer/company-profile", profileForm);
      setMessage("Hồ sơ công ty đã được cập nhật.");
      await loadProfile();
    } catch (error) {
      console.error(error);
      setMessage("Lỗi khi lưu hồ sơ công ty.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type, file);

    try {
      setLoading(true);
      setMessage("");
      await axiosClient.post(`/employer/company-profile/${type}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(type === "logo" ? "Cập nhật Logo công ty thành công!" : "Cập nhật Banner giới thiệu thành công!");
      await loadProfile();
    } catch (error) {
      console.error(error);
      setMessage(type === "logo" ? "Lỗi khi tải lên Logo công ty." : "Lỗi khi tải lên Banner giới thiệu.");
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = selectedJobId
    ? applications.filter((app) => app.job && app.job.id === selectedJobId)
    : applications;

  const matchRate = overview?.applicationsByStatus?.reviewed
    ? Math.min(100, Math.round((overview.applicationsByStatus.reviewed / Math.max(1, overview.totalApplications)) * 100))
    : 0;

  const stats = [
    {
      title: "Tin tuyển dụng mở",
      value: overview?.subscription ? `${overview.totalJobs} / ${overview.subscription.jobLimit}` : (overview?.totalJobs ?? 0),
      subtitle: "Hạn mức đăng tin tuyển dụng",
      color: "bg-cyan-500/10 text-cyan-300",
    },
    {
      title: "CV sinh viên nộp",
      value: overview?.totalApplications ?? 0,
      subtitle: `Hạn mức xem CV: ${overview?.subscription?.cvViewLimit ?? 10} lượt`,
      color: "bg-emerald-500/10 text-emerald-300",
    },
    {
      title: "Gói dịch vụ hiện tại",
      value: overview?.subscription?.planType ? `Gói: ${overview.subscription.planType}` : "Gói: FREE",
      subtitle: "Hạn mức tài nguyên doanh nghiệp",
      color: "bg-violet-500/10 text-violet-300",
    },
    {
      title: "Tỷ lệ match",
      value: `${matchRate}%`,
      subtitle: "Ứng viên phù hợp",
      color: "bg-sky-500/10 text-sky-300",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060b17] text-white">
      <div className="flex min-h-screen">
        <aside className="w-[280px] border-r border-white/10 bg-[#070b13] p-6 flex flex-col">
          <div className="mb-8 flex items-start gap-3 min-w-0">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#00e5ff] to-[#7c3aed] flex items-center justify-center text-slate-950 shadow-lg shadow-[#00e5ff]/20 shrink-0 mt-0.5">
              <Users size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-400 uppercase tracking-[0.15em] leading-normal whitespace-normal">Kênh Doanh nghiệp</div>
              <div 
                className="text-lg font-bold text-white whitespace-normal break-words leading-snug mt-1" 
                title={overview?.companyName || "Employer Hub"}
              >
                {overview?.companyName || "Employer Hub"}
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                  activeTab === item.id ? "bg-[#0f1724] text-white shadow-[0_0_0_1px_rgba(56,189,248,0.16)]" : "text-slate-300 hover:bg-white/5"
                }`}
              >
                <span className="text-cyan-300">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 rounded-3xl border border-white/10 bg-[#08101d] p-4 text-sm text-slate-300">
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-500">Hỗ trợ</div>
            <p className="leading-6 text-slate-400 mb-3">Xem báo cáo AI, quản lý chiến dịch và tối ưu tuyển dụng phù hợp với lộ trình học sinh.</p>
            <button
              onClick={handleGenerateAIReport}
              className="w-full rounded-2xl bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 px-3 py-2 text-xs font-semibold transition border border-cyan-500/20"
            >
              Xem báo cáo AI ⚡
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:bg-white/10"
          >
            <LogOut size={16} /> Thoát
          </button>
        </aside>

        <main className="flex-1 p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.3em] text-cyan-300">Employer Dashboard</div>
              <h1 className="mt-3 text-3xl font-bold">
                {overview?.companyName ? `Chào mừng, ${overview.companyName}` : "Quản lý tuyển dụng doanh nghiệp"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">Xem tổng quan chiến dịch, nguồn lực sinh viên và tương tác AI để xây dựng đội ngũ phù hợp.</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button 
                onClick={() => setActiveTab("jobs")}
                className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Tạo chiến dịch mới
              </button>
              <button 
                onClick={handleGenerateAIReport}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10"
              >
                Xem báo cáo AI
              </button>
            </div>
          </div>

          {message && (
            <div className="mb-5 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</div>
          )}

          {activeTab === "overview" && (
            <section className="space-y-6">
              <div className="grid gap-4 xl:grid-cols-4">
                {stats.map((card) => (
                  <div key={card.title} className={`rounded-3xl border border-white/10 p-5 ${card.color}`}>
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{card.title}</div>
                    <div className="mt-4 text-4xl font-bold">{card.value}</div>
                    <div className="mt-2 text-sm text-slate-300">{card.subtitle}</div>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                <div className="rounded-3xl border border-white/10 bg-[#08101d] p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">Xu hướng kỹ năng sinh viên</h2>
                      <p className="text-sm text-slate-400">Dữ liệu thực từ các đánh giá và lộ trình gần nhất.</p>
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">Realtime</span>
                  </div>
                  <div className="space-y-4">
                    {overview?.applicationsByStatus && Object.entries(overview.applicationsByStatus).map(([status, count]) => (
                      <div key={status}>
                        <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                          <span>{status}</span>
                          <span>{count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div className="h-2 rounded-full bg-cyan-400" style={{ width: `${Math.min(100, (Number(count) / Math.max(overview.totalApplications, 1)) * 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#08101d] p-6">
                  <h2 className="text-xl font-semibold">Cơ hội tuyển dụng</h2>
                  <p className="mt-2 text-sm text-slate-400">Tổng hợp tin tuyển dụng và ứng viên đang xét.</p>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-3xl bg-white/5 p-4">
                      <div className="flex items-center justify-between text-sm text-slate-300"><span>Vị trí mở</span><span>{overview?.totalJobs ?? 0}</span></div>
                    </div>
                    <div className="rounded-3xl bg-white/5 p-4">
                      <div className="flex items-center justify-between text-sm text-slate-300"><span>Ứng viên nộp</span><span>{overview?.totalApplications ?? 0}</span></div>
                    </div>
                    <div className="rounded-3xl bg-white/5 p-4">
                      <div className="flex items-center justify-between text-sm text-slate-300"><span>Tỷ lệ hợp lệ</span><span>{matchRate}%</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "candidates" && (
            <section className="space-y-6">
              {/* Sub-tab Toggle */}
              <div className="flex gap-4 border-b border-white/5 pb-4">
                <button
                  onClick={() => setCandidatesSubTab("applied")}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                    candidatesSubTab === "applied"
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Ứng viên đã nộp CV
                </button>
                <button
                  onClick={() => setCandidatesSubTab("suggested")}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                    candidatesSubTab === "suggested"
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Gợi ý ứng viên tiềm năng (AI)
                </button>
              </div>

              {candidatesSubTab === "applied" && (
                <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                  {/* Left Column: Applications List */}
                  <div className="rounded-3xl border border-white/10 bg-[#08101d] p-6 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-white">Danh sách đơn ứng tuyển</h2>
                        <p className="text-sm text-slate-400">Danh sách các sinh viên đã nộp hồ sơ ứng tuyển vào doanh nghiệp.</p>
                      </div>
                      <button
                        onClick={loadApplications}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 transition"
                      >
                        Làm mới
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(() => {
                        const appliedList = selectedJobId
                          ? applications.filter((app) => app.job && app.job.id === selectedJobId)
                          : applications;
                        
                        return appliedList.length > 0 ? (
                          appliedList.map((app) => (
                            <div key={app.application_id} className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:border-cyan-400/40 transition-all duration-300">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center flex-wrap gap-2.5">
                                    <h3 className="text-lg font-bold text-white">{app.student.full_name}</h3>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                                      app.status === 1
                                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                                        : app.status === 2
                                        ? "bg-red-500/10 text-red-300 border-red-500/20"
                                        : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                                    }`}>
                                      {app.status === 1 ? "Duyệt CV" : app.status === 2 ? "Đã từ chối" : "Chờ duyệt"}
                                    </span>
                                  </div>
                                  
                                  <p className="text-sm text-slate-400">Vị trí ứng tuyển: <span className="text-cyan-300 font-semibold">{app.job.title}</span></p>
                                  <p className="text-xs text-slate-500">Nộp lúc: {new Date(app.submitted_at).toLocaleString()}</p>
                                  
                                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-300 bg-black/20 p-3.5 rounded-2xl border border-white/5">
                                    <div><span className="text-slate-400">Email:</span> {app.student.email}</div>
                                    <div><span className="text-slate-400">Số điện thoại:</span> {app.student.phone || "Chưa cập nhật"}</div>
                                  </div>
                                </div>
                                
                                <div className="shrink-0 flex flex-col items-start md:items-end justify-between gap-4 min-h-[90px]">
                                  <div className="md:text-right">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider block mb-0.5">Điểm năng lực</span>
                                    <span className="text-2xl font-bold text-emerald-400">{app.student.score ? `${app.student.score}%` : "Chưa có"}</span>
                                  </div>
                                  {app.cv_url && (
                                    <a
                                      href={app.cv_url.startsWith("http") ? app.cv_url : `http://localhost:5000${app.cv_url}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs font-semibold px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition inline-flex items-center gap-1.5 border border-cyan-500/20"
                                    >
                                      Xem CV ↗
                                    </a>
                                  )}
                                </div>
                              </div>

                              {/* Strengths & Weaknesses */}
                              {(app.student.strengths || app.student.weaknesses) && (
                                <div className="mt-4 pt-4 border-t border-white/5 grid gap-4 sm:grid-cols-2 text-sm">
                                  {app.student.strengths && (
                                    <div className="rounded-2xl bg-[#0b1b17] border border-[#10b981]/15 p-3.5">
                                      <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block mb-1">Điểm mạnh</span>
                                      <p className="text-slate-300 leading-relaxed">{app.student.strengths}</p>
                                    </div>
                                  )}
                                  {app.student.weaknesses && (
                                    <div className="rounded-2xl bg-[#1c0f14] border border-[#ef4444]/15 p-3.5">
                                      <span className="text-xs text-red-400 font-semibold uppercase tracking-wider block mb-1">Điểm yếu</span>
                                      <p className="text-slate-300 leading-relaxed">{app.student.weaknesses}</p>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Action Buttons to update status */}
                              <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                                <span className="text-xs text-slate-400 font-medium">Cập nhật trạng thái duyệt CV:</span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleUpdateStatus(app.application_id, 0)}
                                    className={`text-xs px-4 py-2 rounded-xl transition-all duration-200 font-semibold border ${
                                      app.status === 0
                                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10"
                                        : "bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white"
                                    }`}
                                  >
                                    Chờ duyệt
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(app.application_id, 1)}
                                    className={`text-xs px-4 py-2 rounded-xl transition-all duration-200 font-semibold border ${
                                      app.status === 1
                                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10"
                                        : "bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white"
                                    }`}
                                  >
                                    Duyệt CV
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(app.application_id, 2)}
                                    className={`text-xs px-4 py-2 rounded-xl transition-all duration-200 font-semibold border ${
                                      app.status === 2
                                        ? "bg-red-500/20 text-red-300 border-red-500/40 shadow-sm shadow-red-500/10"
                                        : "bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white"
                                    }`}
                                  >
                                    Từ chối
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-400">
                            Không tìm thấy đơn ứng tuyển nào phù hợp.
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Right Column: Filters & AI report card */}
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-[#08101d] p-6">
                      <h3 className="text-lg font-semibold mb-4 text-white">Bộ lọc nhanh</h3>
                      <div className="space-y-4">
                        <div className="space-y-2 rounded-3xl bg-white/5 p-4">
                          <label className="text-xs text-slate-400 uppercase tracking-wider block font-medium">Vị trí tuyển dụng</label>
                          <select
                            value={selectedJobId || ""}
                            onChange={(e) => setSelectedJobId(e.target.value || null)}
                            className="w-full rounded-2xl border border-white/10 bg-[#0b121f] p-3.5 text-sm text-white outline-none focus:border-cyan-400 transition"
                          >
                            <option value="">Tất cả vị trí đã đăng</option>
                            {jobs.map((j) => (
                              <option key={j.job_id} value={j.job_id}>
                                {j.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#08101d] p-6">
                      <h3 className="text-lg font-semibold mb-2 text-white">AI Phân Tích Báo Cáo</h3>
                      <p className="text-sm text-slate-400 leading-relaxed mb-4">
                        Hệ thống sẽ tổng hợp kết quả thi năng lực, thế mạnh của các ứng viên đã nộp để đề xuất báo cáo tuyển dụng phù hợp nhất.
                      </p>
                      <button
                        onClick={handleGenerateAIReport}
                        className="w-full rounded-2xl bg-cyan-500 hover:bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
                      >
                        Xem báo cáo AI ⚡
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {candidatesSubTab === "suggested" && (
                <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-3xl border border-white/10 bg-[#08101d] p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold text-white">Bộ lọc ứng viên thông minh</h2>
                        <p className="text-sm text-slate-400">Lọc theo kỹ năng và điểm đánh giá thực tế từ hệ thống.</p>
                      </div>
                      <button
                        onClick={loadCandidates}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                      >
                        Làm mới
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2 rounded-3xl bg-white/5 p-4">
                        <label className="text-sm text-slate-300">Kỹ năng tìm kiếm</label>
                        <input
                          value={filterSkill}
                          onChange={(e) => setFilterSkill(e.target.value)}
                          placeholder="React, Node, Python..."
                          className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none"
                        />
                      </div>
                      <div className="space-y-2 rounded-3xl bg-white/5 p-4">
                        <div className="flex items-center justify-between text-sm text-slate-300">
                          <span>Điểm tối thiểu</span>
                          <span>{filterScore}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={filterScore}
                          onChange={(e) => setFilterScore(Number(e.target.value))}
                          className="w-full accent-cyan-400"
                        />
                      </div>
                      <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-400">
                        Thực hiện lọc dựa trên giải pháp đánh giá và báo cáo của sinh viên.
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-[#08101d] p-6">
                    <h2 className="text-xl font-semibold text-white">Ứng viên phù hợp</h2>
                    <p className="mt-2 text-sm text-slate-400">Danh sách sinh viên được lọc từ đánh giá năng lực và lộ trình học.</p>
                    <div className="mt-6 space-y-4">
                      {candidates.length > 0 ? (
                        candidates.map((candidate) => (
                          <div key={candidate.user_id} className="rounded-3xl border border-white/10 bg-white/5 p-4 hover:border-cyan-400/40 transition">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <div className="font-semibold text-white">{candidate.full_name}</div>
                                <div className="text-sm text-slate-400">{candidate.latestRoadmap?.career?.career_name || "Sinh viên"}</div>
                              </div>
                              <div className="rounded-2xl bg-green-500/10 px-3 py-1 text-sm text-emerald-300">
                                {candidate.latestAttempt?.score ? `${candidate.latestAttempt.score}%` : "Chưa có điểm"}
                              </div>
                            </div>
                            <div className="mt-3 text-sm text-slate-400">
                              {candidate.latestAttempt?.assessment?.title || "Không có đánh giá gần nhất"}
                            </div>
                            <div className="mt-3 text-sm text-slate-400">
                              {candidate.latestReport?.strengths ? `Điểm mạnh: ${candidate.latestReport.strengths}` : "Không có báo cáo"}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">Không có ứng viên phù hợp. Thử thay đổi bộ lọc hoặc tạo thêm tin tuyển dụng.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {activeTab === "jobs" && (
            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-white/10 bg-[#08101d] p-6">
                  <h2 className="text-xl font-semibold">Đăng tin tuyển dụng</h2>
                  <p className="mt-2 text-sm text-slate-400">Nhập tiêu đề, mô tả, lương và tag kỹ năng để bắt đầu.</p>
                  <div className="mt-6 space-y-4">
                    <input
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Tiêu đề tuyển dụng"
                      className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none"
                    />
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Mô tả công việc"
                      rows="4"
                      className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none"
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        value={jobSalary}
                        onChange={(e) => setJobSalary(e.target.value)}
                        placeholder="Mức lương"
                        className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none"
                      />
                      <input
                        value={jobLocation}
                        onChange={(e) => setJobLocation(e.target.value)}
                        placeholder="Địa điểm"
                        className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none"
                      />
                    </div>
                    <input
                      value={jobSkills}
                      onChange={(e) => setJobSkills(e.target.value)}
                      placeholder="Tags kỹ năng (Node.js, SQL...)"
                      className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none"
                    />
                    <button
                      onClick={handleCreateJob}
                      disabled={loading}
                      className="w-full rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition"
                    >
                      Đăng chiến dịch
                    </button>
                    <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Đã đăng {jobs.length} vị trí</span>
                        <span>{jobs.length ? `${jobs.length} vị trí đang mở` : "Chưa có vị trí"}</span>
                      </div>
                      {jobs.length > 0 ? (
                        <div className="mt-4 space-y-3">
                          {jobs.map((job) => (
                            <div 
                              key={job.job_id} 
                              onClick={() => setSelectedJobId(selectedJobId === job.job_id ? null : job.job_id)}
                              className={`rounded-3xl border p-4 relative group cursor-pointer transition-all duration-300 ${
                                selectedJobId === job.job_id 
                                  ? "border-cyan-400 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                                  : "border-white/10 bg-[#0b121f] hover:border-cyan-500/30 hover:bg-[#0f1724]"
                              }`}
                            >
                              <div className="flex items-center justify-between text-sm text-white">
                                <span className={`font-semibold transition-colors duration-300 ${selectedJobId === job.job_id ? "text-cyan-300" : "text-white group-hover:text-cyan-300"}`}>{job.title}</span>
                                <span className="text-slate-400">{job.status}</span>
                              </div>
                              <div className="mt-2 text-sm text-slate-400">{job.location ? `Địa điểm: ${job.location}` : "Địa điểm chưa cập nhật"}</div>
                              <div className="mt-2 text-sm text-slate-400">{job.salary_range ? `Mức lương: ${job.salary_range}` : "Lương chưa cập nhật"}</div>
                              <div className="mt-2 text-sm text-slate-400">{job.required_skills || "Không có kỹ năng"}</div>
                              <div className="mt-3 flex gap-2 justify-end border-t border-white/5 pt-3">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectEditJob(job);
                                  }}
                                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition"
                                >
                                  Sửa
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteJob(job.job_id);
                                  }}
                                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-500/20 transition"
                                >
                                  Xóa
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-4 text-sm text-slate-400">Tạo tin tuyển dụng để thu hút ứng viên thực tế.</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#08101d] p-6">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold">
                      {selectedJobId 
                        ? `ATS - ${jobs.find(j => j.job_id === selectedJobId)?.title || "Chi tiết"}`
                        : "ATS (Tất cả ứng viên)"}
                    </h2>
                    {selectedJobId && (
                      <button
                        onClick={() => setSelectedJobId(null)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition"
                      >
                        Xem tất cả
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    {selectedJobId 
                      ? "Hiển thị các ứng viên đã nộp CV cho tin tuyển dụng này." 
                      : "Quản lý ứng viên theo quy trình tuyển dụng."}
                  </p>
                  <div className="mt-6 space-y-3">
                    {filteredApplications.length > 0 ? (
                      filteredApplications.map((application) => (
                        <div key={application.application_id} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                          <div className="flex items-center justify-between text-white">
                            <span className="font-semibold">{application.student.full_name}</span>
                            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs uppercase text-cyan-200">{application.status}</span>
                          </div>
                          <div className="mt-2 text-sm text-slate-400">Vị trí: {application.job.title}</div>
                          <div className="mt-1 text-sm text-slate-400">Nộp: {new Date(application.submitted_at).toLocaleDateString()}</div>
                          {application.cv_url && (
                            <div className="mt-3 flex justify-end border-t border-white/5 pt-2">
                              <a
                                href={application.cv_url.startsWith("http") ? application.cv_url : `http://localhost:5000${application.cv_url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition inline-flex items-center gap-1"
                              >
                                Xem CV ↗
                              </a>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
                        {selectedJobId 
                          ? "Chưa có ứng viên nộp đơn cho vị trí này." 
                          : "Chưa có ứng viên nộp đơn. Tạo tin tuyển dụng để bắt đầu."}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "branding" && (
            <section className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-[#08101d] p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Trang thông tin công ty</h2>
                    <p className="mt-2 text-sm text-slate-400">Cập nhật logo, banner và văn hóa công ty.</p>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
                  >
                    Lưu hồ sơ
                  </button>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <input
                    value={profileForm.company_name}
                    onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })}
                    placeholder="Tên công ty"
                    className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none"
                  />
                  <input
                    value={profileForm.website}
                    onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                    placeholder="Website"
                    className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none"
                  />
                </div>
                <textarea
                  value={profileForm.description}
                  onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                  placeholder="Mô tả công ty"
                  rows="4"
                  className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none"
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  <input
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="Số điện thoại"
                    className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none"
                  />
                  <input
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    placeholder="Địa điểm"
                    className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none"
                  />
                  <input
                    value={profileForm.industry}
                    onChange={(e) => setProfileForm({ ...profileForm, industry: e.target.value })}
                    placeholder="Ngành nghề"
                    className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#08101d] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Hình ảnh thương hiệu</h2>
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-300">Cập nhật</span>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Logo Card */}
                  <div className="flex flex-col space-y-3">
                    <label className="text-sm font-medium text-slate-300">Logo công ty</label>
                    <div 
                      onClick={() => document.getElementById("logo-upload-input").click()}
                      className="group relative flex flex-col items-center justify-center h-48 rounded-3xl border-2 border-dashed border-white/10 hover:border-cyan-500/50 bg-[#0b121f] overflow-hidden cursor-pointer transition-all duration-300"
                    >
                      {profileForm.logo ? (
                        <>
                          <img 
                            src={profileForm.logo.startsWith("http") ? profileForm.logo : `http://localhost:5000${profileForm.logo}`} 
                            alt="Company Logo" 
                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300">
                            <Upload className="text-cyan-400 mb-2" size={24} />
                            <span className="text-xs text-cyan-300 font-semibold">Thay đổi Logo</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center space-y-2 text-slate-400 group-hover:text-cyan-300 transition-colors">
                          <div className="p-4 rounded-full bg-white/5 group-hover:bg-cyan-500/10 transition-colors">
                            <Upload size={24} />
                          </div>
                          <span className="text-sm font-semibold">Tải lên Logo</span>
                          <span className="text-xs text-slate-500">Định dạng JPG, PNG tối đa 10MB</span>
                        </div>
                      )}
                      <input 
                        id="logo-upload-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadFile(e, "logo")}
                      />
                    </div>
                  </div>

                  {/* Banner Card */}
                  <div className="flex flex-col space-y-3">
                    <label className="text-sm font-medium text-slate-300">Banner giới thiệu</label>
                    <div 
                      onClick={() => document.getElementById("banner-upload-input").click()}
                      className="group relative flex flex-col items-center justify-center h-48 rounded-3xl border-2 border-dashed border-white/10 hover:border-cyan-500/50 bg-[#0b121f] overflow-hidden cursor-pointer transition-all duration-300"
                    >
                      {profileForm.banner ? (
                        <>
                          <img 
                            src={profileForm.banner.startsWith("http") ? profileForm.banner : `http://localhost:5000${profileForm.banner}`} 
                            alt="Company Banner" 
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300">
                            <Upload className="text-cyan-400 mb-2" size={24} />
                            <span className="text-xs text-cyan-300 font-semibold">Thay đổi Banner</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center space-y-2 text-slate-400 group-hover:text-cyan-300 transition-colors">
                          <div className="p-4 rounded-full bg-white/5 group-hover:bg-cyan-500/10 transition-colors">
                            <ImageIcon size={24} />
                          </div>
                          <span className="text-sm font-semibold">Tải lên Banner giới thiệu</span>
                          <span className="text-xs text-slate-500">Định dạng JPG, PNG tối đa 10MB</span>
                        </div>
                      )}
                      <input 
                        id="banner-upload-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadFile(e, "banner")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "billing" && (
            <section className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-[#08101d] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Gói dịch vụ hiện tại</h2>
                    <p className="mt-2 text-sm text-slate-400">Free / Premium & hạn mức còn lại.</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold border ${
                    overview?.subscription?.planType === "PREMIUM"
                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                      : "bg-cyan-500/10 text-cyan-200 border-cyan-500/20"
                  }`}>
                    Gói: {overview?.subscription?.planType || "FREE"}
                  </span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-slate-300">
                    <div className="text-slate-500">Hạn mức xem CV sinh viên</div>
                    <div className="mt-3 text-2xl font-semibold">{overview?.subscription?.cvViewLimit ?? 10} lượt</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-slate-300">
                    <div className="text-slate-500">Tin tuyển dụng tối đa</div>
                    <div className="mt-3 text-2xl font-semibold">{overview?.totalJobs ?? 0} / {overview?.subscription?.jobLimit ?? 3} tin</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-slate-300">
                    <div className="text-slate-500">Chiến dịch quảng cáo (Ads)</div>
                    <div className="mt-3 text-2xl font-semibold">3 / 5 chiến dịch</div>
                  </div>
                </div>
              </div>

              {overview?.subscription?.planType !== "PREMIUM" ? (
                <div className="rounded-3xl border border-dashed border-cyan-500/30 bg-cyan-500/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-cyan-300">Nâng cấp lên gói PREMIUM B2B</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Mở khóa đầy đủ các tính năng: Đăng tin tối đa 15 vị trí, tải xem 50 CV sinh viên, và sử dụng AI phân tích báo cáo chuyên sâu.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="shrink-0 rounded-2xl bg-cyan-500 hover:bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition shadow-lg shadow-cyan-500/10"
                  >
                    Nâng cấp gói (1.200.000đ/tháng)
                  </button>
                </div>
              ) : (
                <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">✓</div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-400">Gói PREMIUM đang hoạt động</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Gói dịch vụ của doanh nghiệp hoạt động đầy đủ tính năng B2B. Thời hạn đến ngày: {overview?.subscription?.endDate ? new Date(overview.subscription.endDate).toLocaleDateString("vi-VN") : "Hạn dài"}.
                    </p>
                  </div>
                </div>
              )}

              <div className="rounded-3xl border border-white/10 bg-[#08101d] p-6">
                <h2 className="text-xl font-semibold text-white">Lịch sử giao dịch</h2>
                <div className="mt-4 space-y-3">
                  {transactions.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>{item.id}</span>
                        <span>{item.date}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-base font-semibold text-white">
                        <span>{item.amount}</span>
                        <span className={item.status === "Nâng cấp B2B" ? "text-cyan-400" : "text-slate-300"}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#08101d] p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-cyan-300">Chỉnh sửa tin tuyển dụng</h3>
              <button 
                onClick={handleCancelEdit} 
                className="text-slate-400 hover:text-white transition text-lg p-2"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2 font-medium">Tiêu đề tuyển dụng</label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Tiêu đề tuyển dụng"
                  className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2 font-medium">Mô tả công việc</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Mô tả công việc"
                  rows="4"
                  className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2 font-medium">Mức lương</label>
                  <input
                    value={editSalary}
                    onChange={(e) => setEditSalary(e.target.value)}
                    placeholder="Mức lương"
                    className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2 font-medium">Địa điểm</label>
                  <input
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="Địa điểm"
                    className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2 font-medium">Tags kỹ năng (Node.js, SQL...)</label>
                <input
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  placeholder="Tags kỹ năng (Node.js, SQL...)"
                  className="w-full rounded-3xl border border-white/10 bg-[#0b121f] p-4 text-sm text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>

              <div className="flex gap-3 mt-8 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="rounded-3xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-white hover:bg-white/10 transition font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateJob}
                  disabled={loading}
                  className="rounded-3xl bg-cyan-500 hover:bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60 transition"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Report Modal */}
      {showAIReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#08101d] p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-2xl font-bold text-cyan-300 flex items-center gap-2">
                <span>Báo Cáo Tuyển Dụng AI</span>
                <span className="text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2.5 py-0.5 rounded-full uppercase">Powered by DeepSeek</span>
              </h3>
              <button 
                onClick={() => setShowAIReportModal(false)} 
                className="text-slate-400 hover:text-white transition text-lg p-2"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-sm leading-relaxed text-slate-300">
              {aiReportLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent"></div>
                  <p className="text-slate-400 text-sm animate-pulse text-center">DeepSeek AI đang tổng hợp điểm số và phân tích hồ sơ ứng viên...</p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none whitespace-pre-wrap font-sans bg-black/20 p-6 rounded-2xl border border-white/5">
                  {aiReport}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-white/5 shrink-0">
              <button
                onClick={() => setShowAIReportModal(false)}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#08101d] p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-cyan-300">Thanh Toán Dịch Vụ B2B</h3>
              <button 
                onClick={() => setShowPaymentModal(false)} 
                className="text-slate-400 hover:text-white transition text-lg p-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Gói nâng cấp:</span>
                  <span className="text-cyan-300 font-bold">PREMIUM B2B</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Thời hạn sử dụng:</span>
                  <span className="text-white">30 ngày</span>
                </div>
                <div className="flex justify-between text-sm border-t border-white/5 pt-3">
                  <span className="text-slate-400">Tổng phí thanh toán:</span>
                  <span className="text-xl font-extrabold text-[#00E5FF]">1.200.000đ</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Thông tin chuyển khoản ngân hàng</h4>
                <div className="bg-[#0b121f] p-4 rounded-2xl border border-white/5 space-y-2 text-sm text-slate-300">
                  <div><span className="text-slate-500">Ngân hàng:</span> <span className="font-semibold text-white">MB Bank (Quân Đội)</span></div>
                  <div><span className="text-slate-500">Số tài khoản:</span> <span className="font-semibold text-white tracking-wider">9999 8888 6666</span></div>
                  <div><span className="text-slate-500">Chủ tài khoản:</span> <span className="font-semibold text-white uppercase">VIETFUTURE TECH INC</span></div>
                  <div><span className="text-slate-500">Nội dung:</span> <span className="font-semibold text-cyan-400 tracking-wider">VF B2B UPGRADE</span></div>
                </div>
              </div>

              {/* Mock QR code container */}
              <div className="flex flex-col items-center justify-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-40 h-40 bg-white p-2 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-lg">
                  {/* Clean SVG QR mockup representation */}
                  <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" />
                    <rect x="10" y="10" width="10" height="10" fill="white" />
                    <rect x="70" y="0" width="30" height="30" />
                    <rect x="80" y="10" width="10" height="10" fill="white" />
                    <rect x="0" y="70" width="30" height="30" />
                    <rect x="10" y="80" width="10" height="10" fill="white" />
                    <rect x="40" y="40" width="20" height="20" />
                    <rect x="45" y="45" width="10" height="10" fill="white" />
                    {/* Random noise squares */}
                    <rect x="40" y="10" width="5" height="15" />
                    <rect x="50" y="5" width="10" height="5" />
                    <rect x="10" y="40" width="15" height="5" />
                    <rect x="5" y="50" width="5" height="10" />
                    <rect x="80" y="40" width="10" height="15" />
                    <rect x="70" y="50" width="5" height="5" />
                    <rect x="40" y="70" width="15" height="10" />
                    <rect x="50" y="85" width="15" height="5" />
                    <rect x="85" y="80" width="5" height="10" />
                  </svg>
                </div>
                <span className="text-[11px] text-slate-400 mt-2.5">Quét mã QR bằng App Ngân hàng để thanh toán nhanh</span>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-1/3 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpgradeSubscription}
                  disabled={loading}
                  className="w-2/3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 py-3 text-sm font-bold text-slate-950 disabled:opacity-60 transition shadow-lg shadow-cyan-500/15"
                >
                  {loading ? "Đang xác nhận..." : "Xác nhận đã thanh toán"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
