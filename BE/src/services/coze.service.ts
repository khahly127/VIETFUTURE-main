import axios from "axios";

const COZE_API_KEY = process.env.COZE_API_KEY;
const COZE_BOT_ID = process.env.COZE_BOT_ID;
const COZE_API_URL = (process.env.COZE_API_URL || "https://api.coze.com/v3")
  .trim()
  .replace(/\/chat\/?$/, "")
  .replace(/\/$/, "");

// Simple Q&A knowledge base để fallback
const qaKnowledgeBase: { [key: string]: string } = {
  "nodejs": "Node.js là một runtime JavaScript cho phép chạy JavaScript ở server-side. Nó sử dụng V8 engine, non-blocking I/O model, và rất tốt cho xây dựng các ứng dụng real-time.",
  "react": "React là một JavaScript library để xây dựng giao diện người dùng với components reusable. Nó sử dụng Virtual DOM để tối ưu performance.",
  "docker": "Docker là một containerization platform cho phép bạn đóng gói ứng dụng và dependencies vào một container. Nó giúp đảm bảo ứng dụng chạy giống nhau ở mọi môi trường.",
  "database": "Database là nơi lưu trữ dữ liệu của ứng dụng. Có hai loại chính: SQL (MySQL, PostgreSQL) và NoSQL (MongoDB, Redis).",
  "api": "API (Application Programming Interface) là một tập hợp các quy tắc cho phép các ứng dụng giao tiếp với nhau. REST API là loại API phổ biến nhất.",
  "backend": "Backend là phần logic server-side của ứng dụng. Nó xử lý business logic, database, authentication, và API endpoints.",
  "frontend": "Frontend là giao diện người dùng mà users tương tác trực tiếp. Nó thường được xây dựng bằng HTML, CSS, JavaScript, React, Vue, Angular.",
  "testing": "Testing là quá trình kiểm tra phần mềm để tìm bugs. Có unit tests, integration tests, end-to-end tests.",
  "devops": "DevOps là sự kết hợp giữa Development và Operations. Nó focuses trên automation, CI/CD, infrastructure as code, monitoring."
};

// Helper: Tìm câu trả lời từ knowledge base
const findAnswerFromKB = (question: string): string | null => {
  const lowerQuestion = question.toLowerCase();

  for (const [keyword, answer] of Object.entries(qaKnowledgeBase)) {
    if (lowerQuestion.includes(keyword)) {
      return answer;
    }
  }

  return null;
};

const buildLocalCareerFallback = (message: string): string => {
  return "Mình chưa nhận được phản hồi từ Coze. Vui lòng thử gửi lại câu hỏi sau vài giây.";

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

  if (lowerMessage.includes("học") || lowerMessage.includes("roadmap") || lowerMessage.includes("lộ trình")) {
    return "Nếu bạn đang xây lộ trình học IT, hãy đi theo thứ tự: nền tảng lập trình, cấu trúc dữ liệu cơ bản, Git, database, API, framework chính, rồi làm 2-3 project hoàn chỉnh. Mỗi tuần nên có một sản phẩm nhỏ để kiểm tra mình thật sự hiểu tới đâu.";
  }

  return "Mình chưa kết nối được Coze API nên đang trả lời bằng chế độ dự phòng. Bạn có thể hỏi về lộ trình học, CV, phỏng vấn, kỹ năng backend/frontend, database, API, Docker hoặc DevOps; mình sẽ tư vấn theo hướng thực tế và ngắn gọn.";
};

const extractCozeContent = (data: any): string | null => {
  const messages = Array.isArray(data?.data)
    ? data.data
    : data?.data?.messages || data?.messages;

  if (Array.isArray(messages) && messages.length > 0) {
    const answerMessage = messages
      .find((message) => {
        return (
          message?.role === "assistant" &&
          message?.type === "answer" &&
          message?.content
        );
      });

    if (answerMessage) {
      return answerMessage.content.trim();
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

    return plainAssistantMessage?.content?.trim() || null;
  }

  const content =
    data?.data?.answer ||
    data?.data?.content ||
    data?.answer ||
    data?.content;

  return typeof content === "string" && content.trim() ? content.trim() : null;
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

const listCozeMessages = async (
  conversationId: string,
  chatId: string
): Promise<string | null> => {
  const response = await axios.get(
    `${COZE_API_URL}/chat/message/list`,
    {
      headers: getCozeHeaders(),
      params: {
        conversation_id: conversationId,
        chat_id: chatId
      },
      timeout: 10000
    }
  );

  if (response.data?.code && response.data.code !== 0) {
    throw new Error(response.data?.msg || "Failed to list Coze messages");
  }

  return extractCozeContent(response.data);
};

const waitForCozeAnswer = async (
  conversationId: string,
  chatId: string
): Promise<string | null> => {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await axios.get(
      `${COZE_API_URL}/chat/retrieve`,
      {
        headers: getCozeHeaders(),
        params: {
          conversation_id: conversationId,
          chat_id: chatId
        },
        timeout: 10000
      }
    );

    if (response.data?.code && response.data.code !== 0) {
      throw new Error(response.data?.msg || "Failed to retrieve Coze chat");
    }

    const status = response.data?.data?.status;
    if (status === "completed") {
      return await listCozeMessages(conversationId, chatId);
    }

    if (status === "failed" || status === "canceled") {
      throw new Error(response.data?.data?.last_error?.msg || `Coze chat ${status}`);
    }
  }

  return null;
};

// Send message to Coze bot (với fallback)
export const sendMessageToCoze = async (
  message: string,
  cvContent?: string
): Promise<string> => {
  try {
    console.log(`[Coze] Sending message to Coze. Key present: ${!!COZE_API_KEY}, Bot ID: ${COZE_BOT_ID}`);

    const configError = assertCozeConfig();
    if (configError) {
      console.warn(`[Coze] ${configError}, using local fallback`);
      return buildLocalCareerFallback(message);
    }

    // Send every user message to Coze first.
    const payload = {
      bot_id: COZE_BOT_ID,
      user_id: `user_${Date.now()}`,
      stream: false,
      additional_messages: [
        {
          role: "user",
          content: message,
          content_type: "text"
        }
      ]
    };

    console.log(`[Coze] API URL: ${COZE_API_URL}`);
    const response = await axios.post(
      `${COZE_API_URL}/chat`,
      payload,
      {
        headers: getCozeHeaders(),
        timeout: 10000
      }
    );

    console.log("[Coze] Response received:", response.status);

    if (response.data?.code && response.data.code !== 0) {
      throw new Error(response.data?.msg || "Coze API returned an error");
    }

    const content = extractCozeContent(response.data);
    if (content) {
      console.log("[Coze] Got valid response from API");
      return content;
    }

    const conversationId = response.data?.data?.conversation_id;
    const chatId = response.data?.data?.id;
    if (conversationId && chatId) {
      const answer = await waitForCozeAnswer(conversationId, chatId);
      if (answer) {
        return answer;
      }
    }

    // Fallback: Trả lời chung chung
    console.log("[Coze] API trả về response rỗng, dùng fallback");
    return buildLocalCareerFallback(message);

  } catch (error: any) {
    console.error("[Coze] Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    // Ultimate fallback
    const fallbackResponse = buildLocalCareerFallback(message);
    console.log("[Fallback] Using ultimate fallback");
    return fallbackResponse;
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
