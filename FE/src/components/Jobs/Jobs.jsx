import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Building2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import axiosClient from "../../api/axiosClient";
import Navbar from "../Layout/Navbar";

function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [cvUrl, setCvUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applyMessage, setApplyMessage] = useState({ type: "", text: "" });

  const handleApply = async (e) => {
    e.preventDefault();
    if (!cvFile && !cvUrl) {
      setApplyMessage({ type: "error", text: "Vui lòng chọn file CV hoặc nhập link CV." });
      return;
    }

    try {
      setSubmitting(true);
      setApplyMessage({ type: "", text: "" });

      const formData = new FormData();
      if (cvFile) {
        formData.append("cv", cvFile);
      } else {
        formData.append("cvUrl", cvUrl);
      }

      await axiosClient.post(`/employer/public-jobs/${selectedJob.job_id}/apply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setApplyMessage({ type: "success", text: "Ứng tuyển thành công! CV của bạn đã được gửi tới nhà tuyển dụng." });
      setCvFile(null);
      setCvUrl("");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || "Lỗi khi nộp hồ sơ. Vui lòng thử lại.";
      setApplyMessage({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await axiosClient.get("/employer/public-jobs");
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Không thể tải danh sách việc làm. Vui lòng thử lại sau.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="bg-[#080c10] min-h-screen text-white">
      <Navbar
        onUploadClick={() => navigate("/upload")}
        onJobsClick={() => navigate("/jobs")}
        onLoginClick={() => navigate("/login")}
      />

      <main className="max-w-[1300px] mx-auto px-6 py-16">
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.3em] text-cyan-300">
            <Building2 size={16} />
            Tin tuyển dụng
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white">
            Cơ hội việc làm từ doanh nghiệp đã đăng
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/60 leading-relaxed">
            Xem nhanh các tin tuyển dụng thật sự từ doanh nghiệp, cập nhật vị
            trí, lương, địa điểm và yêu cầu kỹ năng.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-200">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
            Hiện chưa có tin tuyển dụng nào. Hãy quay lại sau khi doanh nghiệp
            đăng tin.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {jobs.map((job) => (
              <div
                key={job.job_id}
                className="rounded-[2rem] border border-white/10 bg-[#0d1324] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-1"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
                      {job.company_logo ? (
                        <img
                          src={job.company_logo}
                          alt={job.company_name}
                          className="h-10 w-10 rounded-2xl object-cover border border-white/10"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-cyan-300">
                          <Briefcase size={18} />
                        </div>
                      )}
                      <span className="font-semibold text-white">
                        {job.company_name || "Doanh nghiệp"}
                      </span>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-white">
                      {job.title}
                    </h2>
                    <p className="mt-3 text-white/60 leading-relaxed">
                      {job.description || "Mô tả công việc chưa cập nhật."}
                    </p>
                  </div>

                  <div className="min-w-[180px] rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <div className="mb-3 flex items-center gap-2 text-white/80">
                      <MapPin size={16} />
                      {job.location || "Địa điểm chưa cập nhật"}
                    </div>
                    <div className="mb-3 flex items-center gap-2 text-white/80">
                      <DollarSign size={16} />
                      {job.salary_range || "Lương chưa cập nhật"}
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Briefcase size={16} />
                      {job.status}
                    </div>
                  </div>
                </div>

                {job.required_skills ? (
                  <div className="mt-6">
                    <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">
                      Kỹ năng
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.required_skills.split(",").map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-white/50">
                  <div>
                    {job.company_description
                      ? `${job.company_description.substring(0, 100)}...`
                      : "Thông tin doanh nghiệp chưa có."}
                  </div>
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="inline-flex items-center gap-2 text-cyan-300 font-semibold hover:text-cyan-200 transition cursor-pointer"
                  >
                    Chi tiết
                    <ArrowRight size={18} className="rotate-45" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-[2.5rem] border border-white/10 bg-[#0c1222] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => { setSelectedJob(null); setApplyMessage({ type: "", text: "" }); }} 
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition p-2 text-xl"
            >
              ✕
            </button>

            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/60 border-b border-white/5 pb-4">
                {selectedJob.company_logo ? (
                  <img
                    src={selectedJob.company_logo}
                    alt={selectedJob.company_name}
                    className="h-12 w-12 rounded-2xl object-cover border border-white/10"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-cyan-300">
                    <Briefcase size={22} />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-lg text-white">
                    {selectedJob.company_name || "Doanh nghiệp"}
                  </div>
                  <div className="text-xs text-cyan-400 mt-0.5">Tuyển dụng trực tiếp</div>
                </div>
              </div>

              {/* Title & Info Card */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">{selectedJob.title}</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/80">
                    <MapPin size={18} className="text-cyan-400" />
                    <div>
                      <div className="text-xs text-slate-400">Địa điểm</div>
                      <div className="font-semibold mt-0.5">{selectedJob.location || "Chưa cập nhật"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/80">
                    <DollarSign size={18} className="text-emerald-400" />
                    <div>
                      <div className="text-xs text-slate-400">Mức lương</div>
                      <div className="font-semibold mt-0.5">{selectedJob.salary_range || "Chưa cập nhật"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/80">
                    <Briefcase size={18} className="text-violet-400" />
                    <div>
                      <div className="text-xs text-slate-400">Trạng thái</div>
                      <div className="font-semibold mt-0.5">{selectedJob.status}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills required */}
              {selectedJob.required_skills && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-300 mb-2">Kỹ năng yêu cầu</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.required_skills.split(",").map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-white/80"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-300 mb-2">Mô tả công việc</h4>
                <p className="text-white/70 leading-relaxed whitespace-pre-line text-sm bg-white/5 p-5 rounded-2xl border border-white/5">
                  {selectedJob.description || "Chưa có mô tả chi tiết."}
                </p>
              </div>

              {/* About Company */}
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-cyan-300 mb-2">Thông tin doanh nghiệp</h4>
                <p className="text-white/60 leading-relaxed text-sm">
                  {selectedJob.company_description || "Thông tin doanh nghiệp đang được cập nhật."}
                </p>
              </div>

              {/* Apply / CV Upload Section */}
              <div className="border-t border-white/10 pt-6 mt-4">
                <h4 className="text-lg font-bold text-white mb-4">Nộp hồ sơ ứng tuyển</h4>
                
                {!localStorage.getItem("token") ? (
                  <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5 text-sm text-yellow-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span>Bạn cần đăng nhập bằng tài khoản Sinh viên để nộp đơn ứng tuyển cho công việc này.</span>
                    <button
                      onClick={() => navigate("/login")}
                      className="rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-semibold px-4 py-2 transition text-xs whitespace-nowrap"
                    >
                      Đăng nhập ngay
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    {applyMessage.text && (
                      <div className={`rounded-2xl border p-4 text-sm ${
                        applyMessage.type === "success" 
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" 
                          : "border-red-500/20 bg-red-500/10 text-red-300"
                      }`}>
                        {applyMessage.text}
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-[#090e1b] p-4 text-center cursor-pointer hover:border-cyan-400/40 transition">
                        <label className="cursor-pointer block">
                          <span className="text-sm font-medium text-cyan-300 block mb-1">Tải lên file CV (.pdf, .docx)</span>
                          <span className="text-xs text-slate-500 block mb-3">Tối đa 10MB</span>
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx,.png,.jpg" 
                            onChange={(e) => {
                              setCvFile(e.target.files[0] || null);
                              setCvUrl("");
                            }}
                            className="hidden" 
                          />
                          <span className="inline-block rounded-xl bg-white/5 border border-white/10 text-white text-xs px-4 py-2 font-medium">
                            {cvFile ? cvFile.name : "Chọn file"}
                          </span>
                        </label>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-[#090e1b] p-4 flex flex-col justify-between">
                        <div>
                          <label className="text-sm font-medium text-cyan-300 block mb-1">Hoặc dán Link CV</label>
                          <span className="text-xs text-slate-500 block mb-3">Google Drive, Dropbox...</span>
                        </div>
                        <input
                          type="url"
                          value={cvUrl}
                          onChange={(e) => {
                            setCvUrl(e.target.value);
                            setCvFile(null);
                          }}
                          placeholder="https://drive.google.com/..."
                          className="w-full rounded-xl border border-white/10 bg-[#0b121f] px-3 py-2 text-xs text-white outline-none focus:border-cyan-400 transition"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => { setSelectedJob(null); setApplyMessage({ type: "", text: "" }); }}
                        className="rounded-3xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-white hover:bg-white/10 transition font-semibold"
                      >
                        Đóng
                      </button>
                      <button
                        type="submit"
                        disabled={submitting || (!cvFile && !cvUrl)}
                        className="rounded-3xl bg-cyan-500 hover:bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50 transition flex items-center gap-2"
                      >
                        {submitting && <Loader2 size={16} className="animate-spin" />}
                        Nộp hồ sơ ứng tuyển
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;
