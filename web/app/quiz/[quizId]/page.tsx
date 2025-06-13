"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/config";
import axios from "axios";

interface Question {
  id: string;
  text: string;
  type: "RADIO" | "TEXT";
  options: string[];
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export default function QuizPage() {
  const params = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/quiz/${params.quizId}`);
      setQuiz(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load quiz");
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Check if all questions are answered
    const unansweredQuestions = quiz.questions.filter(
      (question) => !answers[question.id]
    );

    if (unansweredQuestions.length > 0) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${BASE_URL}/api/quiz/${params.quizId}/submit`, {
        quizId: params.quizId,
        answers,
      });
      toast.success("Quiz submitted successfully!");
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
      setAnswers({});
    }
  };

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading quiz...</h1>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Quiz submitted successfully!</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {quiz.questions.map((question, index) => (
            <Card key={question.id} className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Question {index + 1}: {question.text}
                </h3>
                {question.type === "RADIO" ? (
                  <RadioGroup
                    value={answers[question.id]}
                    onValueChange={(value) =>
                      handleAnswerChange(question.id, value)
                    }
                    className="space-y-2"
                  >
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={option} id={`${optionIndex}`} />
                        <Label htmlFor={`${optionIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    <Input
                      type="text"
                      value={answers[question.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      placeholder="Type your answer here..."
                      className="w-full border-0 border-b-2 border-gray-200 focus:border-gray-400 focus:ring-0 rounded-none px-0"
                    />
                  </div>
                )}
              </div>
            </Card>
          ))}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="lg"
              className="w-full max-w-xs"
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
