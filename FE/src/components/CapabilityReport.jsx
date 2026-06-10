import React from "react";
import { CheckCircle, AlertCircle, TrendingUp, Zap } from "lucide-react";

export const CapabilityReport = ({ report }) => {
  if (!report) return null;

  const {
    career_name,
    overall_score,
    matched_skills,
    missing_skills,
    recommendations
  } = report;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-500/20";
    if (score >= 60) return "bg-yellow-500/20";
    return "bg-red-500/20";
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 text-white space-y-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-blue-400">📊 Đánh giá Năng lực</h3>
          <p className="text-gray-400 mt-1">Vị trí: <strong>{career_name}</strong></p>
        </div>
        <div className={`${getScoreBg(overall_score)} rounded-full w-24 h-24 flex items-center justify-center border-2 ${getScoreColor(overall_score)} border-opacity-30`}>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(overall_score)}`}>
              {overall_score}%
            </div>
            <div className="text-xs text-gray-300">Tổng điểm</div>
          </div>
        </div>
      </div>

      {/* Score interpretation */}
      <div className="bg-gray-800/50 rounded p-4 border-l-4 border-blue-500">
        <div className="flex items-start gap-3">
          <TrendingUp size={20} className="text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <p className="font-semibold text-blue-300">Mức độ Phù hợp</p>
            <p className="text-sm text-gray-300 mt-1">
              {overall_score >= 80
                ? "✅ Bạn đã đạt mức cơ bản cho vị trí này! Hãy tiếp tục nâng cao."
                : overall_score >= 60
                  ? "⏳ Bạn cần tập trung vào một số kỹ năng quan trọng."
                  : "🚀 Còn nhiều kỹ năng cần phát triển. Bắt đầu với các khóa học cơ bản."}
            </p>
          </div>
        </div>
      </div>

      {/* Matched skills */}
      {matched_skills.length > 0 && (
        <div>
          <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-green-400">
            <CheckCircle size={20} />
            Kỹ năng Phù hợp ({matched_skills.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {matched_skills.map((skill, idx) => (
              <div
                key={idx}
                className="bg-green-900/20 border border-green-500/30 rounded p-3 flex items-start gap-2"
              >
                <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-green-300">{skill.skill_name}</p>
                  <p className="text-xs text-gray-300">
                    Mức của bạn: <strong>{skill.user_level}</strong> | Yêu cầu: {skill.required_level}
                  </p>
                  <div className="w-full bg-gray-700 h-2 rounded mt-2">
                    <div
                      className="bg-green-500 h-full rounded"
                      style={{ width: `${skill.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing skills */}
      {missing_skills.length > 0 && (
        <div>
          <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-orange-400">
            <AlertCircle size={20} />
            Kỹ năng Cần Phát Triển ({missing_skills.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {missing_skills.map((skill, idx) => (
              <div
                key={idx}
                className="bg-orange-900/20 border border-orange-500/30 rounded p-3 flex items-start gap-2"
              >
                <AlertCircle size={16} className="text-orange-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-orange-300">{skill.skill_name}</p>
                  <p className="text-xs text-gray-300">
                    Yêu cầu: <strong>{skill.required_level}</strong> | Hiện tại: Chưa có
                  </p>
                  <div className="w-full bg-gray-700 h-2 rounded mt-2">
                    <div className="bg-orange-500 h-full rounded" style={{ width: "0%" }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-400">
            <Zap size={20} />
            Gợi ý Phát Triển
          </h4>
          <div className="space-y-2">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="bg-blue-900/20 border-l-2 border-blue-500 pl-3 py-2 text-sm text-gray-200">
                • {rec}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action button */}
      <div className="pt-4 border-t border-gray-700">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Xem Chi Tiết Lộ Trình Học
        </button>
      </div>
    </div>
  );
};

export default CapabilityReport;
