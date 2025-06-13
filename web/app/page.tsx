"use client";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {


  return (
    <div>
      <div className="h-screen w-screen">
        <div className="flex justify-end items-center p-3">
          <ModeToggle />
        </div>
        <div className="flex flex-col justify-center items-center h-3/4 w-full  ">
          <div className="text-3xl md:text-7xl font-bold dark:text-blue-300 text-blue-600">
          Questa Lite
          </div>
          <div className="m-3 text-lg md:text-2xl text-center font-light text-black dark:text-white">
          Simple Quiz Platform
          </div>
          <Button asChild className="m-4">
            <Link href={"/signin"}>Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
