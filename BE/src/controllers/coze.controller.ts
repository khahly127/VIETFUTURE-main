import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import {
    generalChat,
    analyzeCV,
    askQuestionAboutCV
} from "../services/coze.service";

const getValidUserId = (userId: unknown): number | null => {
    const parsed = Number(userId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const saveChatHistory = async (
    userId: unknown,
    question: string,
    answer: string
) => {
    const validUserId = getValidUserId(userId);

    if (!validUserId) {
        return;
    }

    try {
        await prisma.aIChatHistory.create({
            data: {
                user_id: validUserId,
                question,
                answer
            }
        });
    } catch (error: any) {
        console.warn("Save chat history failed:", error.message);
    }
};

// General chat with Coze
export const cozeChat = async (req: Request, res: Response) => {
    try {
        const { message, user_id } = req.body;

        if (!message) {
            return res.status(400).json({
                message: "Message is required"
            });
        }

        const answer = await generalChat(message);

        await saveChatHistory(user_id, message, answer);

        return res.status(200).json({
            message: "Chat success",
            data: {
                question: message,
                answer
            }
        });
    } catch (error: any) {
        console.error("Chat error:", error.message);
        return res.status(500).json({
            message: "Failed to get chat response",
            error: error.message
        });
    }
};

// Analyze CV
export const analyzeCVController = async (req: Request, res: Response) => {
    try {
        const { cvContent, user_id } = req.body;

        if (!cvContent) {
            return res.status(400).json({
                message: "CV content is required"
            });
        }

        const analysis = await analyzeCV(cvContent);

        await saveChatHistory(user_id, "CV Analysis", analysis);

        return res.status(200).json({
            message: "CV analysis success",
            data: {
                analysis
            }
        });
    } catch (error: any) {
        console.error("CV analysis error:", error.message);
        return res.status(500).json({
            message: "Failed to analyze CV",
            error: error.message
        });
    }
};

// Ask question about CV
export const askAboutCV = async (req: Request, res: Response) => {
    try {
        const { cvContent, question, user_id } = req.body;

        if (!cvContent || !question) {
            return res.status(400).json({
                message: "CV content and question are required"
            });
        }

        const answer = await askQuestionAboutCV(cvContent, question);

        await saveChatHistory(user_id, `CV Question: ${question}`, answer);

        return res.status(200).json({
            message: "Question answered",
            data: {
                question,
                answer
            }
        });
    } catch (error: any) {
        console.error("CV question error:", error.message);
        return res.status(500).json({
            message: "Failed to answer question",
            error: error.message
        });
    }
};
