import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/Toaster";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Luxe Market – Shop Cakes, Clothes & More",
    template: "%s | Luxe Market",
  },
  description:
    "Your one-stop destination for premium cakes, cookies, dresses, and everything you love. Fast shipping. Easy returns.",
  keywords: ["online shop", "cakes", "cookies", "dresses", "fashion", "food", "e-commerce"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "Luxe Market",
    title: "Luxe Market – Shop Cakes, Clothes & More",
    description: "Your one-stop destination for premium cakes, cookies, dresses, and everything you love.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
