import axios from "axios";

const COZE_API_KEY = process.env.COZE_API_KEY;
const COZE_BOT_ID = process.env.COZE_BOT_ID;
const COZE_API_URL = process.env.COZE_API_URL || "https://api.coze.com/v1";

interface CozeMessage {
    role: "user" | "assistant";
    content: string;
}

interface ConversationResponse {
    id: string;
    messages: CozeMessage[];
}

// Send message to Coze bot (simplified - direct chat without conversation)
export const sendMessageToCoze = async (
    message: string,
    cvContent?: string
): Promise<string> => {
    try {
        console.log(`Sending message to Coze. Key present: ${!!COZE_API_KEY}, Bot ID: ${COZE_BOT_ID}`);

        const payload = {
            bot_id: COZE_BOT_ID,
            user_id: `user_${Date.now()}`,
            query: message,
            stream: false
        };

        const response = await axios.post(
            `${COZE_API_URL}/chat`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${COZE_API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 30000
            }
        );

        console.log("Coze response received:", response.status);

        // Extract message from Coze response
        if (response.data.data && response.data.data.messages && response.data.data.messages.length > 0) {
            const lastMessage = response.data.data.messages[response.data.data.messages.length - 1];
            return lastMessage.content || "Không có phản hồi từ AI";
        }

        return "Không có phản hồi từ AI";
    } catch (error: any) {
        console.error("Coze message error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        // Fallback response
        if (error.response?.status === 401) {
            throw new Error("Coze API Key không hợp lệ. Vui lòng kiểm tra lại.");
        }
        
        throw new Error(`Failed to get response from Coze: ${error.message}`);
    }
};

// Analyze CV and ask questions
export const analyzeCV = async (cvContent: string): Promise<string> => {
    try {
        const analysisPrompt = `Hãy phân tích CV này và cho tôi biết:
1. Các kỹ năng chính
2. Kinh nghiệm làm việc
3. Những điểm mạnh
4. Gợi ý cải thiện

CV: ${cvContent}`;

        return await sendMessageToCoze(analysisPrompt, cvContent);
    } catch (error: any) {
        console.error("CV analysis error:", error.message);
        throw new Error("Failed to analyze CV");
    }
};

// Ask question about CV
export const askQuestionAboutCV = async (
    cvContent: string,
    question: string
): Promise<string> => {
    try {
        const fullQuestion = `Dựa trên CV sau, vui lòng trả lời câu hỏi: ${question}\n\nCV:\n${cvContent}`;
        return await sendMessageToCoze(fullQuestion, cvContent);
    } catch (error: any) {
        console.error("Question about CV error:", error.message);
        throw new Error("Failed to answer question about CV");
    }
};

// General chat without CV
export const generalChat = async (message: string): Promise<string> => {
    try {
        return await sendMessageToCoze(message);
    } catch (error: any) {
        console.error("General chat error:", error.message);
        throw new Error("Failed to get chat response");
    }
};
