"use client";

import { useRouter } from "next/navigation";
import { SignOut } from "@/components/SignOut";
import { ModeToggle } from "@/components/ModeToggle";

export function Nav() {
  const router = useRouter();

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
          <SignOut />
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
