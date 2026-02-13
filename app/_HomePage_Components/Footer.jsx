"use client";

import { useEffect, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
export default function Footer() {
    const [status, setStatus] = useState("");
    const [email, setEmail] = useState("");
    const { user, isAuthenticated } = useKindeBrowserClient();
    // Prefill email when user logs in

    const username = isAuthenticated ? user?.given_name || user?.email : null;
    // Handle newsletter subscribe
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email,username }),
            });

            const data = await res.json();

            if (data.success) {
                setStatus("success");
                setEmail("");
                setTimeout(() => setStatus(""), 4000);
            } else {
                setStatus("error");
            }
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    // Footer links
    const footerLinks = {
        Platform: [
            { name: "Previous Year Papers", href: "/papers" },
            { name: "Study Notes", href: "/notes" },
            { name: "AI Assistant", href: "/ai-assistant" },
            { name: "Video Lectures", href: "/lectures" },
            { name: "Mock Tests", href: "/tests" },
        ],
        Resources: [
            { name: "All Branches", href: "/branches" },
            { name: "Syllabus", href: "/syllabus" },
            { name: "Exam Pattern", href: "/pattern" },
            { name: "Study Tips", href: "/tips" },
            { name: "Blog", href: "/blog" },
        ],
        Company: [
            { name: "About Us", href: "/about" },
            { name: "Contact", href: "/contact" },
            { name: "Careers", href: "/careers" },
            { name: "Press Kit", href: "/press" },
            { name: "Partners", href: "/partners" },
        ],
        Support: [
            { name: "Help Center", href: "/help" },
            { name: "Community Forum", href: "/community" },
            { name: "Report Issue", href: "/report" },
            { name: "Feature Request", href: "/request" },
            { name: "FAQs", href: "/faqs" },
        ],
    };

    // SVG social icons (restored)
    const socialLinks = [
        {
            name: "Facebook",
            href: "https://facebook.com",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073C24 5.373 18.627 0 12 0S0 5.373 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
        },
        {
            name: "Twitter",
            href: "https://twitter.com",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775A4.958 4.958 0 0023.953 4.57a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.923 4.923 0 003.946 4.827A4.996 4.996 0 016.996 15.03a4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105A13.995 13.995 0 007.055 21c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
            ),
        },
       
        {
            name: "LinkedIn",
            href: "https://linkedin.com",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>

            ),
        },
        {
            name: "YouTube",
            href: "https://youtube.com",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            ),
        },
    ];

    return (
        <footer className="relative bg-black text-gray-300">
            {/* Top Gradient Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Newsletter Section */}
                <div className="py-12 border-b border-gray-800">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
                            <p className="text-gray-400">
                                Subscribe to our newsletter for the latest study materials, exam updates, and tips.
                            </p>
                        </div>

                        <div>
                            {status === "success" ? (
                                <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <svg
                                        className="w-5 h-5 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-green-500 font-semibold">Thanks for subscribing!</span>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex gap-2">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:scale-105"
                                    >
                                        {status === "loading" ? "Subscribing..." : "Subscribe"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Footer */}
                <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    <div className="col-span-2">
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <a href="/" className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-gray-800">
                                        <img
                                            src="/logo_192.png" // ✅ replace with your logo path
                                            alt="AKTU Helper Logo"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className="text-xl font-bold text-white">AKTUHELPER</span>
                                    </a>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">
                                Your complete study companion for AKTU exams. Empowering 50,000+ students to achieve academic excellence.
                            </p>
                            <div className="flex gap-3">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition-all hover:scale-110"
                                        aria-label={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-white font-semibold mb-4">{category}</h4>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-400">
                            © {new Date().getFullYear()} AKTUHELPER. All rights reserved.
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                            <a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                            <a href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
                            <a href="/sitemap" className="text-gray-400 hover:text-white transition-colors">Sitemap</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Gradient */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        </footer>
    );
}
