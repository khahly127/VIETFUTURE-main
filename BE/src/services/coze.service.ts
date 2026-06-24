import axios from "axios";
import { randomUUID } from "crypto";
import { prisma } from "../config/prisma";

const COZE_API_KEY = process.env.COZE_API_KEY;
const COZE_BOT_ID = process.env.COZE_BOT_ID;
const COZE_API_URL = (
  process.env.COZE_API_URL || "https://api.coze.com/open_api/v2/chat"
)
  .trim()
  .replace(/\/$/, "");

type ChatHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type CozeChatResult = {
  answer: string;
  conversationId: string;
};

const buildLocalCareerFallback = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("cv") || lowerMessage.includes("resume")) {
    return "Mình chưa kết nối được Coze API, nhưng vẫn có thể góp ý nhanh: hãy làm CV rõ 4 phần chính gồm mục tiêu nghề nghiệp, kỹ năng kỹ thuật, dự án đã làm và kết quả đo được. Với mỗi dự án, nên ghi công nghệ sử dụng, vai trò của bạn, vấn đề đã giải quyết và con số cụ thể nếu có.";
  }

  if (lowerMessage.includes("phỏng vấn") || lowerMessage.includes("interview")) {
    return "Để chuẩn bị phỏng vấn IT, bạn nên luyện 3 nhóm câu hỏi: kiến thức nền tảng, bài toán thực hành và kể chuyện dự án theo STAR. Hãy chuẩn bị sẵn 2-3 dự án tiêu biểu, nêu rõ bạn làm gì, vì sao chọn cách đó và kết quả đạt được.";
  }

  if (lowerMessage.includes("lương") || lowerMessage.includes("salary")) {
    return "Về lương, bạn nên định vị theo năng lực hiện tại, số năm kinh nghiệm, chất lượng dự án và thị trường tuyển dụng. Cách tốt nhất là chuẩn bị portfolio rõ ràng, chứng minh tác động trong dự án, rồi deal theo một khoảng lương thay vì một con số cố định.";
  }

  if (
    lowerMessage.includes("học") ||
    lowerMessage.includes("roadmap") ||
    lowerMessage.includes("lộ trình")
  ) {
    return "Nếu bạn đang xây lộ trình học IT, hãy đi theo thứ tự: nền tảng lập trình, cấu trúc dữ liệu cơ bản, Git, database, API, framework chính, rồi làm 2-3 project hoàn chỉnh. Mỗi tuần nên có một sản phẩm nhỏ để kiểm tra mình thật sự hiểu tới đâu.";
  }

  return "Mình chưa kết nối được Coze API nên đang trả lời bằng chế độ dự phòng. Bạn có thể hỏi về lộ trình học, CV, phỏng vấn, kỹ năng backend/frontend, database, API, Docker hoặc DevOps; mình sẽ tư vấn theo hướng thực tế và ngắn gọn.";
};

const assertCozeConfig = () => {
  if (!COZE_API_KEY || !COZE_BOT_ID) {
    return "Missing API key or bot id";
  }

  if (!/^\d{1,19}$/.test(COZE_BOT_ID)) {
    return "Invalid bot id. Use the numeric bot id from the Coze bot page, not a token or workflow id.";
  }

  return null;
};

const getCozeHeaders = () => ({
  Authorization: `Bearer ${COZE_API_KEY}`,
  "Content-Type": "application/json"
});

const extractCozeV2Content = (data: any): string | null => {
  const messages = data?.messages || data?.data?.messages || data?.data;

  if (Array.isArray(messages) && messages.length > 0) {
    const answerMessage = messages.find((message) => {
      return (
        message?.role === "assistant" &&
        message?.type === "answer" &&
        message?.content
      );
    });

    if (answerMessage) {
      return String(answerMessage.content).trim();
    }

    const plainAssistantMessage = [...messages]
      .reverse()
      .find((message) => {
        const type = String(message?.type || "").toLowerCase();
        return (
          message?.role === "assistant" &&
          message?.content &&
          !type.includes("question") &&
          !type.includes("suggest") &&
          !type.includes("follow")
        );
      });

    if (plainAssistantMessage?.content) {
      return String(plainAssistantMessage.content).trim();
    }
  }

  const content =
    data?.data?.answer ||
    data?.data?.content ||
    data?.answer ||
    data?.content;

  return typeof content === "string" && content.trim() ? content.trim() : null;
};

const getRecentChatHistory = async (
  conversationId: string
): Promise<ChatHistoryMessage[]> => {
  const records = await prisma.aIChatHistory.findMany({
    where: { conversation_id: conversationId },
    orderBy: { created_at: "desc" },
    take: 10,
    select: {
      question: true,
      answer: true
    }
  });

  return records.reverse().flatMap((record) => [
    { role: "user" as const, content: record.question },
    { role: "assistant" as const, content: record.answer }
  ]);
};

const saveChatToHistory = async (
  userId: number,
  conversationId: string,
  question: string,
  answer: string
): Promise<void> => {
  await prisma.aIChatHistory.create({
    data: {
      user_id: userId,
      conversation_id: conversationId,
      question,
      answer
    }
  });
};

const resolveConversationId = (conversationId?: string): string => {
  if (conversationId && String(conversationId).trim()) {
    return String(conversationId).trim();
  }

  return randomUUID();
};

// Gọi Coze API v2 với ngữ cảnh hội thoại từ database
export const sendMessageToCoze = async (
  userInput: string,
  conversationId: string,
  userId: number
): Promise<CozeChatResult> => {
  const trimmedInput = String(userInput || "").trim();
  const activeConversationId = resolveConversationId(conversationId);

  if (!trimmedInput) {
    throw new Error("User input is required");
  }

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Valid user id is required");
  }

  try {
    console.log(
      `[Coze] Preparing chat. conversationId=${activeConversationId}, userId=${userId}`
    );

    const chatHistory = await getRecentChatHistory(activeConversationId);
    console.log(`[Coze] Loaded ${chatHistory.length} history messages`);

    const configError = assertCozeConfig();
    if (configError) {
      console.warn(`[Coze] ${configError}, using local fallback`);
      const fallbackAnswer = buildLocalCareerFallback(trimmedInput);

      await saveChatToHistory(
        userId,
        activeConversationId,
        trimmedInput,
        fallbackAnswer
      );

      return {
        answer: fallbackAnswer,
        conversationId: activeConversationId
      };
    }

    const payload = {
      bot_id: COZE_BOT_ID,
      user: String(userId),
      conversation_id: activeConversationId,
      query: trimmedInput,
      stream: false,
      chat_history: chatHistory
    };

    const response = await axios.post(COZE_API_URL, payload, {
      headers: getCozeHeaders(),
      timeout: 30000
    });

    if (response.data?.code && response.data.code !== 0) {
      const cozeError = response.data?.msg || "Coze API returned an error";
      console.error("[Coze] API error:", {
        code: response.data.code,
        msg: cozeError
      });
      throw new Error(cozeError);
    }

    const answer = extractCozeV2Content(response.data);
    if (!answer) {
      throw new Error("Coze API returned an empty response");
    }

    await saveChatToHistory(
      userId,
      activeConversationId,
      trimmedInput,
      answer
    );

    return {
      answer,
      conversationId: activeConversationId
    };
  } catch (error: any) {
    const cozeMessage =
      error.response?.data?.msg || error.message || "Unknown Coze error";

    console.error("[Coze] Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: cozeMessage
    });

    if (cozeMessage.toLowerCase().includes("cozetoken balance is insufficient")) {
      throw new Error(
        "Tài khoản Coze đã hết token. Vui lòng nạp thêm token tại coze.com → Settings → Billing."
      );
    }

    const fallbackAnswer = buildLocalCareerFallback(trimmedInput);

    try {
      await saveChatToHistory(
        userId,
        activeConversationId,
        trimmedInput,
        fallbackAnswer
      );
    } catch (saveError: any) {
      console.error("[Coze] Failed to save fallback chat history:", saveError.message);
    }

    return {
      answer: fallbackAnswer,
      conversationId: activeConversationId
    };
  }
};

// Analyze CV and ask questions
export const analyzeCV = async (
  cvContent: string,
  userId: number,
  conversationId?: string
): Promise<CozeChatResult> => {
  try {
    const analysisPrompt = `Hãy phân tích CV này và cho tôi biết:
1. Các kỹ năng chính
2. Kinh nghiệm làm việc
3. Những điểm mạnh
4. Gợi ý cải thiện

CV: ${cvContent}`;

    return await sendMessageToCoze(
      analysisPrompt,
      resolveConversationId(conversationId),
      userId
    );
  } catch (error: any) {
    console.error("CV analysis error:", error.message);
    throw new Error("Failed to analyze CV");
  }
};

// Ask question about CV
export const askQuestionAboutCV = async (
  cvContent: string,
  question: string,
  userId: number,
  conversationId?: string
): Promise<CozeChatResult> => {
  try {
    const fullQuestion = `Dựa trên CV sau, vui lòng trả lời câu hỏi: ${question}\n\nCV:\n${cvContent}`;
    return await sendMessageToCoze(
      fullQuestion,
      resolveConversationId(conversationId),
      userId
    );
  } catch (error: any) {
    console.error("Question about CV error:", error.message);
    throw new Error("Failed to answer question about CV");
  }
};

// General chat without CV
export const generalChat = async (
  message: string,
  userId: number,
  conversationId?: string
): Promise<CozeChatResult> => {
  try {
    return await sendMessageToCoze(
      message,
      resolveConversationId(conversationId),
      userId
    );
  } catch (error: any) {
    console.error("General chat error:", error.message);
    throw new Error("Failed to get chat response");
  }
};
