import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, X, Send, User, Sparkles, LogIn 
} from "lucide-react";

export default function FloatingAIChat() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  
  const chatEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  
  const recommendedRole = localStorage.getItem("courses_recommended_role") || "Chuyên viên Công nghệ";

  // Khởi tạo tin nhắn chào mừng
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      if (token && user) {
        setMessages([
          {
            id: 1,
            sender: "ai",
            text: `Xin chào **${user.name || "Học viên"}**! Tôi là Trợ lý Nghề nghiệp AI của bạn.`
          },
          {
            id: 2,
            sender: "ai",
            text: `Tôi đã cập nhật hồ sơ năng lực và lộ trình học tập của bạn đối với vị trí **${recommendedRole}**. Bạn cần tôi tư vấn thêm về kiến thức chuyên môn, câu hỏi phỏng vấn hay mức lương không?`
          }
        ]);
      } else {
        setMessages([
          {
            id: 1,
            sender: "ai",
            text: "Xin chào! Tôi là Trợ lý Nghề nghiệp AI của DevPath."
          },
          {
            id: 2,
            sender: "ai",
            text: "Để nhận lộ trình học tập chi tiết, phân tích lỗ hổng kỹ năng cá nhân hóa từ CV và tư vấn chuyên sâu, bạn hãy đăng nhập hệ thống nhé!",
            isCta: true
          }
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, token, user, recommendedRole]);

  // Cuộn hộp thoại chat xuống cuối khi có tin nhắn mới
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Logic trả lời tự động của bot giống trang AI Consultant
  const getAIResponse = (userText) => {
    const text = userText.toLowerCase();
    if (text.includes("lương") || text.includes("salary") || text.includes("thu nhập")) {
      return `Mức lương trung bình cho vị trí **${recommendedRole}** hiện nay dao động khoảng 15 - 35 triệu VNĐ/tháng. Sau khi bạn lấp đầy các khoảng cách kỹ năng trong lộ trình học tập của mình, bạn có thể tự tin deal ở mức cao nhất.`;
    }
    if (text.includes("phỏng vấn") || text.includes("interview") || text.includes("câu hỏi")) {
      return `Với định hướng **${recommendedRole}**, nhà tuyển dụng sẽ phỏng vấn sâu về kỹ năng thực hành và kinh nghiệm làm sản phẩm thực tế. Hãy tập trung chuẩn bị tốt các câu hỏi về xử lý tình huống kỹ thuật và tối ưu hệ thống nhé!`;
    }
    if (text.includes("khóa học") || text.includes("học")) {
      return `Bạn nên tập trung hoàn thành các học phần nền tảng trong lộ trình trước, sau đó thực hành các mini-project mà tôi gợi ý trong phần tài liệu học tập để củng cố kỹ năng làm việc.`;
    }
    return `Cảm ơn câu hỏi của bạn về vị trí **${recommendedRole}**. Hãy tiếp tục duy trì tiến độ học tập hàng ngày để sớm lấp đầy các khoảng cách kỹ năng còn thiếu nhé. Tôi luôn sẵn sàng đồng hành cùng bạn!`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userText = inputMessage;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: userText
      }
    ]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(userText);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: response
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* ── BÓNG CHAT NỔI (CHAT BUBBLE BUTTON) ── */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, rotate: -6 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-[#00e5ff] to-[#7c3aed] flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] z-[9999]"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="text-white" size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Bot className="text-white" size={24} />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 border-2 border-[#080c10] rounded-full animate-ping"></span>
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 border-2 border-[#080c10] rounded-full"></span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── HỘP CHAT MINI POPUP (MINI CHAT WIDGET) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-32px)] h-[480px] bg-[#0d131f] border border-[#1e2a3a] rounded-2xl shadow-2xl z-[9999] flex flex-col overflow-hidden text-white font-sans antialiased"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#0d1527] to-[#111c2e] border-b border-[#1e2a3a] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00e5ff] to-[#7c3aed] flex items-center justify-center shadow-[0_0_8px_rgba(0,229,255,0.3)]">
                    <Bot size={16} className="text-white" />
                  </div>
                  <span className="absolute bottom-[-1px] right-[-1px] w-2 h-2 bg-green-500 border border-[#0d131f] rounded-full animate-pulse"></span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-200 flex items-center gap-1">
                    DevPath AI Mentor
                    <Sparkles size={10} className="text-[#00e5ff]" />
                  </h4>
                  <p className="text-[9px] text-slate-400">Trợ lý ảo thông minh • Trực tuyến</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#080c10]/40 bg-grid-pattern">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border text-[10px] font-bold ${
                      msg.sender === "user"
                        ? "bg-purple-600/20 border-purple-500/30 text-purple-300"
                        : "bg-cyan-950/40 border-cyan-500/20 text-cyan-400"
                    }`}
                  >
                    {msg.sender === "user" ? <User size={12} /> : <Bot size={12} />}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div
                      className={`p-2.5 rounded-xl text-[11px] leading-relaxed shadow-sm ${
                        msg.sender === "user"
                          ? "bg-gradient-to-l from-[#5b21b6] to-[#7c3aed] text-white rounded-tr-none"
                          : "bg-[#0d1527] border border-gray-800 text-gray-200 rounded-tl-none"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: msg.text.replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="text-[#00e5ff] font-bold">$1</strong>'
                        ),
                      }}
                    />
                    
                    {msg.isCta && (
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate("/login");
                        }}
                        className="inline-flex items-center gap-1.5 justify-center py-1.5 px-3 bg-gradient-to-r from-[#00e5ff] to-[#00b4d8] hover:from-[#00f0ff] hover:to-[#00c8f8] text-slate-950 text-[10px] font-bold rounded-lg transition-all"
                      >
                        <LogIn size={11} />
                        Đăng nhập ngay
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 mr-auto max-w-[85%] items-center">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400">
                    <Bot size={12} />
                  </div>
                  <div className="bg-[#0d1527] border border-gray-800 px-3 py-2 rounded-xl rounded-tl-none flex items-center gap-1">
                    <span className="w-1 h-1 bg-[#00e5ff] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1 h-1 bg-[#00e5ff] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1 h-1 bg-[#00e5ff] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="p-2 border-t border-[#1e2a3a] bg-[#0d131f] flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Hỏi AI tư vấn nghề nghiệp..."
                className="flex-1 bg-gray-950/80 border border-gray-800 rounded-xl px-3 py-2 text-[11px] focus:outline-none focus:border-[#00e5ff]/50 text-white placeholder-gray-600 transition-colors"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className={`p-2 rounded-xl transition-all shrink-0 ${
                  inputMessage.trim() && !isTyping
                    ? "bg-[#00e5ff] text-black shadow-[0_0_8px_rgba(0,229,255,0.25)] active:scale-95"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/50"
                }`}
              >
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
