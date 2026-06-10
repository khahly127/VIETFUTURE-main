import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Upload } from "lucide-react";
import { cozeApi } from "../api/cozeApi";
import CapabilityReport from "./CapabilityReport";

export const ChatBot = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Xin chào! 👋 Tôi là AI tư vấn nghề nghiệp CNTT. Tôi có thể giúp bạn:\n• Phân tích CV & đánh giá năng lực\n• Trả lời câu hỏi về CV\n• Tư vấn về sự nghiệp\n\nBạn có muốn tải lên CV không?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cvContent, setCvContent] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [capabilityReport, setCapabilityReport] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, capabilityReport]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCvFile(file);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target.result;
        setCvContent(content);

        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: `✅ CV đã tải lên thành công! (${file.name})\n\n⏳ Đang phân tích CV của bạn...`
          }
        ]);

        // Gọi API phân tích CV và xem năng lực
        if (userId) {
          try {
            const result = await cozeApi.analyzeCVAndGetCapability(content, userId);

          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: "✨ Phân tích hoàn tất! Dưới đây là đánh giá năng lực của bạn:",
              report: result.capability_report
            }
          ]);

            setCapabilityReport(result.capability_report);
            return;
          } catch (capabilityError) {
            console.warn("Capability analysis failed, falling back to CV analysis:", capabilityError);
          }
        }

        const result = await cozeApi.analyzeCV(content, userId);
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: result.analysis || "Đã nhận CV, nhưng chưa có nội dung phân tích."
          }
        ]);
      } catch (error) {
        console.error("Error analyzing CV:", error);
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: "❌ Có lỗi xảy ra khi phân tích CV. Vui lòng thử lại!"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setLoading(true);

    try {
      let response;

      // Check if user wants to analyze CV
      if (userMessage.toLowerCase().includes("phân tích cv") || userMessage.toLowerCase().includes("analyze cv")) {
        if (!cvContent) {
          setMessages((prev) => [
            ...prev,
            {
              type: "bot",
              content: "❌ Vui lòng tải lên CV trước khi yêu cầu phân tích!"
            }
          ]);
          setLoading(false);
          return;
        }
        const result = await cozeApi.analyzeCV(cvContent, userId);
        response = result.analysis;
      }
      // Ask question about CV
      else if (cvContent && userMessage.length > 10) {
        const result = await cozeApi.askAboutCV(cvContent, userMessage, userId);
        response = result.answer;
      }
      // General chat
      else {
        const result = await cozeApi.chat(userMessage, userId);
        response = result.answer;
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: response || "Không có phản hồi từ AI"
        }
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "❌ Có lỗi xảy ra. Vui lòng thử lại!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40"
        aria-label="Open chatbot"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-screen md:h-[700px] bg-white rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">VietFuture AI</h3>
          <p className="text-sm text-blue-100">Tư vấn nghề nghiệp CNTT</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-blue-800 p-1 rounded transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx}>
            {msg.type === "user" ? (
              <div className="flex justify-end">
                <div className="max-w-xs p-3 rounded-lg bg-blue-600 text-white rounded-br-none">
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-start flex-col">
                <div className="max-w-xs p-3 rounded-lg bg-white text-gray-800 border border-gray-200 rounded-bl-none">
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {msg.content}
                  </p>
                </div>
                {msg.report && <CapabilityReport report={msg.report} />}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 p-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* CV Upload */}
      {!cvContent && (
        <div className="px-4 py-2 border-t border-gray-200">
          <label className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 p-2 rounded cursor-pointer transition-colors">
            <Upload size={16} className="text-gray-600" />
            <span className="text-sm text-gray-600">Tải CV (TXT)</span>
            <input
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập câu hỏi..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
          rows="2"
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded transition-colors"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
