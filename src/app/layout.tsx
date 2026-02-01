import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/Navbar"; 
import Footer from "./components/layout/Footer";
import ScrollProvider from "./components/providers/ScrollProviders";

// 1. Optimize Font Loading
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap", 
  weight: ["300", "400", "500", "700", "900"], 
});

// 2. Define Viewport
export const viewport: Viewport = {
  themeColor: "#ea580c", 
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// 3. Ultimate SEO Metadata Configuration
export const metadata: Metadata = {
  metadataBase: new URL('https://graingrid-frontend.vercel.app'), 
  
  title: {
    default: "GrainGrid | Premium Agricultural Export",
    template: "%s | GrainGrid",
  },
  
  description: "Experience the intersection of nature's purity and modern curation. We export premium organic rice, authentic spices, and pulses worldwide.",
  
  applicationName: "GrainGrid Portfolio",
  authors: [{ name: "GrainGrid Team" }],
  generator: "Next.js",
  keywords: ["Organic Rice", "Premium Spices", "Agricultural Export", "Basmati Rice", "Global Trade", "Sustainable Farming", "Wholesale Pulses"],
  
  openGraph: {
    title: "GrainGrid | Premium Agricultural Export",
    description: "Sourcing the finest organic harvests with a commitment to transparency and unmatched quality.",
    url: "https://graingrid-frontend.vercel.app",
    siteName: "GrainGrid",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "GrainGrid Premium Harvests",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "GrainGrid | Cultivating Excellence",
    description: "Global export of premium organic grains and spices.",
    images: ["/og-image.jpg"], 
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* ADDED: overflow-x-hidden to prevent horizontal scrolling issues on mobile */}
      <body className={`${jost.variable} ${jost.className} antialiased bg-zinc-50 text-zinc-900 selection:bg-orange-600 selection:text-white overflow-x-hidden`}>
        
        <ScrollProvider>
          <Navbar />
          
          {/* REMOVED: Constraints here. We let the page children decide their width. */}
          <main className="min-h-screen relative flex flex-col w-full">
            {children}
          </main>
          
          <Footer />
        </ScrollProvider>
        
      </body>
    </html>
  );
}