import express from "express";
import {
    cozeChat,
    analyzeCVController,
    askAboutCV
} from "../controllers/coze.controller";

const router = express.Router();

// General chat endpoint
router.post("/chat", cozeChat);

// Analyze CV endpoint
router.post("/analyze-cv", analyzeCVController);

// Ask question about CV endpoint
router.post("/ask-cv", askAboutCV);

export default router;
