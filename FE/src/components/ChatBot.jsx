import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import { cozeApi } from "../api/cozeApi";

export const ChatBot = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Xin chào! 👋 Tôi là DevPath AI Mentor. Hỏi tôi bất cứ điều gì về công nghệ, sự nghiệp, hay kỹ năng lập trình!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setLoading(true);

    try {
      const result = await cozeApi.chat(userMessage, userId);
      const response = result.answer || "Không có phản hồi từ AI";

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: response
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
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all z-40 transform hover:scale-110"
        aria-label="Open chatbot"
        title="Chat với AI"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur-sm">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg">DevPath AI Mentor</h3>
            <p className="text-xs text-blue-100 font-medium">Trợ lý tư vấn sự nghiệp</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all transform hover:rotate-90"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-gray-100">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            {msg.type === "user" ? (
              <div className="max-w-xs">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-2xl rounded-tr-none shadow-md">
                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-xs">
                <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-none shadow-md border border-gray-200">
                  <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-md">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập câu hỏi..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none bg-gray-50"
          rows="1"
          disabled={loading}
          maxLength={500}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white p-2.5 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-md"
          aria-label="Send message"
          title="Gửi (Enter)"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
