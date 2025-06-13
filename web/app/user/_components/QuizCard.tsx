"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { CURRENT_URL } from "@/lib/config";
import { useRouter } from "next/navigation";

interface QuizProps {
  quizId: string;
  title: string;
}

export function Quiz({ quizId, title }: QuizProps) {
  const router = useRouter();
  const handleCopyUrl = () => {
    const url = `${CURRENT_URL}/quiz/${quizId}`;
    navigator.clipboard.writeText(url);
    toast.success("Quiz URL copied to clipboard");
  };

  const handleViewResponses = () => {
    router.push(`/user/responses/${quizId}`);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleCopyUrl}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Quiz URL
          </Button>
          <Button variant="secondary" onClick={handleViewResponses}>
            View Responses
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
