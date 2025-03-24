import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QuestionnaireProvider } from "@/context/questionnaireContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Questionnaire Builder App",
  description: "Questionnaire Builder App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QuestionnaireProvider>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {children}
        </body>
      </QuestionnaireProvider>
      
    </html>
  );
}
