"use client";

import { cn } from "@/lib/utils";

export default function FolderAnimation({ children }: { children: React.ReactNode }) {
  const titlesPageFolder = [
    {
      title: "1_____________",
      class: "z-[1] group-hover:-top-8 group-hover:rotate-6 group-hover:left-[8%]"
    },
    {
      title: "2_____________",
      class: "z-[2] delay-75 group-hover:-top-5 group-hover:left-[12%] group-hover:rotate-4"
    },
    {
      title: "3_____________",
      class: "z-[3] delay-150 group-hover:-top-2 group-hover:left-[14%] group-hover:rotate-2"
    }
  ];
  return (
    <div className="group relative w-full h-full" style={{ perspective: "1000px" }}>
      {titlesPageFolder.map((titlePges, index) => (
        <div
          key={index}
          className={cn(
            "w-[85%] h-[85%] bg-white rounded-lg border border-gray-300",
            "shadow-md absolute top-4 left-[10%] transition-all duration-500 ease-out",
            `${titlePges.class}`
          )}
        >
          <span className="relative -top-2 left-1 text-zinc-600 text-[12px] italic">
            {titlePges.title}
          </span>
        </div>
      ))}
      <div
        className="absolute z-10 border border-orange-600 rounded-tl-0 group-hover:rounded-tl-lg rounded-tr-lg rounded-br-lg rounded-bl-lg w-full h-full bg-card transition-all duration-500 ease-out group-hover:-rotate-x-15"
        style={{ transformOrigin: "bottom center" }}
      />
      <div
        className="absolute -z-10 border border-orange-600 rounded-tl-0 rounded-tr-lg rounded-br-lg rounded-bl-lg w-full h-full bg-card transition-all duration-500 ease-out"
        style={{ transformOrigin: "bottom center" }}
      />
      <div
        className="absolute -z-10 -top-6 left-0 border border-orange-600 border-b-0 w-20 h-6 rounded-t-lg bg-gradient-to-b from-orange-400 to-orange-500 transition-all duration-500"
        style={{ transformOrigin: "bottom center" }}
      />
      <div className="absolute z-20 w-full h-full">{children}</div>
    </div>
  );
}
