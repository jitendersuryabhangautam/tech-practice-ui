"use client";

import { usePathname } from "next/navigation";
import FloatingCharacters from "@/components/FloatingCharacters";
import ThemeToggle from "@/components/ThemeToggle";
import DataSourceToggle from "@/components/DataSourceToggle";
import ChatbotWidget from "@/components/ChatbotWidget";

const HIDDEN_PATHS = ["/", "/login"];

export default function GlobalWidgets() {
  const pathname = usePathname();

  if (HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <>
      <FloatingCharacters />
      <ThemeToggle />
      <DataSourceToggle />
      <ChatbotWidget />
    </>
  );
}
