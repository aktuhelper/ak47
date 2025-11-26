"use client";
import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "./_HomePage_Components/Navbar";
import Footer from "./_HomePage_Components/Footer";
import AktuheperChatbot from "./_HomePage_Components/AktuheperChatbot";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "./providers/ThemeProvider";
import TelegramButton from "./_HomePage_Components/TelegramButton";
import { usePathname } from "next/navigation";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});
export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Routes where footer should be hidden
  const hideFooterRoutes = [
    '/campusconnecthome',
    '/dashboard',
    '/seniors',
    '/juniors',
    '/queries',
    '/trending-queries',
    '/seniormycollege',
    '/juniorothercollege',
    '/seniorfromothercollege',
    '/juniormycollege',
  ];

  // Check if current path should hide footer
  const shouldHideFooter = hideFooterRoutes.some(route =>
    pathname?.startsWith(route)
  );
  return (
    <html lang="en">
      <head>

        {/* ✅ Ezoic CMP scripts */}
        <Script
          src="https://cmp.gatekeeperconsent.com/min.js"
          strategy="beforeInteractive"
          data-cfasync="false"
        />
        <Script
          src="https://the.gatekeeperconsent.com/cmp.min.js"
          strategy="beforeInteractive"
          data-cfasync="false"
        />

        {/* ✅ Ezoic Standalone Ads Script */}
        <Script
          src="//www.ezojs.com/ezoic/sa.min.js"
          async
          strategy="beforeInteractive"
        />
        <Script id="ezoic-standalone-init" strategy="beforeInteractive">
          {`
            window.ezstandalone = window.ezstandalone || {};
            ezstandalone.cmd = ezstandalone.cmd || [];
          `}
        </Script>

        {/* ✅ AdSense Global Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2119897152920774"
          crossOrigin="anonymous"
        />
      </head>

      <body className={`${outfit.variable} antialiased`}>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          {!shouldHideFooter && <Footer />}
          {!shouldHideFooter && < TelegramButton />}
          {!shouldHideFooter && <AktuheperChatbot />}
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  );
}
