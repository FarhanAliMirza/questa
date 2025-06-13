"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { ModeToggle } from "@/components/ModeToggle";

export function Nav() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
            router.push("/");
          },
        },
      });
    } catch (error) {
      toast.error("Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center space-x-4">
          <h1
            className="text-xl font-bold cursor-pointer hover:text-gray-600 transition-colors"
            onClick={() => router.push("/user")}
          >
            QUESTA
          </h1>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            {isLoading ? "Signing out..." : "Sign Out"}
          </Button>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
