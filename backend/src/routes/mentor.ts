import express, { Router } from "express";
import auth from "../middleware/authMiddleware";
import { getChatResponse } from "../controllers/mentorController";

const router: Router = express.Router();

// @route   POST /api/mentor/chat
// @desc    Send a message to the AI mentor and get a response
// @access  Private
router.post("/chat", auth, getChatResponse);

export default router;
