import { Request, Response } from "express";
import {
    generalChat,
    analyzeCV,
    askQuestionAboutCV
} from "../services/coze.service";

const getValidUserId = (userId: unknown): number | null => {
    const parsed = Number(userId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

// General chat with Coze
export const cozeChat = async (req: Request, res: Response) => {
    try {
        const { message, user_id, conversation_id } = req.body;

        if (!message) {
            return res.status(400).json({
                message: "Message is required"
            });
        }

        const validUserId = getValidUserId(user_id);
        if (!validUserId) {
            return res.status(400).json({
                message: "Valid user_id is required"
            });
        }

        const result = await generalChat(message, validUserId, conversation_id);

        return res.status(200).json({
            message: "Chat success",
            data: {
                question: message,
                answer: result.answer,
                conversation_id: result.conversationId
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

        const validUserId = getValidUserId(user_id);
        if (!validUserId) {
            return res.status(400).json({
                message: "Valid user_id is required"
            });
        }

        const result = await analyzeCV(
            cvContent,
            validUserId,
            req.body.conversation_id
        );

        return res.status(200).json({
            message: "CV analysis success",
            data: {
                analysis: result.answer,
                conversation_id: result.conversationId
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

        const validUserId = getValidUserId(user_id);
        if (!validUserId) {
            return res.status(400).json({
                message: "Valid user_id is required"
            });
        }

        const result = await askQuestionAboutCV(
            cvContent,
            question,
            validUserId,
            req.body.conversation_id
        );

        return res.status(200).json({
            message: "Question answered",
            data: {
                question,
                answer: result.answer,
                conversation_id: result.conversationId
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
