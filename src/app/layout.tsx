import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { CartToast } from "@/components/cart-toast";
import { FloatingCartButton } from "@/components/floating-cart-button";
import { MobileTabBar } from "@/components/mobile-tab-bar";
import { ThemeSync } from "@/components/theme-toggle";
import { themeBootScript } from "@/lib/theme";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AppleShop — техника Apple в Кирове",
    template: "%s — AppleShop",
  },
  description:
    "Новые и проверенные б/у устройства Apple. Доставка и самовывоз в Кирове.",
  icons: {
    icon: [
      { url: "/brand/favicon.ico" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full min-w-0 flex-col overflow-x-hidden font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <ThemeSync />
        <CartProvider>
          <div className="flex min-h-full min-w-0 flex-1 flex-col">
            {children}
          </div>
          <MobileTabBar />
          <CartDrawer />
          <CartToast />
          <FloatingCartButton />
        </CartProvider>
      </body>
    </html>
  );
}
