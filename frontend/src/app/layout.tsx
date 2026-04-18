import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TulasiAI Labs - AI-Powered Career Growth Platform",
  description: "Transform your professional journey with intelligent insights and personalized learning paths.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#0f172a] text-white">
        {children}
      </body>
    </html>
  );
}

