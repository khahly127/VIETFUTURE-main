import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// Import thêm ArrowRight từ thư viện lucide-react để đồng bộ icon cho nút bấm mới
import { ArrowRight } from "lucide-react";

export default function Roadmap2() {
const navigate = useNavigate();

// ── STATE MANAGEMENT ──
const [aiData, setAiData] = useState(null);
const [currentNodeId, setCurrentNodeId] = useState(null);
const [loading, setLoading] = useState(true);

const treeWrapRef = useRef(null);
const svgRef = useRef(null);

// ── HOOK LOAD DATA & FALLBACK ──
useEffect(() => {
// Mô phỏng hiệu ứng quét AI chạy mượt trong 800ms
const timer = setTimeout(() => {
let storedData = null;
try {
// Kiểm tra cả 2 key lưu trữ để tránh lỗi đồng bộ
const raw = localStorage.getItem("devpath_ai_result") || localStorage.getItem("devpath_analysis_result");
if (raw) storedData = JSON.parse(raw);
} catch (e) {
console.error("Lỗi đọc dữ liệu roadmap từ localStorage", e);
}

// Nếu dữ liệu từ UploadCV truyền sang ở dạng rút gọn, ta map nó vào cấu trúc giao diện chuẩn
if (storedData && !storedData.nodes) {
storedData = generateFullDataFromSimple(storedData.role, storedData.missing || [], storedData.hasCV);
}

// Nếu hoàn toàn chưa có d
status: "todo", pct: 0, cvMatch: false,
checklist: ["Mã hóa bảo mật mật khẩu với thư viện bcrypt", "Cấp phát Access Token & Refresh Token", "Phân quyền người dùng dựa trên vai trò (RBAC)"],
checkState: [false, false, false, false],
resources: [{ icon: "📖", type: "doc", title: "Introduction to JSON Web Tokens", meta: "jwt.io", tag: "free" }]
},
docker: {
icon: "🐳", title: "Đóng gói Docker", sub: "Containers, Dockerfile, Docker Compose",
desc: "Đóng gói toàn bộ ứng dụng và môi trường chạy vào bên trong Container nhằm triệt tiêu lỗi cục bộ khi triển khai máy chủ.",
status: "todo", pct: 0, cvMatch: false,
checklist: ["Viết file cấu hình Dockerfile tối ưu", "Quản lý đa dịch vụ qua Docker Compose", "Tạo ổ đĩa lưu trữ Volume & thiết lập Network"],
checkState: [false, false, false],
resources: [{ icon: "🎬", type: "free", title: "Docker Containerization Crash Course", meta: "TechWorld with Nana", tag: "free" }]
},
redis: {
icon: "⚡", title: "Redis Caching", sub: "In-memory store, Cache patterns, TTL",
desc: "Tăng cường năng lực xử lý chịu tải hệ thống gấp 10 lần nhờ giải pháp bộ nhớ đệm In-memory siêu tốc Redis.",
status: "todo", pct: 0, cvMatch: false,
checklist: ["Ứng dụng cấu hình Cache-aside pattern", "Thiết lập thời gian hủy bộ đệm (TTL)", "Sử dụng Redis lưu trữ dữ liệu tạm thời"],
checkState: [false, false, false],
resources: [{ icon: "🎬", type: "free", title: "Redis Crash Course", meta: "Amigoscode", tag: "free" }]
}
}
};
}