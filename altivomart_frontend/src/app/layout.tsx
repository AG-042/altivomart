import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/contexts/cart-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Altivomart - Nigerian E-commerce with Pay on Delivery",
  description: "Shop quality products with pay on delivery across Nigeria. Fast delivery, trusted service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-16">{/* Add top padding for fixed navbar */}
              {children}
            </main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
