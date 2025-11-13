import { Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "./_HomePage_Components/Navbar";
import Footer from "./_HomePage_Components/Footer";
import AktuheperChatbot from "./_HomePage_Components/AktuheperChatbot";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Aktuhelper Home Page",
  description: "Professional Homepage built with Outfit font",
  icons: {
    icon: "/logoxxx.svg",
  },
  other: {
    "algolia-site-verification": "6C788F7C6ADC5113",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <AktuheperChatbot />
      </body>
    </html>
  );
}