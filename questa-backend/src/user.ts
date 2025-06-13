import express from "express";
import { PrismaClient } from "../generated/prisma";
import type { RequestHandler } from "express";

const router = express.Router();
const prisma = new PrismaClient();

const getQuizzes: RequestHandler = async (req, res) => {
  const userId = req.headers.userid as string;

  if (!userId) {
    res.status(401).json({ error: "User ID not provided" });
    return;
  }

  try {
    const quizzes = await prisma.quiz.findMany({
      where: { userId },
      include: {
        questions: true,
        responses: true,
      },
    });

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user quizzes" });
  }
};

const getResponses: RequestHandler = async (req, res) => {
  const userId = req.headers.userid as string;
  const { quizId } = req.params;

  if (!userId) {
    res.status(401).json({ error: "User ID not provided" });
    return;
  }

  try {
    const quiz = await prisma.quiz.findFirst({
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
  } catch (error) {
    res.status(500).json({ error: "Error fetching responses" });
  }
};

router.get("/", getQuizzes);
router.get("/:quizId/responses", getResponses);

export default router;
