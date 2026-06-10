import axios from "axios";

const COZE_API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const cozeApi = {
  // General chat
  chat: async (message, userId = null) => {
    try {
      const response = await axios.post(`${COZE_API_BASE}/coze/chat`, {
        message,
        user_id: userId
      });
      return response.data.data;
    } catch (error) {
      console.error("Chat error:", error);
      throw error;
    }
  },

  // Analyze CV
  analyzeCV: async (cvContent, userId = null) => {
    try {
      const response = await axios.post(
        `${COZE_API_BASE}/coze/analyze-cv`,
        {
          cvContent,
          user_id: userId
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("CV analysis error:", error);
      throw error;
    }
  },

  // Ask question about CV
  askAboutCV: async (cvContent, question, userId = null) => {
    try {
      const response = await axios.post(
        `${COZE_API_BASE}/coze/ask-cv`,
        {
          cvContent,
          question,
          user_id: userId
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Question error:", error);
      throw error;
    }
  },

  // Analyze CV and get capability report
  analyzeCVAndGetCapability: async (cvContent, userId) => {
    try {
      const response = await axios.post(
        `${COZE_API_BASE}/cv-analysis/analyze-capability`,
        {
          cvContent,
          user_id: userId
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Capability analysis error:", error);
      throw error;
    }
  },

  // Get questions based on CV and get assessment
  getQuestionsBasedOnCV: async (cvContent, userId, roadmapId) => {
    try {
      const response = await axios.post(
        `${COZE_API_BASE}/cv-assessment/questions`,
        {
          cvContent,
          user_id: userId,
          roadmap_id: roadmapId
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Get questions error:", error);
      throw error;
    }
  },

  // Submit assessment and get evaluation
  submitAssessmentAndEvaluate: async (userId, attemptId, roadmapId) => {
    try {
      const response = await axios.post(
        `${COZE_API_BASE}/cv-assessment/evaluate`,
        {
          user_id: userId,
          attempt_id: attemptId,
          roadmap_id: roadmapId
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Submit assessment error:", error);
      throw error;
    }
  }
};
