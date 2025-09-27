import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/contexts/cart-context";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { DebugInfo } from "@/components/debug-info";

export const metadata: Metadata = {
  title: "Altivomart - Home of Tools 🧰",
  description: "Home of Tools 🧰 - Your trusted source for quality products with pay on delivery across Nigeria. Fast delivery, trusted service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-14 sm:pt-16">{/* Add top padding for fixed navbar */}
              {children}
            </main>
            <Footer />
            <WhatsAppFloat />
            <DebugInfo />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
