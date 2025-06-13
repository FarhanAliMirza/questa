"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/config";
import axios, { AxiosError } from "axios";
import { Quiz } from "./QuizCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";

const Quizes = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quizzes, setQuizzes] = useState<{ id: string; title: string }[]>([]);
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    const { data: session } = await authClient.getSession();
      const userId = session?.user.id;
      try {
        const response = await axios.get(`${BASE_URL}/api/user`, {
          headers: {
            userId: userId,
          },
        });
        setQuizzes(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            toast.error("Please sign in to view your quizzes");
            router.push("/signin");
          }
        }
      }
      setIsLoggedIn(true);
  };
  return (
    <>
      {isLoggedIn ? (
        <div className="container mx-auto px-4 py-8">
          {quizzes.length === 0 ? (
            <div className="items-center mb-6 text-center py-12">
              <h2 className="text-xl font-semibold mb-4">No quizzes yet</h2>
              <p className="text-gray-600 mb-6">
                Create your first quiz to get started!
              </p>
              <div className="flex justify-center">
                <Button
                  onClick={() => router.push("/create")}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-5 w-5" />
                  Create Your First Quiz
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Quizzes</h1>
                <Button
                  onClick={() => router.push("/create")}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Quiz
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                {quizzes.map((quiz) => (
                  <Quiz key={quiz.id} quizId={quiz.id} title={quiz.title} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading your quizzes...</p>
        </div>
      )}
    </>
  );
};

export default Quizes;
