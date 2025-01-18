import { ThemeProvider } from "../components/theme-provider";
import type { Metadata } from "next";
import "./globals.css";
import { Ubuntu } from "next/font/google";
import Navbar from "./(Navbar)/Navbar";
import Footer from "./(Footer)/Footer";
import { Toaster } from "@/components/ui/toaster";
import { NextAuthProvider } from "./Providers";

const ubuntu = Ubuntu({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "notebook",
  description: "notebook",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ubuntu.className} antialiased p-2 max-w-3xl mx-auto`}>
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="py-4 mb-2">
              <Navbar />
            </header>
            <main className="my-4">{children}</main>
            <Toaster />
            <footer>
              <Footer />
            </footer>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
