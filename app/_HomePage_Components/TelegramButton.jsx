"use client";

import { Send } from "lucide-react";
import { useEffect, useState } from "react";

export default function TelegramButton() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const telegramUrl = "https://t.me/aktuhelperoffical"; // Replace with your Telegram username

    return (
        <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 right-5 z-40 flex items-center justify-center 
                w-14 h-14 bg-red-400 hover:bg-red-500 text-white 
                rounded-full shadow-lg hover:shadow-xl 
                transition-all duration-300 hover:scale-110"
            aria-label="Contact us on Telegram"
        >
            <Send size={24} />
        </a>
    );
}
