import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Roadmap2() {
  const navigate = useNavigate();

  const [aiData, setAiData] = useState(null);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [loading, setLoading] = useState(true);

  const treeWrapRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      let storedData = null;
      try {
        const raw =
          localStorage.getItem("devpath_ai_result") ||
          localStorage.getItem("devpath_analysis_result");
        if (raw) storedData = JSON.parse(raw);
      } catch (e) {
        console.error("Lỗi đọc dữ liệu roadmap từ localStorage", e);
      }

      if (storedData && !storedData.nodes) {
        storedData = generateFullDataFromSimple(
          storedData.role,
          storedData.missing || [],
          storedData.hasCV,
        );
      }

      if (!storedData) {
        storedData = getDemoDataForRole("backend");
        storedData.hasCV = true;
      }

      setAiData(storedData);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const drawConnectors = () => {
    if (!aiData || !svgRef.current || !treeWrapRef.current) return;

    const svg = svgRef.current;
    const wrap = treeWrapRef.current;
    svg.style.height = `${wrap.offsetHeight}px`;
    svg.innerHTML = "";
    const wRect = wrap.getBoundingClientRect();

    (aiData.connections || []).forEach(([fromId, toId]) => {
      const fromEl = document.getElementById(`node-${fromId}`);
      const toEl = document.getElementById(`node-${toId}`);
      if (!fromEl || !toEl) return;

      const fr = fromEl.getBoundingClientRect();
      const tr = toEl.getBoundingClientRect();

      const x1 = fr.right - wRect.left;
      const y1 = fr.top + fr.height / 2 - wRect.top + 10;
      const x2 = tr.left - wRect.left;
      const y2 = tr.top + tr.height / 2 - wRect.top + 10;
      const mx = (x1 + x2) / 2;

      const fromNode = aiData.nodes[fromId];

      let strokeColor = "#1e293b";
      let strokeWidth = "1.2";
      let isDashed = true;

      if (fromNode) {
        if (fromNode.status === "done") {
          strokeColor = "#10b981";
          strokeWidth = "2";
          isDashed = false;
        } else if (fromNode.status === "in-progress") {
          strokeColor = "#00e5ff";
          strokeWidth = "2";
          isDashed = false;
        }
      }

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      path.setAttribute(
        "d",
        `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`,
      );
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", strokeColor);
      path.setAttribute("stroke-width", strokeWidth);
      path.setAttribute("opacity", "0.7");
      if (isDashed) path.setAttribute("stroke-dasharray", "4,4");

      svg.appendChild(path);
    });
  };

  useEffect(() => {
    if (!loading && aiData) {
      const t = setTimeout(drawConnectors, 100);
      window.addEventListener("resize", drawConnectors);
      return () => {
        window.removeEventListener("resize", drawConnectors);
        clearTimeout(t);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, aiData, currentNodeId]);

  const openNode = (id) => setCurrentNodeId(id);
  const closePanel = () => setCurrentNodeId(null);

  const toggleCheck = (nodeId, idx, isChecked) => {
    const updatedData = { ...aiData };
    const node = updatedData.nodes[nodeId];
    node.checkState[idx] = isChecked;
    const checkedCount = node.checkState.filter(Boolean).length;
    node.pct = Math.round((checkedCount / node.checkState.length) * 100);
    if (node.pct === 100) node.status = "done";
    else if (node.pct > 0) node.status = "in-progress";
    else node.status = "todo";
    setAiData(updatedData);
    localStorage.setItem("devpath_ai_result", JSON.stringify(updatedData));
  };

  const toggleDoneDirectly = (nodeId) => {
    const updatedData = { ...aiData };
    const node = updatedData.nodes[nodeId];
    node.status = "done";
    node.pct = 100;
    node.checkState = node.checkState.map(() => true);
    setAiData(updatedData);
    localStorage.setItem("devpath_ai_result", JSON.stringify(updatedData));
  };

  const getAllProgressStats = () => {
    if (!aiData) return { pct: 0, done: 0, todo: 0 };
    const nodesArray = Object.values(aiData.nodes);
    const done = nodesArray.filter((n) => n.status === "done").length;
    const pct = Math.round((done / nodesArray.length) * 100) || 0;
    return { pct, done, todo: nodesArray.length - done };
  };

  const stats = getAllProgressStats();
  const activeNode = currentNodeId ? aiData?.nodes[currentNodeId] : null;

  // ── LOADING ──
  if (loading) {
    return (
      <div className="bg-[#080c10] min-h-screen flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-slate-800 border-t-[#00e5ff] rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm">Đang tải lộ trình...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#080c10] text-[#e8edf5] min-h-screen font-sans flex flex-col select-none antialiased">
      {/* ── 1. HEADER ── */}
      <nav className="sticky top-0 z-50 bg-[#080c10]/90 backdrop-blur-md border-b border-[#111c2e] flex items-center justify-between px-6 md:px-10 h-14">
        <span
          onClick={() => navigate("/")}
          className="font-bold text-base tracking-wider text-white cursor-pointer"
        >
          Dev<span className="text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">Path</span> AI
        </span>

        <div className="hidden md:flex items-center gap-1 text-sm text-slate-500">
          <span>Lộ trình</span>
          <span className="mx-1 text-slate-700">/</span>
          <span className="text-white font-medium">{aiData.role}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1e40af] flex items-center justify-center text-xs font-bold text-white">
            {aiData.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <span className="hidden sm:inline text-sm text-slate-300">
            {aiData.username || "Học viên"}
          </span>
        </div>
      </nav>

      {/* ── 2. INFO BANNER ── */}
      <div className="bg-[#080c10]/80 border-b border-[#111c2e] px-6 md:px-10 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-slate-400">
          {aiData.hasCV ? (
            <>
              🤖 AI phân tích CV và thiết lập bản đồ hành trình <strong className="text-white font-semibold">{aiData.role}</strong> · Độ tương thích hiện tại: <strong className="text-[#00e5ff] font-bold">{aiData.score}%</strong>
            </>
          ) : (
            <>
              Lộ trình chuẩn cho <strong className="text-white font-semibold">{aiData.role}</strong>
            </>
          )}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {aiData.hasCV && (
            <span className="text-xs px-2.5 py-1 bg-[#090d16] border border-[#111c2e] rounded-md text-slate-400 font-medium">
              <strong className="text-[#00e5ff] font-bold">{aiData.score}</strong>/100 Điểm CV
            </span>
          )}
          <span className="text-xs px-2.5 py-1 bg-[#090d16] border border-[#111c2e] rounded-md text-slate-400 font-medium">
            <strong className="text-emerald-500 font-bold">
              {
                Object.values(aiData.nodes).filter((n) =>
                  aiData.hasCV ? n.cvMatch : n.status === "done",
                ).length
              }
            </strong>{" "}
            Sẵn có
          </span>
          <span className="text-xs px-2.5 py-1 bg-[#090d16] border border-[#111c2e] rounded-md text-slate-400 font-medium">
            <strong className="text-amber-500 font-bold">
              {
                Object.values(aiData.nodes).filter((n) =>
                  aiData.hasCV ? !n.cvMatch : n.status !== "done",
                ).length
              }
            </strong>{" "}
            Cần bồi dưỡng
          </span>
        </div>
      </div>

      {/* ── OVERLAY ── */}
      {currentNodeId && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={closePanel}
        ></div>
      )}

      {/* ── 3. MAIN LAYOUT ── */}
      <div className="flex flex-1">
        {/* ── SIDEBAR ── */}
        <aside className="w-[240px] hidden md:flex flex-col border-r border-[#111c2e] bg-[#080c10]/40 backdrop-blur-sm sticky top-14 h-[calc(100vh-56px)] overflow-y-auto shrink-0">
          <div className="p-4 border-b border-[#111c2e]">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-xl bg-[#111c2e]/60 p-1.5 rounded-lg">{aiData.roleEmoji}</span>
              <div>
                <div className="font-semibold text-sm text-white">
                  {aiData.role}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {aiData.roleMeta}
                </div>
              </div>
            </div>

            {/* Tiến độ tổng */}
            <div className="bg-[#0d131f] rounded-lg p-3 border border-[#1e293b]/60">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-slate-400 font-medium">TIẾN ĐỘ TỔNG HỢP</span>
                <span className="font-bold text-sm text-[#00e5ff]">
                  {stats.pct}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-[#00e5ff] transition-all duration-500 rounded-full"
                  style={{ width: `${stats.pct}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                <span>
                  <strong className="text-slate-200">{stats.done}</strong> đã đạt
                </span>
                <span>
                  <strong className="text-slate-200">{stats.todo}</strong> cần học
                </span>
              </div>
            </div>
          </div>

          {/* Danh sách node theo phase */}
          <div className="py-2 flex-1">
            {aiData.phases.map((phase, pi) => (
              <div key={pi} className="mb-3">
                <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-[#6b7a95]">
                  {pi + 1}. {phase.label}
                </div>
                {aiData.cols[pi].map((nid) => {
                  if (nid === "_") return null;
                  const node = aiData.nodes[nid];
                  if (!node) return null;
                  const isActive = currentNodeId === nid;
                  const dotColor =
                    node.status === "done"
                      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                      : node.status === "in-progress"
                        ? "bg-[#00e5ff] animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.6)]"
                        : "bg-slate-600";

                  return (
                    <div
                      key={nid}
                      onClick={() => openNode(nid)}
                      className={`flex items-center gap-2.5 px-4 py-2 text-sm cursor-pointer transition-colors border-l-2 ${
                        isActive
                          ? "bg-[#111c2e]/60 border-[#00e5ff] text-white font-medium"
                          : "border-transparent text-slate-400 hover:bg-[#111c2e]/30 hover:text-white"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`}
                      ></div>
                      <span className="truncate flex-1 text-xs">
                        {node.title}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {node.pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 p-6 md:p-8 overflow-x-auto min-w-0">
          {/* Tiêu đề trang */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#090d16] border border-[#111c2e] rounded-full px-3.5 py-1 text-xs font-semibold text-slate-300 mb-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                LỘ TRÌNH AI CÁ NHÂN HOÁ - ĐÃ TỐI ƯU THEO CV
              </div>
              <h1 className="text-xl font-bold text-white mb-1">
                Bản Đồ Phát Triển — {aiData.role}
              </h1>
              <p className="text-xs text-slate-400">
                Click vào từng khối công nghệ để tra cứu tài liệu học và checklist chi tiết.
              </p>
            </div>

            <div className="flex gap-2 flex-wrap items-center shrink-0">
              {aiData.hasCV && (
                <button
                  onClick={() => navigate("/upload")}
                  className="bg-[#0d131f] border border-[#1e293b] text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-lg hover:border-slate-500 transition-all"
                >
                  🔄 Phân tích CV khác
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="bg-[#0d131f] border border-[#1e293b] text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-lg hover:border-slate-500 transition-all"
              >
                🖨️ Xuất PDF
              </button>
              {aiData.hasCV && (
                <button
                  onClick={() => navigate("/skill-gap")}
                  className="bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] hover:from-[#00f0ff] hover:to-[#00c8f8] text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center gap-1.5"
                >
                  Xem khoảng cách kỹ năng
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Chú thích màu */}
          <div className="flex gap-4 mb-6 flex-wrap text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Đã sở hữu
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-[#00e5ff] shadow-[0_0_8px_rgba(0,229,255,0.5)]"></div> Đang học
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-[#1e293b] border border-[#334155]"></div> Chưa bắt đầu
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded border-2 border-emerald-400 bg-transparent"></div> Nhận diện từ CV
            </div>
          </div>

          {/* Graph */}
          <div className="bg-grid-pattern relative py-4 px-2 rounded-2xl border border-[#111c2e]/60 bg-[#080c10]/20" id="tree-wrap" ref={treeWrapRef}>
            {/* Phase headers */}
            <div className="flex mb-6 w-full">
              {aiData.phases.map((phase, index) => {
                let borderCls = "";
                let textCls = "";
                if (index === 0) {
                  borderCls = "border-[#10b981]/40";
                  textCls = "text-[#10b981] bg-[#10b981]/5";
                } else if (index === 1) {
                  borderCls = "border-[#38bdf8]/40";
                  textCls = "text-[#38bdf8] bg-[#38bdf8]/5";
                } else if (index === 2) {
                  borderCls = "border-amber-500/40";
                  textCls = "text-amber-500 bg-amber-500/5";
                } else {
                  borderCls = "border-violet-500/40";
                  textCls = "text-violet-400 bg-violet-500/5";
                }
                return (
                  <div key={index} className="flex-1 text-center px-1">
                    <span
                      className={`inline-block text-[10px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-md border ${borderCls} ${textCls}`}
                    >
                      {phase.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* SVG connectors */}
            <svg
              className="absolute top-0 left-0 w-full pointer-events-none z-0"
              ref={svgRef}
            ></svg>

            {/* Node grid */}
            <div className="flex relative z-10 w-full" id="tree-grid">
              {aiData.cols.map((col, ci) => (
                <div
                  key={ci}
                  className="flex-1 flex flex-col gap-4 px-2 items-center"
                >
                  {col.map((nid, ni) => {
                    if (nid === "_") {
                      return (
                        <div
                          key={`spacer-${ni}`}
                          className="h-[110px] w-[160px] shrink-0"
                        ></div>
                      );
                    }
                    const node = aiData.nodes[nid];
                    if (!node) return null;

                    const isSelected = currentNodeId === nid;

                    let cardClass =
                      "border-[#1e293b] bg-[#0d131f] hover:border-[#38bdf8]/40 text-slate-300";
                    let dotColor = "bg-slate-600";
                    let barColor = "bg-[#1e293b]";

                    if (node.status === "done") {
                      cardClass =
                        "border-[#10b981]/50 bg-[#0d131f] hover:border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.1)] text-white";
                      dotColor = "bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.6)]";
                      barColor = "bg-[#10b981]";
                    } else if (node.status === "in-progress") {
                      cardClass =
                        "border-[#00e5ff]/50 bg-[#0d131f] hover:border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.1)] text-white";
                      dotColor = "bg-[#00e5ff] animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.6)]";
                      barColor = "bg-[#00e5ff]";
                    }

                    return (
                      <div
                        key={nid}
                        id={`node-${nid}`}
                        onClick={() => openNode(nid)}
                        style={{
                          outline: isSelected ? "2px solid #00e5ff" : "none",
                          outlineOffset: "2px",
                        }}
                        className={`w-[160px] rounded-xl border p-3.5 cursor-pointer relative transition-all duration-150 hover:-translate-y-0.5 shadow-sm ${cardClass} ${node.cvMatch ? "ring-1 ring-emerald-500/50" : ""}`}
                      >
                        <div
                          className={`absolute top-3.5 right-3.5 w-2 h-2 rounded-full ${dotColor}`}
                        ></div>
                        <div className="text-xl mb-1.5">{node.icon}</div>
                        <div className="font-semibold text-xs text-white leading-tight mb-0.5 line-clamp-1">
                          {node.title}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed h-7">
                          {node.sub}
                        </div>
                        <div className="h-1 bg-[#1e293b] w-full rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full ${barColor} transition-all`}
                            style={{ width: `${node.pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ── 4. DETAIL DRAWER ── */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[340px] max-w-full bg-[#0d131f] border-l border-[#111c2e] z-50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${activeNode ? "translate-x-0" : "translate-x-full"}`}
      >
        {activeNode && (
          <>
            <div className="p-5 border-b border-[#111c2e] sticky top-0 bg-[#0d131f] z-10">
              <button
                onClick={closePanel}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg transition-colors"
              >
                ✕
              </button>
              <div className="text-2xl mb-2">{activeNode.icon}</div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    activeNode.status === "done"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : activeNode.status === "in-progress"
                        ? "bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]/30"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {activeNode.status === "done"
                    ? "✅ Đã xong"
                    : activeNode.status === "in-progress"
                      ? "🔵 Đang học"
                      : "⬜ Chưa bắt đầu"}
                </span>
                {aiData.hasCV && activeNode.cvMatch && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    📄 Từ CV
                  </span>
                )}
              </div>
              <h2 className="font-bold text-base text-white mb-1 leading-snug">
                {activeNode.title}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeNode.desc}
              </p>
            </div>

            <div className="p-5 flex flex-col gap-5 overflow-y-auto flex-1">
              {/* Tiến độ nhánh */}
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                  Tiến độ
                </div>
                <div className="bg-[#090d16] border border-[#1e293b] rounded-lg p-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">
                      {activeNode.status === "done"
                        ? "Hoàn tất"
                        : "Đang tích lũy"}
                    </span>
                    <span className="font-bold text-[#00e5ff]">
                      {activeNode.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${activeNode.status === "done" ? "bg-emerald-500" : "bg-[#00e5ff]"}`}
                      style={{ width: `${activeNode.pct}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                  Nhiệm vụ trọng tâm
                </div>
                <div className="flex flex-col gap-1.5">
                  {(activeNode.checklist || []).map((item, idx) => {
                    const isChecked = activeNode.checkState[idx];
                    return (
                      <label
                        key={idx}
                        className={`flex items-start gap-2.5 text-xs p-2.5 rounded-lg border cursor-pointer select-none transition-colors ${
                          isChecked
                            ? "bg-[#111c2e]/40 border-[#111c2e] text-slate-500 line-through"
                            : "bg-[#090d16] border-[#1e293b] text-slate-300 hover:border-slate-500"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked || false}
                          onChange={(e) =>
                            toggleCheck(currentNodeId, idx, e.target.checked)
                          }
                          className="mt-0.5 accent-[#00e5ff] cursor-pointer"
                        />
                        <span>{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Tài nguyên */}
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                  Tài nguyên học tập
                </div>
                <div className="flex flex-col gap-2">
                  {(activeNode.resources || []).map((res, ri) => (
                    <div
                      key={ri}
                      className="flex items-center gap-3 p-2.5 bg-[#090d16] border border-[#1e293b] rounded-lg hover:border-slate-500 transition-colors cursor-pointer"
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 ${res.tag === "free" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}
                      >
                        {res.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-200 truncate">
                          {res.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {res.meta}
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${res.tag === "free" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}
                      >
                        {res.tag === "free" ? "Miễn phí" : "Premium"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Nút hoàn thành */}
            <div className="p-4 border-t border-[#111c2e] sticky bottom-0 bg-[#0d131f]">
              <button
                disabled={activeNode.status === "done"}
                onClick={() => toggleDoneDirectly(currentNodeId)}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeNode.status === "done"
                    ? "bg-emerald-500 text-white cursor-default"
                    : "bg-gradient-to-r from-blue-500 to-[#00e5ff] hover:from-blue-600 hover:to-[#00d0f0] text-slate-950"
                }`}
              >
                {activeNode.status === "done"
                  ? "✓ Kỹ Năng Đã Hoàn Thành"
                  : "🎯 Đánh Dấu Hoàn Thành"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── 5. FOOTER ── */}
      <footer className="border-t border-[#111c2e] px-6 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 bg-[#080c10] mt-auto">
        <div className="font-bold text-slate-400">
          Dev<span className="text-[#00e5ff]">Path</span> AI
        </div>
        <div>
          Dự án nghiên cứu Khoa CNTT — Trường Đại học Công nghệ Đông Á (EAUT) ·
          2026
        </div>
      </footer>
    </div>
  );
}

// ── HÀM BỔ TRỢ 1: GENERATE FULL DATA FROM SIMPLE ──
function generateFullDataFromSimple(role, missingSkills, hasCV) {
  const base = getDemoDataForRole(role);
  base.role = role || "IT Engineer";
  base.hasCV = hasCV !== false;

  const nodeKeys = Object.keys(base.nodes);

  nodeKeys.forEach((key, idx) => {
    if (!hasCV && (!missingSkills || missingSkills.length > 5)) {
      base.nodes[key].status = "todo";
      base.nodes[key].pct = 0;
      base.nodes[key].cvMatch = false;
      base.nodes[key].checkState = base.nodes[key].checkState.map(() => false);
      return;
    }

    if (hasCV && idx < 3) {
      base.nodes[key].status = "done";
      base.nodes[key].pct = 100;
      base.nodes[key].cvMatch = true;
      base.nodes[key].checkState = base.nodes[key].checkState.map(() => true);
      return;
    }

    const isMissing = missingSkills.some(
      (s) =>
        s.toLowerCase().includes(key.toLowerCase()) ||
        base.nodes[key].title.toLowerCase().includes(s.toLowerCase()),
    );
    if (isMissing) {
      base.nodes[key].status = "todo";
      base.nodes[key].pct = 0;
      base.nodes[key].cvMatch = false;
      base.nodes[key].checkState = base.nodes[key].checkState.map(() => false);
    } else {
      base.nodes[key].status = "done";
      base.nodes[key].pct = 100;
      base.nodes[key].cvMatch = false;
      base.nodes[key].checkState = base.nodes[key].checkState.map(() => true);
    }
  });

  const allNodes = Object.values(base.nodes);
  const cvNodes = allNodes.filter((n) => n.cvMatch).length;
  base.score = Math.round((cvNodes / allNodes.length) * 100);

  return base;
}

// ── HÀM BỔ TRỢ 2: DEMO DATA THEO VAI TRÒ ──
function getDemoDataForRole(roleName) {
  const mockResources = [
    {
      icon: "📖",
      type: "doc",
      title: "Tài liệu học tập chính thức",
      meta: "devdocs.io",
      tag: "free",
    },
    {
      icon: "🎬",
      type: "video",
      title: "Khóa học video hướng dẫn chi tiết",
      meta: "FreeCodeCamp",
      tag: "free",
    },
  ];

  return {
    username: "Học Viên DevPath",
    role: roleName || "Backend Engineer",
    roleEmoji: roleName?.toLowerCase().includes("frontend") ? "💻" : 
               roleName?.toLowerCase().includes("fullstack") ? "⚡" : 
               roleName?.toLowerCase().includes("data") ? "🧠" : 
               roleName?.toLowerCase().includes("mobile") ? "📱" : 
               roleName?.toLowerCase().includes("devops") ? "⚙️" : 
               roleName?.toLowerCase().includes("security") ? "🛡️" : 
               roleName?.toLowerCase().includes("ui") ? "🎨" : "⚙️",
    roleMeta: "10 kỹ năng cốt lõi · Lộ trình 3–6 tháng",
    score: 70,
    phases: [
      { label: "Nền tảng IT", cls: "p1" },
      { label: "Ngôn ngữ & API", cls: "p2" },
      { label: "Cơ sở dữ liệu", cls: "p3" },
      { label: "Hạ tầng Cloud", cls: "p4" },
    ],
    cols: [
      ["internet", "linux", "git"],
      ["_", "nodejs", "restapi", "_"],
      ["_", "sql", "nosql", "_"],
      ["auth", "docker", "redis"],
    ],
    connections: [
      ["internet", "nodejs"],
      ["linux", "nodejs"],
      ["git", "nodejs"],
      ["linux", "restapi"],
      ["git", "restapi"],
      ["nodejs", "sql"],
      ["nodejs", "nosql"],
      ["restapi", "sql"],
      ["restapi", "nosql"],
      ["sql", "auth"],
      ["nosql", "auth"],
      ["sql", "docker"],
      ["nosql", "redis"],
      ["auth", "docker"],
      ["auth", "redis"],
    ],
    nodes: {
      internet: {
        icon: "🌐",
        title: "Internet & HTTP",
        sub: "DNS, TCP/IP, HTTP Methods, Status codes",
        desc: "Thấu hiểu nguyên lý vận hành của Internet toàn cầu và cấu trúc giao thức HTTP làm tiền đề giao tiếp Client-Server.",
        status: "todo",
        pct: 0,
        cvMatch: false,
        checklist: [
          "HTTP methods: GET, POST, PUT, DELETE",
          "Status codes (2xx, 3xx, 4xx, 5xx)",
          "Hệ thống phân giải tên miền DNS",
          "Headers, Cookies và Session quản trị",
        ],
        checkState: [false, false, false, false],
        resources: mockResources,
      },
      linux: {
        icon: "🐧",
        title: "Linux Terminal",
        sub: "Terminal commands, File system, Permissions",
        desc: "Thành thạo kỹ năng thao tác trên dòng lệnh Terminal Linux, quản trị thư mục và phân quyền máy chủ VPS.",
        status: "todo",
        pct: 0,
        cvMatch: false,
        checklist: [
          "Điều hướng thư mục Linux nâng cao",
          "Quản trị quyền tệp tin: Chmod & Chown",
          "Quản lý tiến trình (Process Management)",
          "Cấu hình SSH kết nối Remote Server",
        ],
        checkState: [false, false, false, false],
        resources: mockResources,
      },
      git: {
        icon: "🔀",
        title: "Git & GitHub",
        sub: "Branching, merging, Pull Request flow",
        desc: "Quản lý phiên bản mã nguồn dự án chặt chẽ với Git, phối hợp nhóm hiệu quả qua GitHub Workflow.",
        status: "todo",
        pct: 0,
        cvMatch: false,
        checklist: [
          "Làm chủ Git add, commit, push, clone",
          "Phân nhánh Branch & xử lý Merge Conflict",
          "Tạo và kiểm duyệt Pull Request (PR)",
        ],
        checkState: [false, false, false],
        resources: mockResources,
      },
      nodejs: {
        icon: "🟢",
        title: "Node.js & Express",
        sub: "Event loop, Async, Middleware routing",
        desc: "Xây dựng ứng dụng máy chủ bất đồng bộ hiệu năng cao sử dụng môi trường Node.js và Express.",
        status: "todo",
        pct: 0,
        cvMatch: false,
        checklist: [
          "Event Loop single-thread",
          "Async/Await & Promises",
          "Middleware routes Express",
          "File system FS module",
        ],
        checkState: [false, false, false, false],
        resources: mockResources,
      },
      restapi: {
        icon: "⚡",
        title: "RESTful API Design",
        sub: "Endpoints, JSON, Status codes, Validation",
        desc: "Thiết kế chuẩn mực giao tiếp dữ liệu giữa Client và Server đáp ứng các tiêu chuẩn công nghiệp RESTful.",
        status: "todo",
        pct: 0,
        cvMatch: false,
        checklist: [
          "Quy chuẩn endpoints",
          "Phân trang, lọc, sắp xếp (Paging, Sorting)",
          "Sử dụng Zod/Joi validation",
        ],
        checkState: [false, false, false],
        resources: mockResources,
      },
      sql: {
        icon: "💾",
        title: "Relational DB (SQL)",
        sub: "PostgreSQL/MySQL, Joins, Indexing",
        desc: "Làm chủ cơ sở dữ liệu quan hệ, tối ưu câu lệnh truy vấn phức tạp và cấu hình chuẩn hóa sơ đồ thực thể.",
        status: "todo",
        pct: 0,
        cvMatch: false,
        checklist: [
          "Thiết kế bảng & Khóa ngoại",
          "INNER/LEFT/RIGHT JOIN queries",
          "Lập chỉ mục Indexing tối ưu",
        ],
        checkState: [false, false, false],
        resources: mockResources,
      },
      nosql: {
        icon: "🍃",
        title: "NoSQL (MongoDB)",
        sub: "Documents, Collections, Aggregation",
        desc: "Lưu trữ dữ liệu dạng phi cấu trúc linh hoạt linh động với MongoDB Document.",
        status: "todo",
        pct: 0,
        cvMatch: false,
        checklist: [
          "Tạo schema động collections",
          "Query array lồng nhau",
          "Aggregation Framework query",
        ],
        checkState: [false, false, false],
        resources: mockResources,
      },
      auth: {
        icon: "🔑",
        title: "Authentication JWT",
        sub: "Sessions, JWT Tokens, Cookies, RBAC",
        desc: "Bảo mật hệ thống đầu cuối nghiêm ngặt với giải pháp cấp phát token JWT ký điện tử.",
        status: "todo",
        pct: 0,
        cvMatch: false,
        checklist: [
          "Mã hóa bcrypt password",
          "Access/Refresh tokens setup",
          "Phân quyền RBAC",
        ],
        checkState: [false, false, false, false],
        resources: mockResources,
      },
      docker: {
        icon: "🐳",
        title: "Đóng gói Docker",
        sub: "Containers, Dockerfile, Docker Compose",
        desc: "Đóng gói toàn bộ ứng dụng và môi trường chạy vào bên trong Container nhằm triệt tiêu lỗi cục bộ.",
        status: "todo",
        pct: 0,
        cvMatch: false,
        checklist: [
          "Viết file Dockerfile tối ưu",
          "Docker Compose multi-service",
          "Docker Volume & Network",
        ],
        checkState: [false, false, false],
        resources: mockResources,
      },
      redis: {
        icon: "⚡",
        title: "Redis Caching",
        sub: "In-memory store, Cache patterns, TTL",
        desc: "Tăng cường năng lực xử lý chịu tải hệ thống gấp 10 lần nhờ giải pháp bộ nhớ đệm In-memory.",
        status: "todo",
        pct: 0,
        cvMatch: false,
        checklist: [
          "Cấu hình Cache-aside pattern",
          "Thiết lập TTL cache",
          "Sử dụng Redis cache store",
        ],
        checkState: [false, false, false],
        resources: mockResources,
      },
    },
  };
}
