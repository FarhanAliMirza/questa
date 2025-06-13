"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../generated/prisma");
const router = express_1.default.Router();
const prisma = new prisma_1.PrismaClient();
const createQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, title, questions } = req.body;
    if (!userId || !title || !Array.isArray(questions) || questions.length < 2) {
        res.status(400).json({ error: "Invalid input" });
        return;
    }
    try {
        const quiz = yield prisma.quiz.create({
            data: {
                title,
                userId,
                questions: {
                    create: questions.map((q) => ({
                        text: q.text,
                        type: q.type,
                        options: q.type === "RADIO" ? q.options : [],
                    })),
                },
            },
        });
        res.status(201).json({ quizId: quiz.id });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create quiz" });
    }
});
const getQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId } = req.params;
    try {
        const quiz = yield prisma.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true },
        });
        if (!quiz) {
            res.status(404).json({ error: "Quiz not found" });
            return;
        }
        res.json(quiz);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching quiz" });
    }
});
const submitResponse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId } = req.params;
    const { answers } = req.body;
    try {
        yield prisma.response.create({
            data: {
                quizId,
                answers,
            },
        });
        res.status(201).json({ message: "Response submitted" });
    }
    catch (error) {
        res.status(500).json({ error: "Error submitting response" });
    }
});
router.post("/create", createQuiz);
router.get("/:quizId", getQuiz);
router.post("/:quizId/submit", submitResponse);
exports.default = router;
