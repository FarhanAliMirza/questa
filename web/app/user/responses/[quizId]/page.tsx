"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/config";
import axios from "axios";
import { Nav } from "@/components/shared/nav";

interface Response {
  id: string;
  answers: Record<string, string>;
  createdAt: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: {
    id: string;
    text: string;
    type: "RADIO" | "TEXT";
    options?: string[];
  }[];
}

export default function ResponsesPage() {
  const params = useParams();
  const router = useRouter();
  const [responses, setResponses] = useState<Response[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: session } = await authClient.getSession();
    if (!session?.user?.id) {
      toast.error("Please login to view responses");
      router.push("/signin");
    }
    try {
      const [quizResponse, responsesResponse] = await Promise.all([
        axios.get(`${BASE_URL}/api/quiz/${params.quizId}`),
        axios.get(`${BASE_URL}/api/user/${params.quizId}/responses`, {
          headers: {
            userId: session?.user.id,
          },
        }),
      ]);
      setQuiz(quizResponse.data);
      setResponses(responsesResponse.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load responses");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getAnswerPreview = (response: Response) => {
    if (!quiz) return "";
    const firstQuestion = quiz.questions[0];
    const firstAnswer = response.answers[firstQuestion.id];
    return firstAnswer || "No answer";
  };

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading responses...</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <div className="text-lg font-semibold">
              {responses.length}{" "}
              {responses.length === 1 ? "Response" : "Responses"}
            </div>
          </div>

          <div className="space-y-4">
            {responses.map((response) => (
              <Dialog key={response.id}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:bg-gray-800 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            Response from {formatDate(response.createdAt)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Preview: {getAnswerPreview(response)}
                          </p>
                        </div>
                        <Button variant="link">View Full Response</Button>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Response Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {quiz.questions.map((question, index) => (
                      <div key={question.id} className="space-y-2">
                        <h3 className="font-semibold">
                          Question {index + 1}: {question.text}
                        </h3>
                        <p className="text-gray-700">
                          {response.answers[question.id] ||
                            "No answer provided"}
                        </p>
                      </div>
                    ))}
                    <div className="text-sm text-gray-500">
                      Submitted on {formatDate(response.createdAt)}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
