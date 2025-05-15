import { Tajawal as FontTajawal } from "next/font/google";
import { Toaster } from "sonner";

import { Navbar } from "@/components/custom/navbar";
import { ThemeProvider } from "@/components/custom/theme-provider";

import type { Metadata } from "next"; // Changed to type-only import

import "./globals.css";

const fontTajawal = FontTajawal({
  subsets: ["arabic"],
  weight: ["400", "700"], // Common weights, adjust as needed
  variable: "--font-tajawal",
  display: "swap", // Ensures text remains visible during font loading
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gemini.vercel.ai"),
  title: "Next.js Gemini Chatbot",
  description: "Next.js chatbot template using the AI SDK and Gemini.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontTajawal.variable}`}>
      <body className="antialiased font-sans">
        {" "}
        {/* Added font-sans here */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
