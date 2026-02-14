import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import FloatingCharacters from "@/components/FloatingCharacters";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata = {
  title: "Tech Revision Platform",
  description:
    "Comprehensive platform for revising JavaScript, React, Next.js, Golang, PostgreSQL, Docker, and Kubernetes",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${plexMono.variable} overflow-x-hidden antialiased`}
      >
        <ThemeProvider>
          <FloatingCharacters />
          <ThemeToggle />
          <div className="relative z-10">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
