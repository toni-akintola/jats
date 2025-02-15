import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: "feels - Company Sentiment Analysis",
  description:
    "Analyze market sentiment in real-time using AI swarm intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} font-fredoka antialiased`}>
        {children}
      </body>
    </html>
  );
}
