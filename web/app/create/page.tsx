"use client";
import { useEffect, useState } from "react";
import { Nav } from "@/components/shared/nav";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL, CURRENT_URL } from "@/lib/config";

type QuestionType = "TEXT" | "RADIO";

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
}

export default function CreateQuiz() {
  const baseURL = BASE_URL;
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", type: "TEXT", text: "" },
    { id: "2", type: "TEXT", text: "" },
  ]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      toast.error("Please sign in to create a quiz");
      router.push("/signin");
    } else {
      setUserId(localStorage.getItem("token"));
      setIsLoggedIn(true);
    }
  }, []);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now().toString(), type: "TEXT", text: "" },
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 2) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: keyof Question, value: unknown) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, options: [...(q.options || []), ""] } : q
      )
    );
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.filter((_, index) => index !== optionIndex),
            }
          : q
      )
    );
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      title,
      userId,
      questions,
    };
    try {
      const response = await axios.post(`${baseURL}/api/quiz/create`, payload);
      const quizId = response.data.quizId;
      const quizUrl = `${CURRENT_URL}/quiz/${quizId}`;
      const copyToClipboard = () => {
        navigator.clipboard.writeText(quizUrl);
        toast.success("Quiz URL copied to clipboard");
      };
      toast("Quiz created successfully", {
        description: `Quiz URL: ${quizUrl}`,
        action: {
          label: "Copy",
          onClick: () => copyToClipboard(),
        },
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create quiz");
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="w-full min-h-screen bg-background">
          <Nav />
          <div className="px-4 py-8 lg:max-w-[40%] mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Quiz Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter quiz title"
                        required
                      />
                    </div>

                    {questions.map((question, index) => (
                      <Card key={question.id} className="p-4">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">
                              Question {index + 1}
                            </h3>
                            {questions.length > 2 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeQuestion(question.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Question Type</Label>
                            <RadioGroup
                              value={question.type}
                              onValueChange={(value: QuestionType) =>
                                updateQuestion(question.id, "type", value)
                              }
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="TEXT"
                                  id={`text-${question.id}`}
                                />
                                <Label htmlFor={`text-${question.id}`}>
                                  Text
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="RADIO"
                                  id={`radio-${question.id}`}
                                />
                                <Label htmlFor={`radio-${question.id}`}>
                                  Multiple Choice
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label>Question Text</Label>
                            <Input
                              value={question.text}
                              onChange={(e) =>
                                updateQuestion(
                                  question.id,
                                  "text",
                                  e.target.value
                                )
                              }
                              placeholder="Enter your question"
                              required
                            />
                          </div>

                          {question.type === "RADIO" && (
                            <div className="space-y-2">
                              <Label>Options</Label>
                              {question.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) =>
                                      updateOption(
                                        question.id,
                                        optionIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Option ${optionIndex + 1}`}
                                    required
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      removeOption(question.id, optionIndex)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => addOption(question.id)}
                                className="w-full"
                              >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Option
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addQuestion}
                      className="w-full"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating..." : "Create Quiz"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <h1>Loading...</h1>
        </div>
      )}
    </>
  );
}
