import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/Navbar"; 
import Footer from "./components/layout/Footer";
import ScrollProvider from "./components/providers/ScrollProviders";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Premium Portfolio | Handcrafted Excellence",
  description: "A curated collection of professional handcrafted pieces.",
};

export default function RootShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jost.className} antialiased`}>
        {/* Wrap everything inside ScrollProvider */}
        <ScrollProvider>
          <Navbar />
          <div className="min-h-screen">
            {children}
          </div>
          <Footer />
        </ScrollProvider>
      </body>
    </html>
  );
}