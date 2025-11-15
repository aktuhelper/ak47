"use client";

import { useEffect } from "react";

export default function AdBanner({ slot, style = {} }) {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("Ad Error:", e);
        }
    }, []);

    return (
        <div className="w-full bg-theme-card border border-theme rounded-lg p-4 transition-colors duration-300">
            <ins
                className="adsbygoogle"
                style={{ display: "block", ...style }}
                data-ad-client="ca-pub-2119897152920774"
                data-ad-slot={slot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
}