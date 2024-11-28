import type { Metadata } from "next";
import "./globals.css";
import { Ubuntu } from "next/font/google";
import Navbar from "./(Navbar)/Navbar";
import Footer from "./(Footer)/Footer";

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
    <html lang="en">
      <body className={`${ubuntu.className} antialiased p-2 md:p-0`}>
        <header className="p-2 md:p-4 mb-2">
          <Navbar />
        </header>
        <main className="container mx-auto">{children}</main>
        {/* <footer className="container mx-auto">
          <Footer />
        </footer> */}
      </body>
    </html>
  );
}
