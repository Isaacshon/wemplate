import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "pretendard/dist/web/static/pretendard.css";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wemplate | Daily website templates for emerging niches",
  description:
    "Buy premium, motion-ready website templates generated for fresh industries and concepts before the market catches up.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
