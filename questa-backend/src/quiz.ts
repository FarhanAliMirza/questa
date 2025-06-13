import express from "express";
import { PrismaClient } from "../generated/prisma";
import type { RequestHandler } from "express";

const router = express.Router();
const prisma = new PrismaClient();

const createQuiz: RequestHandler = async (req, res) => {
  const { userId, title, questions } = req.body;

  if (!userId || !title || !Array.isArray(questions) || questions.length < 2) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  try {
    const quiz = await prisma.quiz.create({
      data: {
        title,
        userId,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            type: q.type,
            options: q.type === "RADIO" ? q.options : [],
          })),
        },
      },
    });

    res.status(201).json({ quizId: quiz.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create quiz" });
  }
};

const getQuiz: RequestHandler = async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      res.status(404).json({ error: "Quiz not found" });
      return;
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Error fetching quiz" });
  }
};

const submitResponse: RequestHandler = async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;

  try {
    await prisma.response.create({
      data: {
        quizId,
        answers,
      },
    });

    res.status(201).json({ message: "Response submitted" });
  } catch (error) {
    res.status(500).json({ error: "Error submitting response" });
  }
};

router.post("/create", createQuiz);
router.get("/:quizId", getQuiz);
router.post("/:quizId/submit", submitResponse);

export default router;
