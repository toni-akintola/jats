import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import { HeaderProvider } from "@/contexts/header-context";
import { Header } from "@/components/header";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: "PropAI - Property Analysis Intelligence",
  description: "AI-powered property analysis and development opportunities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fredoka.variable} font-fredoka antialiased min-h-screen h-screen max-h-screen w-full`}
        style={{
          background: `linear-gradient(135deg, 
            #0e3b5c 0%,
            #5e4f6d 25%,
            #9f6671 50%,
            #d8897b 75%,
            #f4ac7b 100%
          )`,
        }}
      >
        <div className="absolute inset-0 bg-black/5" />

        <div className="relative pt-16 h-full min-h-screen">
          {/* <HeaderProvider>
            <Header /> */}
          {children}
          {/* </HeaderProvider> */}
        </div>
      </body>
    </html>
  );
}
