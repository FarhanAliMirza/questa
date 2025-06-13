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
const getQuizzes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers.userid;
    if (!userId) {
        res.status(401).json({ error: "User ID not provided" });
        return;
    }
    try {
        const quizzes = yield prisma.quiz.findMany({
            where: { userId },
            include: {
                questions: true,
                responses: true,
            },
        });
        res.json(quizzes);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching user quizzes" });
    }
});
const getResponses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers.userid;
    const { quizId } = req.params;
    if (!userId) {
        res.status(401).json({ error: "User ID not provided" });
        return;
    }
    try {
        const quiz = yield prisma.quiz.findFirst({
            where: { id: quizId, userId },
            include: {
                responses: true,
            },
        });
        if (!quiz) {
            res.status(404).json({ error: "Quiz not found or unauthorized" });
            return;
        }
        res.json(quiz.responses);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching responses" });
    }
});
router.get("/", getQuizzes);
router.get("/:quizId/responses", getResponses);
exports.default = router;
